
import React, { useState } from 'react';
import { Trainee, UserRole } from '../types';
import { ClipboardCheck, Star, Clock, FileText, ChevronDown, CheckCircle, UserCheck, Filter, AlertCircle, BookOpen, BarChart2, MessageSquare } from 'lucide-react';
import { useMockData } from '../context/MockDataContext';

// Mock Data for Journals linked to trainees
const MOCK_JOURNALS_BY_TRAINEE: Record<string, {title: string, date: string, type: 'Medical'|'Research', status: string}[]> = {
    '1': [
        { title: 'Pediatric Biometrics in Emergency Care', date: '2023-09-15', type: 'Research', status: 'Published' },
        { title: 'Ethical Implications of Facial Scanning', date: '2023-10-02', type: 'Medical', status: 'Under Review' },
        { title: 'Ward A: Efficiency Report Q3', date: '2023-10-20', type: 'Medical', status: 'Draft' }
    ],
    '2': [
        { title: 'Zero-Trust Architecture for Healthcare IoT', date: '2023-08-10', type: 'Research', status: 'Published' },
        { title: 'Latency Analysis of 5G Networks', date: '2023-09-05', type: 'Research', status: 'Published' }
    ],
    '3': [
        { title: 'Preliminary Data on Patient Acceptance', date: '2023-10-12', type: 'Research', status: 'Pending Approval' }
    ]
};

const AVAILABLE_SUPERVISORS = [
    'Prof. Alan Grant',
    'Dr. Ellie Sattler',
    'Dr. Ian Malcolm',
    'Dr. Sarah Harding'
];

type TabType = 'overview' | 'journals' | 'reviews';

