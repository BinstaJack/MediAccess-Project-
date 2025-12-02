
import React, { useState } from 'react';
import { BookOpen, Search, Filter, PlusCircle, X, Save } from 'lucide-react';
import { JournalArticle, UserRole } from '../types';
import { useMockData } from '../context/MockDataContext';

const Journals: React.FC = () => {
  const userRole = localStorage.getItem('userRole') as UserRole;
  const isPartner = userRole === 'PARTNER';
  const { journals, addJournal } = useMockData();
  const [filter, setFilter] = useState<'All' | 'Medical' | 'Research'>('All');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newJournal, setNewJournal] = useState({ 
    title: '', 
    author: '', 
    type: 'Research' as 'Medical' | 'Research', 
    abstract: '',
    date: new Date().toISOString().split('T')[0] // Default to today
  });

  const handleAddJournal = (e: React.FormEvent) => {
      e.preventDefault();
      const article: JournalArticle = {
          id: Date.now().toString(),
          title: newJournal.title,
          author: newJournal.author,
          type: newJournal.type,
          date: newJournal.date,
          abstract: newJournal.abstract
      };
      addJournal(article);
      setIsAddModalOpen(false);
      setNewJournal({ title: '', author: '', type: 'Research', abstract: '', date: new Date().toISOString().split('T')[0] });
  };

  const filtered = journals.filter(j => 
    (filter === 'All' || j.type === filter) &&
    j.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Medical & Research Journals</h1>
            <p className="text-slate-500 mt-1">Access latest publications, white papers, and internal reports.</p>
        </div>
        {isPartner && (
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 shadow-lg hover:shadow-indigo-200 transition-all"
            >
                <PlusCircle size={18} />
                Publish Finding
            </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Search journals..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow shadow-sm"
            />
         </div>
         <div className="flex gap-2">
            {['All', 'Medical', 'Research'].map(f => (
                <button
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        filter === f 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-200'
                    }`}
                >
                    {f}
                </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(journal => (
            <div key={journal.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
                <div className="flex justify-between items-start">
                    <div className="flex gap-5">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                            journal.type === 'Research' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                            <BookOpen size={26} className="group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                {journal.title}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1 font-medium">
                                By {journal.author} • {journal.date}
                            </p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                         journal.type === 'Research' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                        {journal.type}
                    </span>
                </div>
                <div className="mt-4 pl-[76px]">
                    <p className="text-slate-600 text-sm leading-relaxed">{journal.abstract}</p>
                </div>
            </div>
        ))}
      </div>

       {/* Add Journal Modal */}
       {isAddModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800">Publish New Finding</h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full">
                            <X size={20} />
                        </button>
                    </div>
                    <form onSubmit={handleAddJournal} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                            <input required type="text" value={newJournal.title} onChange={e => setNewJournal({ ...newJournal, title: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Research Title" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                                <input required type="text" value={newJournal.author} onChange={e => setNewJournal({ ...newJournal, author: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Lead Researcher" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Publication Date</label>
                                <input required type="date" value={newJournal.date} onChange={e => setNewJournal({ ...newJournal, date: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                            <select value={newJournal.type} onChange={e => setNewJournal({ ...newJournal, type: e.target.value as any })} className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                                <option value="Research">Research</option>
                                <option value="Medical">Medical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Abstract / Summary</label>
                            <textarea required value={newJournal.abstract} onChange={e => setNewJournal({ ...newJournal, abstract: e.target.value })} className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none" placeholder="Brief summary of findings..." />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold shadow-sm transition-all flex items-center gap-2">
                                <Save size={18} /> Publish
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

export default Journals;
