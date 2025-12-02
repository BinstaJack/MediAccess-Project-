

import React, { useState } from 'react';
import { SystemGuide, UserRole } from '../types';
import { UploadCloud, FileText, Trash2, Search, AlertTriangle, Lock, X, CheckCircle2 } from 'lucide-react';
import { useMockData } from '../context/MockDataContext';

const Guides: React.FC = () => {
  const userRole = localStorage.getItem('userRole') as UserRole;
  const { guides, addGuide, deleteGuide } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Upload State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newGuide, setNewGuide] = useState({
    title: '',
    category: 'Setup' as SystemGuide['category'],
    file: null as File | null
  });

  if (userRole !== 'ADMIN') {
    return (
        <div className="p-8 max-w-7xl mx-auto flex items-center justify-center h-[60vh] animate-in fade-in zoom-in duration-300">
            <div className="text-center">
                <div className="bg-red-50 p-6 rounded-full inline-block mb-4">
                    <Lock className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Restricted Access</h2>
                <p className="text-slate-500 mt-2">Only Administrators can manage system guides.</p>
            </div>
        </div>
    );
  }

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const guide: SystemGuide = {
        id: Date.now().toString(),
        title: newGuide.title,
        category: newGuide.category,
        uploadedBy: 'Admin',
        date: new Date().toISOString().split('T')[0],
        size: newGuide.file ? `${(newGuide.file.size / 1024 / 1024).toFixed(1)} MB` : '1.2 MB' // Simulation
    };
    addGuide(guide);
    setIsUploadModalOpen(false);
    setNewGuide({ title: '', category: 'Setup', file: null });
  };

  const filteredGuides = guides.filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Guides</h1>
          <p className="text-slate-500 mt-1">Manage operational documentation and SOPs.</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5"
        >
          <UploadCloud size={18} />
          Upload Guide
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-4 backdrop-blur-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search guides..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-shadow"
            />
          </div>
        </div>

        <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Uploaded</th>
                    <th className="px-6 py-4">Size</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filteredGuides.map(guide => (
                    <tr key={guide.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 group-hover:scale-105 transition-transform">
                                    <FileText size={20} />
                                </div>
                                <span className="font-semibold text-slate-700">{guide.title}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                guide.category === 'Security' ? 'bg-red-50 text-red-600 border-red-100' :
                                guide.category === 'Troubleshooting' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                                {guide.category}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                            {guide.date} by <span className="text-slate-700 font-medium">{guide.uploadedBy}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">{guide.size}</td>
                        <td className="px-6 py-4 text-right">
                            <button 
                                onClick={() => deleteGuide(guide.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        
        {filteredGuides.length === 0 && (
            <div className="p-12 text-center text-slate-500">
                <AlertTriangle className="mx-auto h-12 w-12 text-slate-200 mb-3" />
                <p>No guides found matching your search.</p>
            </div>
        )}
      </div>

       {/* Upload Modal */}
       {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Upload System Guide</h3>
              <button 
                onClick={() => setIsUploadModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUploadSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Guide Title</label>
                    <input 
                        required 
                        type="text" 
                        value={newGuide.title} 
                        onChange={e => setNewGuide({...newGuide, title: e.target.value})} 
                        className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                        placeholder="e.g. Server Maintenance Protocol" 
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select 
                        value={newGuide.category}
                        onChange={e => setNewGuide({...newGuide, category: e.target.value as SystemGuide['category']})}
                        className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="Setup">Setup</option>
                        <option value="Security">Security</option>
                        <option value="Onboarding">Onboarding</option>
                        <option value="Troubleshooting">Troubleshooting</option>
                    </select>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer relative">
                    <input 
                        type="file" 
                        onChange={e => setNewGuide({...newGuide, file: e.target.files ? e.target.files[0] : null})}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {newGuide.file ? (
                        <div className="text-blue-600 flex flex-col items-center">
                            <CheckCircle2 size={32} className="mb-2" />
                            <span className="font-semibold text-sm">{newGuide.file.name}</span>
                            <span className="text-xs text-slate-500 mt-1">{(newGuide.file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                    ) : (
                        <div className="text-slate-400 flex flex-col items-center">
                            <UploadCloud size={32} className="mb-2" />
                            <span className="font-semibold text-sm text-slate-600">Click to upload file</span>
                            <span className="text-xs mt-1">PDF, DOCX, or TXT</span>
                        </div>
                    )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newGuide.title}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                  <UploadCloud size={16} /> Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guides;
