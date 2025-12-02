
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Vote, ThumbsUp, ThumbsDown, CheckCircle2, XCircle, Calendar, History, ListFilter, AlertCircle, PieChart } from 'lucide-react';
import { useMockData } from '../context/MockDataContext';

const BoardReview: React.FC = () => {
    const userRole = localStorage.getItem('userRole') as UserRole;
    const { proposals, voteProposal } = useMockData();
    const [filter, setFilter] = useState<'Pending' | 'History' | 'All'>('Pending');

    if (userRole !== 'INVESTOR' && userRole !== 'ADMIN') {
        return (
            <div className="p-8 h-[50vh] flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                <div className="bg-slate-100 p-6 rounded-full mb-6">
                    <Vote className="text-slate-400 w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Access Restricted</h2>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">This portal is reserved for Board Members and Investors to vote on strategic company decisions.</p>
            </div>
        );
    }

    const handleVote = (id: string, type: 'yes' | 'no') => {
        voteProposal(id, type);
    };

    const filteredProposals = proposals.filter(p => {
        if (filter === 'All') return true;
        if (filter === 'Pending') return p.status === 'Pending';
        if (filter === 'History') return p.status !== 'Pending';
        return true;
    });

    const pendingCount = proposals.filter(p => p.status === 'Pending').length;

    return (
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Board Review</h1>
                    <p className="text-slate-500 mt-1">Review proposals, cast votes, and track strategic decisions.</p>
                </div>
                
                {pendingCount > 0 && (
                     <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm animate-pulse">
                        <AlertCircle size={16} />
                        {pendingCount} Proposal{pendingCount !== 1 ? 's' : ''} Requiring Action
                    </div>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-200 pb-1">
                <button 
                    onClick={() => setFilter('Pending')}
                    className={`px-5 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 ${
                        filter === 'Pending' 
                        ? 'bg-white border-x border-t border-slate-200 text-blue-600 translate-y-[1px] shadow-[0_-2px_5px_rgba(0,0,0,0.02)]' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    <Vote size={16} /> Action Required
                    {pendingCount > 0 && (
                        <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">{pendingCount}</span>
                    )}
                </button>
                <button 
                    onClick={() => setFilter('History')}
                    className={`px-5 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 ${
                        filter === 'History' 
                        ? 'bg-white border-x border-t border-slate-200 text-blue-600 translate-y-[1px] shadow-[0_-2px_5px_rgba(0,0,0,0.02)]' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    <History size={16} /> Voting History
                </button>
                <button 
                    onClick={() => setFilter('All')}
                    className={`px-5 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 ${
                        filter === 'All' 
                        ? 'bg-white border-x border-t border-slate-200 text-blue-600 translate-y-[1px] shadow-[0_-2px_5px_rgba(0,0,0,0.02)]' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                >
                    <ListFilter size={16} /> All Proposals
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 min-h-[400px]">
                {filteredProposals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-slate-400 py-12 border-2 border-dashed border-slate-100 rounded-3xl">
                        <div className="bg-slate-50 p-6 rounded-full mb-4">
                            <CheckCircle2 size={32} className="opacity-50" />
                        </div>
                        <p className="font-medium">No proposals found in this view.</p>
                        <p className="text-sm mt-1">Check back later for new board items.</p>
                    </div>
                ) : filteredProposals.map(p => {
                    const totalVotes = p.votes.yes + p.votes.no;
                    const yesPercent = totalVotes === 0 ? 0 : (p.votes.yes / totalVotes) * 100;

                    return (
                        <div key={p.id} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all group animate-in slide-in-from-bottom-2 duration-300">
                            <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 border shadow-sm ${
                                            p.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                            p.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                                            'bg-rose-100 text-rose-700 border-rose-200'
                                        }`}>
                                            {p.status === 'Pending' && <Vote size={12} />}
                                            {p.status === 'Approved' && <CheckCircle2 size={12} />}
                                            {p.status === 'Rejected' && <XCircle size={12} />}
                                            {p.status}
                                        </span>
                                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                                            <Calendar size={12} /> {p.date}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 leading-tight">{p.title}</h3>
                                </div>
                                <div className="text-right hidden md:block">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-wider">Submitted By</p>
                                    <div className="flex items-center justify-end gap-2 text-sm font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs border border-slate-200 text-slate-500">
                                            {p.submittedBy.charAt(0)}
                                        </div>
                                        {p.submittedBy}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 mb-6 text-sm text-slate-600 leading-relaxed shadow-inner">
                                <p className="font-bold text-slate-700 mb-2 text-xs uppercase flex items-center gap-1.5 opacity-75">
                                    <ListFilter size={12} /> Executive Summary
                                </p>
                                {p.summary}
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-t border-slate-100 gap-6">
                                {/* Vote Visualization */}
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span className="text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-md"><ThumbsUp size={12} /> {p.votes.yes} Yes</span>
                                        <span className="text-rose-500 flex items-center gap-1.5 bg-rose-50 px-2 py-0.5 rounded-md">{p.votes.no} No <ThumbsDown size={12} /></span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                                        <div className="h-full bg-emerald-500 transition-all duration-1000 relative" style={{ width: `${yesPercent}%` }}>
                                             {yesPercent > 0 && <div className="absolute inset-0 bg-white/20"></div>}
                                        </div>
                                        <div className="h-full bg-rose-400 transition-all duration-1000 relative" style={{ width: `${100 - yesPercent}%` }}>
                                             {(100 - yesPercent) > 0 && <div className="absolute inset-0 bg-white/10"></div>}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {p.status === 'Pending' ? (
                                    <div className="flex gap-3 w-full md:w-auto">
                                        <button 
                                            onClick={() => handleVote(p.id, 'no')}
                                            className="flex-1 md:flex-none px-6 py-2.5 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-600 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 group/reject"
                                        >
                                            <ThumbsDown size={16} className="group-hover/reject:scale-110 transition-transform" /> Reject
                                        </button>
                                        <button 
                                            onClick={() => handleVote(p.id, 'yes')}
                                            className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 group/approve"
                                        >
                                            <ThumbsUp size={16} className="group-hover/approve:scale-110 transition-transform" /> Approve
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full md:w-auto text-right">
                                        <span className="text-slate-400 text-sm font-medium flex items-center justify-end gap-1.5 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                                            <PieChart size={16} /> Voting Closed
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BoardReview;
