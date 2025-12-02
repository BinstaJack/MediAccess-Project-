import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Minimize2, Loader2, WifiOff } from 'lucide-react';
import { createSystemChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat, GenerateContentResponse } from "@google/genai";
import { useMockData } from '../context/MockDataContext';

const SystemChatbot: React.FC = () => {
  const { isOffline, patients, tasks, proposals, securityLevel, notifications } = useMockData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Hello! I am the MediAccess System Assistant. Ask me anything about the project proposal, technical specs, or financial projections.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Build the context string from current state
  const buildLiveContext = () => {
      const activePatients = patients.length;
      const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
      const criticalTasks = tasks.filter(t => t.slaRating === 'Critical' && t.status === 'Pending').length;
      const pendingProposals = proposals.filter(p => p.status === 'Pending').length;
      const recentAlerts = notifications.slice(0, 3).map(n => `- ${n.time}: ${n.message}`).join('\n');

      return `
      Current Security Level: ${securityLevel}
      Active Patients Registered: ${activePatients}
      Pending Admin Tasks: ${pendingTasks} (Critical: ${criticalTasks})
      Pending Board Proposals: ${pendingProposals}
      Recent System Alerts:
      ${recentAlerts}
      Current Revenue (YTD): R4.2M (Simulated)
      `;
  };

  useEffect(() => {
    // Initialize chat session on mount with LIVE context
    try {
      const context = buildLiveContext();
      chatSessionRef.current = createSystemChat(context);
    } catch (e) {
      console.error("Failed to init chat", e);
    }
  }, [patients, tasks, securityLevel]); // Re-init if major stats change (optional, might reset chat history though. For now, we trust initial mount or explicit reset)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || !chatSessionRef.current || isOffline) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatSessionRef.current.sendMessageStream({ message: userMsg.text });
      
      let fullText = '';
      // Create a placeholder message for the stream
      setMessages(prev => [...prev, { role: 'model', text: '', timestamp: new Date() }]);

      for await (const chunk of response) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullText += c.text;
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1].text = fullText;
            return newMsgs;
          });
        }
      }
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: 'I apologize, but I encountered an error connecting to the system knowledge base.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all hover:scale-105 z-50 flex items-center gap-2 group ${
            isOffline ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isOffline ? <WifiOff size={24} className="text-slate-200" /> : <MessageSquare size={24} />}
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          {isOffline ? 'AI Offline' : 'Ask MediAccess AI'}
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 z-50 animate-in slide-in-from-bottom-10 fade-in duration-200">
      {/* Header */}
      <div className={`text-white p-4 rounded-t-2xl flex items-center justify-between ${isOffline ? 'bg-slate-700' : 'bg-slate-900'}`}>
        <div className="flex items-center gap-2">
          <div className="bg-white/10 p-1.5 rounded-lg">
            {isOffline ? <WifiOff size={20} className="text-slate-300" /> : <Bot size={20} className="text-blue-400" />}
          </div>
          <div>
            <h3 className="font-bold text-sm">{isOffline ? 'System Offline' : 'MediAccess AI'}</h3>
            <p className="text-xs text-slate-300">{isOffline ? 'Knowledge Base Unreachable' : 'Context-Aware Assistant'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors">
            <Minimize2 size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className={`text-[10px] mt-1 opacity-70 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-blue-600" />
                <span className="text-xs text-slate-500">Processing...</span>
             </div>
          </div>
        )}
        {isOffline && (
            <div className="flex justify-center my-4">
                <span className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100 flex items-center gap-1">
                    <WifiOff size={10} /> Connectivity Lost
                </span>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100 rounded-b-2xl">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isOffline}
            placeholder={isOffline ? "Reconnect to chat..." : "Ask: 'Any critical alerts?'"}
            className={`flex-1 px-4 py-2 bg-slate-100 border-transparent rounded-xl text-sm focus:outline-none transition-all ${isOffline ? 'cursor-not-allowed opacity-60' : 'focus:bg-white border focus:border-blue-500'}`}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || isOffline}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SystemChatbot;