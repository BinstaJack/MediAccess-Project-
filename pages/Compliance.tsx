
import React, { useState, useRef, useEffect } from 'react';
import { Shield, Lock, FileCheck, Bot, Send, AlertTriangle, CheckCircle, User } from 'lucide-react';
import { analyzeSecurityLog, askComplianceQuestion } from '../services/geminiService';
import { SecurityLog, UserRole } from '../types';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const Compliance: React.FC = () => {
  const userRole = (localStorage.getItem('userRole') as UserRole) || 'STAFF';
  const canAnalyze = userRole === 'ADMIN' || userRole === 'STAFF';

  const [logs] = useState<SecurityLog[]>([
    { id: 101, timestamp: '2023-10-27 10:45:22', event: 'Multiple failed auth attempts (User ID: 882)', severity: 'High', status: 'Pending' },
    { id: 102, timestamp: '2023-10-27 09:12:05', event: 'New device registration (Admin)', severity: 'Medium', status: 'Resolved' },
    { id: 103, timestamp: '2023-10-27 08:30:00', event: 'Routine database backup successful', severity: 'Low', status: 'Resolved' },
  ]);

  const [aiAnalysis, setAiAnalysis] = useState<Record<number, string>>({});
  const [loadingAnalysis, setLoadingAnalysis] = useState<number | null>(null);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: 'init', role: 'ai', text: 'Hello. I am the Compliance Officer AI. Ask me about HIPAA regulations, GDPR data rights, or MediFace security protocols.', timestamp: new Date() }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleAnalyze = async (log: SecurityLog) => {
    setLoadingAnalysis(log.id);
    const analysis = await analyzeSecurityLog(`Event: ${log.event}, Severity: ${log.severity}`);
    setAiAnalysis(prev => ({ ...prev, [log.id]: analysis }));
    setLoadingAnalysis(null);
  };

  const handleAskCompliance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);
    
    try {
        const response = await askComplianceQuestion(userMsg.text);
        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: response,
            timestamp: new Date()
        };
        setChatHistory(prev => [...prev, aiMsg]);
    } catch (error) {
        const errorMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            text: "I apologize, but I'm unable to access the compliance database right now.",
            timestamp: new Date()
        };
        setChatHistory(prev => [...prev, errorMsg]);
    } finally {
        setChatLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Security & Compliance Center</h1>
        <p className="text-slate-500 mt-1">Real-time threat analysis and regulatory guidance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Compliance Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
             <Shield className="text-blue-600" size={20} />
             Regulatory Status
           </h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                 <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                        <FileCheck size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">HIPAA</p>
                        <p className="text-xs text-slate-500">Health Insurance Portability</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                    <CheckCircle size={12} /> COMPLIANT
                 </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                 <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <Lock size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">GDPR / POPIA</p>
                        <p className="text-xs text-slate-500">Data Protection & Privacy</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                    <CheckCircle size={12} /> COMPLIANT
                 </div>
              </div>
           </div>
        </div>

        {/* AI Assistant - Chat Interface */}
        <div className="bg-white p-0 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[400px] overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <div className="bg-purple-100 p-1.5 rounded-lg text-purple-600">
                    <Bot size={18} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Compliance AI Officer</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white custom-scrollbar">
                {chatHistory.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-purple-100 text-purple-600'}`}>
                                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </div>
                            <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-slate-900 text-white rounded-tr-none' 
                                : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
                {chatLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                            <Bot size={14} className="text-purple-500 animate-bounce" />
                            Consulting compliance database...
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleAskCompliance} className="p-3 border-t border-slate-100 bg-slate-50 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about data retention or encryption..."
                  className="flex-grow px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                />
                <button 
                  type="submit"
                  disabled={chatLoading}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white p-2.5 rounded-xl transition-colors shadow-sm"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
      </div>

      {/* Security Logs Analysis */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle size={20} className="text-amber-500" />
                Security Log Analysis
            </h3>
            <span className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                AI Agent Ready
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                        <th className="py-4 px-4 rounded-tl-xl">Timestamp</th>
                        <th className="py-4 px-4">Event</th>
                        <th className="py-4 px-4">Severity</th>
                        <th className="py-4 px-4 rounded-tr-xl">Risk Assessment</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {logs.map((log) => (
                        <React.Fragment key={log.id}>
                            <tr className="hover:bg-slate-50 transition-colors group">
                                <td className="py-4 px-4 text-sm text-slate-500 font-mono">{log.timestamp}</td>
                                <td className="py-4 px-4 text-sm font-bold text-slate-700">{log.event}</td>
                                <td className="py-4 px-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                        log.severity === 'High' ? 'bg-red-50 text-red-600 border-red-100' :
                                        log.severity === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                        'bg-blue-50 text-blue-600 border-blue-100'
                                    }`}>
                                        {log.severity.toUpperCase()}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <button 
                                        onClick={() => handleAnalyze(log)}
                                        disabled={!!aiAnalysis[log.id] || loadingAnalysis === log.id || !canAnalyze}
                                        className="text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-100"
                                    >
                                        <Bot size={14} />
                                        {loadingAnalysis === log.id ? "Analyzing..." : "Analyze Risk"}
                                    </button>
                                </td>
                            </tr>
                            {aiAnalysis[log.id] && (
                                <tr className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <td colSpan={4} className="p-4 pt-0 border-none">
                                        <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl relative ml-8">
                                            <div className="absolute top-[-6px] left-6 w-3 h-3 bg-purple-50 border-t border-l border-purple-100 transform rotate-45"></div>
                                            <h5 className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                                                <Bot size={12} /> AI Mitigation Strategy
                                            </h5>
                                            <p className="text-sm text-slate-700 leading-relaxed">{aiAnalysis[log.id]}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default Compliance;