const PerformanceReviews: React.FC = () => {
    const userRole = localStorage.getItem('userRole') as UserRole;
    const { trainees, updateTrainee } = useMockData();
    const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);
    const [reviewComment, setReviewComment] = useState('');
    const [showOnlyMyAssignees, setShowOnlyMyAssignees] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    // Mock logged-in supervisor for demo purposes
    const CURRENT_USER_NAME = 'Prof. Alan Grant';

    // Allow Partners, Admin, AND Staff to access
    if (userRole !== 'PARTNER' && userRole !== 'ADMIN' && userRole !== 'STAFF') {
         return (
            <div className="p-8 h-[50vh] flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
                <div className="bg-slate-100 p-6 rounded-full mb-6">
                    <AlertCircle className="text-slate-400 w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Access Restricted</h2>
                <p className="text-slate-500 mt-2">Only Academic Partners, Admins, and Medical Staff can view performance data.</p>
            </div>
         );
    }

    const canAssignSupervisor = userRole === 'PARTNER' || userRole === 'ADMIN';
    const canLogReview = userRole === 'PARTNER' || userRole === 'ADMIN';

    const handleLogReview = () => {
        if (!selectedTrainee || !reviewComment) return;
        const newReview = { date: new Date().toISOString().split('T')[0], comment: reviewComment, author: CURRENT_USER_NAME };
        const updatedReviews = [...selectedTrainee.reviews, newReview];
        
        updateTrainee(selectedTrainee.id, { reviews: updatedReviews });
        
        // Update local selected state to reflect changes immediately
        setSelectedTrainee({ ...selectedTrainee, reviews: updatedReviews });
        setReviewComment('');
    };

    const handleAssignSupervisor = (supervisorName: string) => {
        if (!selectedTrainee) return;
        updateTrainee(selectedTrainee.id, { assignedSupervisor: supervisorName });
        setSelectedTrainee({ ...selectedTrainee, assignedSupervisor: supervisorName });
    };

    const filteredTrainees = showOnlyMyAssignees 
        ? trainees.filter(t => t.assignedSupervisor === CURRENT_USER_NAME)
        : trainees;

    const journals = selectedTrainee ? (MOCK_JOURNALS_BY_TRAINEE[selectedTrainee.id] || []) : [];

    return (
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Performance Reviews</h1>
                    <p className="text-slate-500 mt-1">Monitor trainee progress and supervisor assignments.</p>
                </div>
                
                {canAssignSupervisor && (
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-slate-600">Filter:</label>
                        <button 
                            onClick={() => setShowOnlyMyAssignees(!showOnlyMyAssignees)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm ${
                                showOnlyMyAssignees 
                                ? 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700' 
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-indigo-200'
                            }`}
                        >
                            <Filter size={16} />
                            {showOnlyMyAssignees ? 'My Assignees' : 'All Trainees'}
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Trainee List Column */}
                <div className="md:col-span-5 space-y-4">
                    {filteredTrainees.map(t => (
                        <div key={t.id} onClick={() => { setSelectedTrainee(t); setActiveTab('overview'); }} className={`cursor-pointer bg-white p-6 rounded-2xl shadow-sm border transition-all duration-200 group ${selectedTrainee?.id === t.id ? 'border-indigo-500 ring-2 ring-indigo-50 shadow-md transform scale-[1.01]' : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${selectedTrainee?.id === t.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">{t.name}</h3>
                                        <p className="text-sm text-slate-500">{t.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg text-sm font-bold border border-amber-100">
                                    <Star size={14} fill="currentColor" className="text-amber-500" /> {t.supervisorRating}
                                </div>
                            </div>
                            
                            <div className="mb-5 pl-[64px]">
                                <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg w-fit border ${t.assignedSupervisor ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                    <UserCheck size={14} />
                                    {t.assignedSupervisor ? `Supervisor: ${t.assignedSupervisor}` : 'Unassigned'}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center border-t border-slate-100 pt-4">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Performance</p>
                                    <p className="font-bold text-slate-800 text-lg">{t.performance}%</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Clinical Hours</p>
                                    <p className="font-bold text-slate-800 text-lg">{t.clinicalHours}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-wider">Journals</p>
                                    <p className="font-bold text-slate-800 text-lg">{t.journalEntries}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detailed Profile Panel */}
                <div className="md:col-span-7">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-fit sticky top-8 animate-in fade-in slide-in-from-right-4 duration-300 overflow-hidden">
                    {selectedTrainee ? (
                        <>
                            <div className="p-8 border-b border-slate-100">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-800">{selectedTrainee.name}</h3>
                                        <p className="text-sm text-slate-500 mt-1">Trainee Profile & Reviews</p>
                                    </div>
                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
                                        ID: #{selectedTrainee.id}
                                    </span>
                                </div>

                                {/* Tabs */}
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setActiveTab('overview')}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        <BarChart2 size={16} /> Overview
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('journals')}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'journals' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        <BookOpen size={16} /> Journal Entries
                                        {journals.length > 0 && <span className="bg-indigo-200 text-indigo-800 text-[10px] px-1.5 rounded-full">{journals.length}</span>}
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('reviews')}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${activeTab === 'reviews' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        <MessageSquare size={16} /> Reviews
                                    </button>
                                </div>
                            </div>

                            <div className="p-8">
                                {/* TAB: Overview */}
                                {activeTab === 'overview' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                            <h4 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
                                                <UserCheck size={16} className="text-indigo-600" />
                                                Supervisor Assignment
                                            </h4>
                                            {canAssignSupervisor ? (
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">Assign To</label>
                                                    <div className="relative">
                                                        <select 
                                                            value={selectedTrainee.assignedSupervisor || ''}
                                                            onChange={(e) => handleAssignSupervisor(e.target.value)}
                                                            className="w-full p-3 pl-4 pr-10 border border-slate-300 rounded-xl text-sm appearance-none bg-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer hover:border-indigo-300 transition-colors font-medium shadow-sm"
                                                        >
                                                            <option value="" disabled>Select Supervisor</option>
                                                            {AVAILABLE_SUPERVISORS.map(s => (
                                                                <option key={s} value={s}>{s}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 text-sm text-slate-700 font-medium bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-100">
                                                        {selectedTrainee.assignedSupervisor ? selectedTrainee.assignedSupervisor.charAt(0) : '?'}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-400 uppercase font-bold mb-0.5">Current Supervisor</p>
                                                        {selectedTrainee.assignedSupervisor || 'No supervisor assigned yet.'}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-end mb-2">
                                                <label className="text-sm font-bold text-slate-700">Overall Performance</label>
                                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{selectedTrainee.performance}% Achieved</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                                                <div className="bg-indigo-600 h-3 rounded-full transition-all duration-1000 relative" style={{ width: `${selectedTrainee.performance}%` }}>
                                                    <div className="absolute inset-0 bg-white/20"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TAB: Journal Entries */}
                                {activeTab === 'journals' && (
                                     <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <h4 className="font-bold text-slate-700 text-sm mb-2 flex items-center gap-2">
                                            <BookOpen size={16} className="text-indigo-600" /> Research Output
                                        </h4>
                                        {journals.length > 0 ? (
                                            journals.map((j, i) => (
                                                <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${j.type === 'Research' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                                            {j.type}
                                                        </span>
                                                        <span className="text-xs font-medium text-slate-400">{j.date}</span>
                                                    </div>
                                                    <h5 className="font-bold text-slate-800 mb-1">{j.title}</h5>
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                                            j.status === 'Published' ? 'bg-green-100 text-green-700' : 
                                                            j.status === 'Draft' ? 'bg-slate-200 text-slate-600' : 
                                                            'bg-amber-100 text-amber-700'
                                                        }`}>
                                                            {j.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm flex flex-col items-center gap-2">
                                                <BookOpen size={24} className="opacity-50" />
                                                No journal entries found for this trainee.
                                            </div>
                                        )}
                                     </div>
                                )}

                                {/* TAB: Reviews */}
                                {activeTab === 'reviews' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                         <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                            {selectedTrainee.reviews.length === 0 ? (
                                                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm flex flex-col items-center gap-2">
                                                    <MessageSquare size={24} className="opacity-50" />
                                                    No reviews logged yet.
                                                </div>
                                            ) : (
                                                selectedTrainee.reviews.map((r, i) => (
                                                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative hover:border-indigo-100 transition-colors group">
                                                        <div className="absolute top-4 right-4 text-xs text-slate-400 font-medium flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded">
                                                            <Clock size={10} /> {r.date}
                                                        </div>
                                                        <p className="text-sm text-slate-700 leading-relaxed mb-3 pt-1 pr-16">{r.comment}</p>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] text-indigo-700 font-bold border border-indigo-200">
                                                                {r.author.charAt(0)}
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-600">{r.author}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Log Review Form - Only for Partners/Admins */}
                                        {canLogReview && (
                                            <div className="pt-6 border-t border-slate-100">
                                                <label className="block text-sm font-bold text-slate-700 mb-3">Log New Review</label>
                                                <textarea 
                                                    value={reviewComment}
                                                    onChange={(e) => setReviewComment(e.target.value)}
                                                    className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-28 resize-none mb-4 text-sm transition-shadow shadow-sm"
                                                    placeholder={`Enter observations, feedback, or goals for ${selectedTrainee.name}...`}
                                                />
                                                <button 
                                                    onClick={handleLogReview} 
                                                    disabled={!reviewComment.trim()}
                                                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                                                >
                                                    <CheckCircle size={18} /> Submit Review
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-slate-400">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <UserCheck size={40} className="opacity-30 text-slate-500" />
                            </div>
                            <p className="font-bold text-lg text-slate-600">No Trainee Selected</p>
                            <p className="text-sm mt-2 text-slate-400">Select a trainee from the list to view profile, journals, and reviews.</p>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceReviews;
