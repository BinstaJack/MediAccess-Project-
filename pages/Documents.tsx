import React, { useState } from 'react';
import { UserRole } from '../types';
import { Lock, FileText, Download, Bot, AlertTriangle, Send } from 'lucide-react';
import { summarizeDocument } from '../services/geminiService';
import { PROPOSAL_CONTENT, TECHNICAL_CONTENT } from '../data/projectData';

const Documents: React.FC = () => {
  const userRole = (localStorage.getItem('userRole') as UserRole) || 'STAFF';
  const hasAccess = userRole === 'INVESTOR';
  const [activeTab, setActiveTab] = useState<'proposal' | 'technical'>('proposal');
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const activeContent = activeTab === 'proposal' ? PROPOSAL_CONTENT : TECHNICAL_CONTENT;

  const handleSummarize = async () => {
    setLoadingSummary(true);
    const result = await summarizeDocument(activeContent);
    setSummary(result);
    setLoadingSummary(false);
  };

  const handleRequestAccess = () => {
    setRequestStatus('sending');
    setTimeout(() => {
        setRequestStatus('sent');
        setTimeout(() => {
            setIsRequestModalOpen(false);
            setRequestStatus('idle');
        }, 2000);
    }, 1500);
  };

  if (!hasAccess) {
    return (
      <div className="p-8 max-w-7xl mx-auto h-[80vh] flex items-center justify-center">
        <div className="text-center max-w-lg bg-white p-10 rounded-2xl shadow-xl border border-red-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-red-500 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Restricted Access</h2>
          <p className="text-slate-500 mb-6">
            The Confidential Project Documentation is available only to verified <strong>Investors</strong>.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 mb-6 border border-slate-200">
            <p className="flex items-center justify-center gap-2 font-medium">
              <AlertTriangle size={16} className="text-amber-500" />
              Current Role: {userRole}
            </p>
          </div>
          <button 
            onClick={() => setIsRequestModalOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-blue-200"
          >
            Contact Administrator for Access
          </button>
        </div>

        {/* Request Modal */}
        {isRequestModalOpen && (
             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                    {requestStatus === 'sent' ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                <Send size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Request Sent!</h3>
                            <p className="text-slate-500 mt-2">The administrator has been notified.</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Request Document Access</h3>
                            <p className="text-slate-500 text-sm mb-4">
                                Please explain why you require access to these confidential documents.
                            </p>
                            <textarea 
                                className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none mb-4"
                                placeholder="I am a potential investor interested in..."
                            ></textarea>
                            <div className="flex justify-end gap-2">
                                <button 
                                    onClick={() => setIsRequestModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleRequestAccess}
                                    disabled={requestStatus === 'sending'}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                                >
                                    {requestStatus === 'sending' ? 'Sending...' : 'Send Request'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
             </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Documentation</h1>
          <p className="text-slate-500">Confidential materials for Investors.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('proposal')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'proposal' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Business Proposal
          </button>
          <button 
             onClick={() => setActiveTab('technical')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'technical' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Technical Specs
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Viewer */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[600px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="text-slate-500" size={18} />
              <span className="font-semibold text-slate-700">
                {activeTab === 'proposal' ? 'MediAccess_Proposal_v3.0.pdf' : 'MediAccess_Tech_Spec_v3.0.pdf'}
              </span>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
              <Download size={16} /> Download PDF
            </button>
          </div>
          
          <div className="flex-1 p-8 overflow-y-auto bg-white font-serif leading-relaxed text-slate-800">
             <div className="max-w-2xl mx-auto whitespace-pre-wrap">
                {activeContent}
             </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* AI Summarizer */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                   <Bot size={20} />
                </div>
                <h3 className="font-bold text-slate-800">AI Analyst</h3>
             </div>
             <p className="text-sm text-slate-500 mb-4">
               Get a concise executive summary of this document generated by Gemini AI.
             </p>
             
             {summary ? (
               <div className="bg-purple-50 p-4 rounded-lg text-sm text-slate-800 border border-purple-100 mb-4 animate-fadeIn">
                 <strong className="block text-purple-700 mb-2">Executive Summary:</strong>
                 <div className="whitespace-pre-wrap text-xs">{summary}</div>
                 <button 
                  onClick={() => setSummary('')} 
                  className="mt-3 text-xs text-purple-600 hover:underline"
                 >
                   Clear Summary
                 </button>
               </div>
             ) : (
               <button 
                 onClick={handleSummarize}
                 disabled={loadingSummary}
                 className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
               >
                 {loadingSummary ? 'Analyzing...' : 'Summarize Document'}
                 {!loadingSummary && <Bot size={16} />}
               </button>
             )}
          </div>

          {/* Document Metadata */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-bold text-slate-800 mb-4">Document Details</h3>
             <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-slate-500">Last Updated</span>
                  <span className="text-slate-800">Oct 24, 2024</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500">Author</span>
                  <span className="text-slate-800">Lebini Wayne Jack</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs font-bold">APPROVED</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-500">Classification</span>
                  <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs font-bold">CONFIDENTIAL</span>
                </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;