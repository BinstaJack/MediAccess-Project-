
import React, { useState, useRef, useEffect } from 'react';
import { Patient, UserRole, PatientStatus } from '../types';
import { Search, UserPlus, Activity, X, Save, Edit2, Phone, Calendar, Clock, User, History, Stethoscope, Heart, FileText, Printer, AlertCircle, Layout, List, ArrowRight, Mic, MicOff, Loader2 } from 'lucide-react';
import { useMockData } from '../context/MockDataContext';
import { PATIENT_AFFIRMATIONS } from '../context/MockDataContext';

// Declare global type for webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const PatientManagement: React.FC = () => {
    const userRole = localStorage.getItem('userRole') as UserRole;
    const { patients, addPatient, updatePatient } = useMockData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isChartModalOpen, setIsChartModalOpen] = useState(false);
    const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

    // Form States
    const [newPatient, setNewPatient] = useState({ name: '', dob: '', contact: '', history: '' });
    
    // Update States
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [patientEditForm, setPatientEditForm] = useState({ name: '', dob: '', contact: '', history: '' });
    const [chartUpdate, setChartUpdate] = useState({ note: '', diagnosis: '', bp: '', heartRate: '', temp: '' });
    
    // Voice State
    const [isRecording, setIsRecording] = useState(false);
    const [voiceError, setVoiceError] = useState('');
    const recognitionRef = useRef<any>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if (window.SpeechRecognition || window.webkitSpeechRecognition) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0])
                    .map((result: any) => result.transcript)
                    .join('');
                
                // Append or replace? Simple replacement of current transcription session for now to avoid complexity
                // In a real app, you'd manage cursor position. Here we just update state.
                // We'll just update the note with what we hear.
                // To avoid overwriting existing text completely, we'd need better logic, but for demo:
                // We will just set the "listening" part.
                setChartUpdate(prev => ({
                    ...prev,
                    note: prev.note + (prev.note && !prev.note.endsWith(' ') ? ' ' : '') + transcript
                }));
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
                setVoiceError('Microphone error. Falling back to text.');
                setIsRecording(false);
            };
            
            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
    }, []);

    if (userRole !== 'STAFF' && userRole !== 'ADMIN') {
        return <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center h-full">
            <AlertCircle size={48} className="text-slate-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-700">Access Restricted</h2>
            <p>Patient Management is available to Medical Staff and Administrators only.</p>
        </div>;
    }

    const handleAddPatient = (e: React.FormEvent) => {
        e.preventDefault();
        const p: Patient = {
            id: Date.now().toString(),
            name: newPatient.name,
            dob: newPatient.dob,
            contact: newPatient.contact,
            history: newPatient.history,
            lastVisit: new Date().toISOString().split('T')[0],
            status: 'Waiting', // Default status
            notes: [],
            vitals: { bp: '-', heartRate: '-', temp: '-' }
        };
        addPatient(p);
        setIsAddModalOpen(false);
        setNewPatient({ name: '', dob: '', contact: '', history: '' });
    };

    const openChart = (p: Patient) => {
        setSelectedPatient(p);
        setPatientEditForm({
            name: p.name,
            dob: p.dob,
            contact: p.contact,
            history: p.history
        });
        setChartUpdate({ note: '', diagnosis: '', bp: '', heartRate: '', temp: '' });
        setIsEditingProfile(false);
        setIsChartModalOpen(true);
        setIsRecording(false);
        setVoiceError('');
    };

    const handleUpdateChart = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient) return;
        const today = new Date().toISOString().split('T')[0];
        const author = userRole === 'ADMIN' ? 'System Admin' : 'Staff Member';
        
        let newNotes = [...selectedPatient.notes];
        
        if (chartUpdate.diagnosis) {
             newNotes.unshift({
                date: today,
                text: `DIAGNOSIS: ${chartUpdate.diagnosis}`,
                author: author
            });
        }

        if (chartUpdate.note) {
            newNotes.unshift({
                date: today,
                text: chartUpdate.note,
                author: author
            });
        }

        const newVitals = { ...selectedPatient.vitals };
        const vitalLogParts: string[] = [];

        if (chartUpdate.bp) {
            newVitals.bp = chartUpdate.bp;
            vitalLogParts.push(`BP: ${chartUpdate.bp}`);
        }
        if (chartUpdate.heartRate) {
            newVitals.heartRate = chartUpdate.heartRate;
            vitalLogParts.push(`HR: ${chartUpdate.heartRate} bpm`);
        }
        if (chartUpdate.temp) {
            newVitals.temp = chartUpdate.temp;
            vitalLogParts.push(`Temp: ${chartUpdate.temp}°C`);
        }

        if (vitalLogParts.length > 0) {
            newNotes.unshift({ 
                date: today, 
                text: `Vitals Check: ${vitalLogParts.join(', ')}`, 
                author: author 
            });
        }

        const updates: Partial<Patient> = {
            name: patientEditForm.name,
            dob: patientEditForm.dob,
            contact: patientEditForm.contact,
            history: patientEditForm.history,
            vitals: newVitals,
            notes: newNotes,
            lastVisit: today
        };
        updatePatient(selectedPatient.id, updates);
        setIsChartModalOpen(false);
    };

    const toggleVoiceDictation = () => {
        if (isRecording) {
            // Stop recording
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            setIsRecording(false);
        } else {
            // Start recording
            setVoiceError('');
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                    setIsRecording(true);
                } catch (e) {
                    console.error("Failed to start speech recognition", e);
                    setVoiceError('Could not access microphone.');
                }
            } else {
                // Fallback Simulation for environments without Speech API
                setIsRecording(true);
                setTimeout(() => {
                    setChartUpdate(prev => ({
                        ...prev,
                        note: prev.note + (prev.note ? " " : "") + "[Simulated Voice]: Patient reports mild discomfort in left arm. Persistent cough for 3 days. Recommend X-Ray if symptoms persist."
                    }));
                    setIsRecording(false);
                }, 2000);
            }
        }
    };

    const advancePatientStatus = (patientId: string, currentStatus: PatientStatus) => {
        const flow: PatientStatus[] = ['Waiting', 'Triage', 'Consultation', 'Observation', 'Discharged'];
        const idx = flow.indexOf(currentStatus);
        if (idx < flow.length - 1) {
            const nextStatus = flow[idx + 1];
            updatePatient(patientId, { status: nextStatus });
        }
    };

    const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Kanban Columns
    const renderKanbanColumn = (title: string, status: PatientStatus, color: string) => {
        const columnPatients = filteredPatients.filter(p => p.status === status);
        
        return (
            <div className="flex-1 bg-slate-50 rounded-xl p-4 min-w-[280px] border border-slate-200 flex flex-col">
                <div className={`flex items-center justify-between mb-4 pb-2 border-b border-slate-200`}>
                    <h3 className={`font-bold ${color} uppercase tracking-wider text-xs`}>{title}</h3>
                    <span className="bg-white text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">{columnPatients.length}</span>
                </div>
                <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar min-h-[100px]">
                    {columnPatients.map(p => (
                        <div key={p.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-800 text-sm">{p.name}</h4>
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{p.name.charAt(0)}</div>
                            </div>
                            
                            {/* NEW: Inline Vitals Display for Kanban */}
                            <div className="grid grid-cols-3 gap-1 mb-3 text-[10px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                                <div className="text-center"><span className="block font-bold text-slate-700">BP</span>{p.vitals.bp}</div>
                                <div className="text-center border-l border-slate-200"><span className="block font-bold text-slate-700">HR</span>{p.vitals.heartRate}</div>
                                <div className="text-center border-l border-slate-200"><span className="block font-bold text-slate-700">°C</span>{p.vitals.temp}</div>
                            </div>

                            <p className="text-xs text-slate-500 mb-3 line-clamp-1">{p.history}</p>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                                <button onClick={() => openChart(p)} className="text-xs text-blue-600 font-bold hover:underline">View Chart</button>
                                {status !== 'Discharged' && (
                                    <button 
                                        onClick={() => advancePatientStatus(p.id, status)}
                                        className="p-1.5 rounded-full hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"
                                        title="Move to Next Stage"
                                    >
                                        <ArrowRight size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {columnPatients.length === 0 && (
                        <div className="text-center py-8 text-slate-300 text-xs italic">No patients</div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Patient Management</h1>
                    <p className="text-slate-500 mt-1">Register new patients and update clinical charts.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                     <button
                        onClick={() => setIsResourcesModalOpen(true)}
                        className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 px-5 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                        <Heart size={18} />
                        Recovery Resources
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-200 hover:-translate-y-0.5"
                    >
                        <UserPlus size={18} />
                        Register Patient
                    </button>
                </div>
            </div>

            {/* Controls & Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0">
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search patients..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition-shadow" />
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <List size={16} /> List
                    </button>
                    <button 
                        onClick={() => setViewMode('board')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'board' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Layout size={16} /> Board
                    </button>
                </div>
            </div>

            {/* View Content */}
            <div className="flex-1 overflow-hidden min-h-[400px]">
                {viewMode === 'list' ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4">Patient Name</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">DOB & Contact</th>
                                        <th className="px-6 py-4">History</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredPatients.length === 0 ? (<tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No patients found.</td></tr>) : 
                                    filteredPatients.map(p => (
                                        <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 font-semibold text-slate-800 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold border border-emerald-200">{p.name.charAt(0)}</div>
                                                {p.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                    p.status === 'Waiting' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    p.status === 'Triage' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    p.status === 'Consultation' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                    p.status === 'Discharged' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                <div className="flex items-center gap-2 mb-0.5"><Calendar size={12} className="text-slate-400"/> {p.dob}</div>
                                                <div className="flex items-center gap-2 text-xs text-slate-400"><Phone size={12}/> {p.contact}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium text-slate-600 border border-slate-200">{p.history}</span></td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => openChart(p)} className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-2 shadow-sm hover:shadow">
                                                    <Activity size={14} /> Update Chart
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4 h-full overflow-x-auto pb-4">
                        {renderKanbanColumn('Waiting Room', 'Waiting', 'text-amber-600')}
                        {renderKanbanColumn('Triage', 'Triage', 'text-blue-600')}
                        {renderKanbanColumn('Consultation', 'Consultation', 'text-purple-600')}
                        {renderKanbanColumn('Observation', 'Observation', 'text-emerald-600')}
                    </div>
                )}
            </div>

            {/* Add Patient Modal */}
            {isAddModalOpen && (
               <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
                     <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Register New Patient</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddPatient} className="space-y-4">
                            <div><label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label><input required type="text" value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-slate-700 mb-1">DOB</label><input required type="date" value={newPatient.dob} onChange={e => setNewPatient({ ...newPatient, dob: e.target.value })} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow" /></div>
                                <div><label className="block text-sm font-medium text-slate-700 mb-1">Contact</label><input required type="tel" value={newPatient.contact} onChange={e => setNewPatient({ ...newPatient, contact: e.target.value })} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow" /></div>
                            </div>
                            <div><label className="block text-sm font-medium text-slate-700 mb-1">History</label><textarea required value={newPatient.history} onChange={e => setNewPatient({ ...newPatient, history: e.target.value })} className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none transition-shadow" /></div>
                            <div className="flex justify-end pt-4 border-t border-slate-100 mt-6"><button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-2"><Save size={18} /> Register Patient</button></div>
                        </form>
                    </div>
               </div>
            )}

            {/* Resources Modal */}
            {isResourcesModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
                    <div className="bg-white rounded-2xl p-0 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[85vh]">
                         <div className="p-6 bg-gradient-to-r from-teal-500 to-emerald-500 text-white flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2"><Heart size={24} className="text-white" /> 30-Day Patient Recovery Affirmations</h3>
                                <p className="text-teal-100 text-sm mt-1">Daily encouragement for rehabilitation and wellness.</p>
                            </div>
                            <button onClick={() => setIsResourcesModalOpen(false)} className="text-teal-100 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
                        </div>
                        
                        <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50 flex-1">
                             <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                                 <div className="flex justify-between mb-6 border-b border-slate-100 pb-4">
                                     <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-wider text-xs">
                                         <FileText size={16} /> Printable Resource
                                     </div>
                                     <button className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1.5" onClick={() => window.print()}>
                                         <Printer size={16} /> Print
                                     </button>
                                 </div>
                                 <div className="space-y-3 font-serif text-slate-700 leading-relaxed">
                                     {PATIENT_AFFIRMATIONS.map((line, idx) => {
                                         const [day, text] = line.split(': ');
                                         return (
                                             <div key={idx} className="flex gap-4 p-2 hover:bg-slate-50 rounded transition-colors">
                                                 <span className="font-bold text-emerald-600 w-16 shrink-0">{day}</span>
                                                 <span>{text}</span>
                                             </div>
                                         )
                                     })}
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chart Modal */}
            {isChartModalOpen && selectedPatient && (
                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
                     <div className="bg-white rounded-2xl p-6 w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto flex flex-col border border-slate-100">
                          <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4 shrink-0">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-800">Patient Chart Update</h3>
                                <p className="text-sm text-slate-500 flex items-center gap-2 mt-1"><span className="bg-slate-100 px-2 py-0.5 rounded font-mono font-medium text-xs text-slate-600">ID: #{selectedPatient.id}</span><span>•</span><span>Last Visit: {selectedPatient.lastVisit}</span></p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setIsEditingProfile(!isEditingProfile)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border ${isEditingProfile ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}><Edit2 size={16} /> {isEditingProfile ? 'Editing Mode' : 'Edit Details'}</button>
                                <button onClick={() => setIsChartModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
                            </div>
                        </div>
                        
                         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                             {/* Patient Profile / Demographics */}
                            <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 h-fit">
                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide"><User size={16} className="text-blue-500" /> Patient Profile</h4>
                                <div className="space-y-4">
                                    <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 block">Full Name</label>{isEditingProfile ? (<input type="text" value={patientEditForm.name} onChange={e => setPatientEditForm({...patientEditForm, name: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"/>) : (<p className="font-bold text-slate-800 text-lg">{patientEditForm.name}</p>)}</div>
                                    <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 block">DOB</label>{isEditingProfile ? (<input type="date" value={patientEditForm.dob} onChange={e => setPatientEditForm({...patientEditForm, dob: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"/>) : (<p className="font-medium text-slate-700 flex items-center gap-2"><Calendar size={14} className="text-slate-400" />{patientEditForm.dob}</p>)}</div>
                                    <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 block">Contact</label>{isEditingProfile ? (<input type="text" value={patientEditForm.contact} onChange={e => setPatientEditForm({...patientEditForm, contact: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"/>) : (<p className="font-medium text-slate-700 flex items-center gap-2"><Phone size={14} className="text-slate-400" />{patientEditForm.contact}</p>)}</div>
                                    <div className="pt-2 border-t border-slate-200 mt-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 block">Medical History</label>{isEditingProfile ? (<textarea value={patientEditForm.history} onChange={e => setPatientEditForm({...patientEditForm, history: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white" rows={3}/>) : (<div className="bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-600 italic">{patientEditForm.history}</div>)}</div>
                                </div>
                            </div>

                            {/* Vitals & Clinical History */}
                            <div className="lg:col-span-8 space-y-6">
                                {/* Vitals Entry */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide"><Activity size={16} className="text-rose-500" /> Log New Vitals</h4>
                                    <div className="grid grid-cols-3 gap-6">
                                        <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block text-center">BP</label><input type="text" value={chartUpdate.bp} onChange={e => setChartUpdate({ ...chartUpdate, bp: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono font-bold text-lg focus:ring-2 focus:ring-rose-500 outline-none transition-all placeholder:text-slate-300 hover:border-rose-200" placeholder={selectedPatient.vitals.bp}/></div>
                                        <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block text-center">HR</label><input type="text" value={chartUpdate.heartRate} onChange={e => setChartUpdate({ ...chartUpdate, heartRate: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono font-bold text-lg focus:ring-2 focus:ring-rose-500 outline-none transition-all placeholder:text-slate-300 hover:border-rose-200" placeholder={selectedPatient.vitals.heartRate}/></div>
                                        <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block text-center">Temp</label><input type="text" value={chartUpdate.temp} onChange={e => setChartUpdate({ ...chartUpdate, temp: e.target.value })} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono font-bold text-lg focus:ring-2 focus:ring-rose-500 outline-none transition-all placeholder:text-slate-300 hover:border-rose-200" placeholder={selectedPatient.vitals.temp}/></div>
                                    </div>
                                </div>

                                {/* Clinical Notes & Diagnosis */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[480px]">
                                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide"><History size={16} className="text-purple-500" /> Clinical History</h4>
                                    <div className="flex-1 overflow-y-auto pr-2 mb-4 p-2 custom-scrollbar relative">
                                        <div className="absolute left-[19px] top-2 bottom-0 w-0.5 bg-slate-100"></div>
                                        {selectedPatient.notes.length === 0 && (<div className="flex flex-col items-center justify-center h-full text-slate-400"><Stethoscope size={32} className="mb-2 opacity-20" /><span className="text-xs font-medium">No notes recorded.</span></div>)}
                                        {selectedPatient.notes.map((n, i) => (
                                            <div key={i} className="relative pl-10 mb-6 group">
                                                <div className={`absolute left-[14px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ring-4 z-10 ${n.text.startsWith('DIAGNOSIS:') ? 'bg-amber-500 ring-amber-50' : 'bg-purple-500 ring-purple-50'}`}></div>
                                                <div className={`bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-all ${n.text.startsWith('DIAGNOSIS:') ? 'border-amber-100 bg-amber-50/20' : 'border-slate-100 hover:border-purple-200'}`}>
                                                    <div className="flex justify-between items-center mb-2"><span className="text-xs font-bold text-slate-500 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded"><Calendar size={10} /> {n.date}</span><span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{n.author}</span></div>
                                                    <p className={`text-sm leading-relaxed ${n.text.startsWith('DIAGNOSIS:') ? 'font-bold text-amber-900' : 'text-slate-700'}`}>{n.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 space-y-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">New Diagnosis</label>
                                            <input 
                                                type="text"
                                                value={chartUpdate.diagnosis} 
                                                onChange={e => setChartUpdate({ ...chartUpdate, diagnosis: e.target.value })} 
                                                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-shadow placeholder:text-slate-400" 
                                                placeholder="e.g. Acute Bronchitis" 
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase block">Clinical Notes</label>
                                                <button 
                                                    onClick={toggleVoiceDictation} 
                                                    type="button"
                                                    className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded transition-all ${isRecording ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                                >
                                                    {isRecording ? <Loader2 size={10} className="animate-spin" /> : <Mic size={10} />}
                                                    {isRecording ? 'Listening...' : 'Voice Dictation'}
                                                </button>
                                            </div>
                                            <textarea 
                                                value={chartUpdate.note} 
                                                onChange={e => setChartUpdate({ ...chartUpdate, note: e.target.value })} 
                                                className={`w-full p-2.5 border rounded-xl text-sm resize-none focus:ring-2 outline-none transition-shadow shadow-sm placeholder:text-slate-400 ${isRecording ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-300 focus:ring-purple-500'}`}
                                                placeholder="Enter observations, treatment plan..." 
                                                rows={2}
                                            />
                                            {voiceError && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {voiceError}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                         </div>
                         <div className="flex justify-between items-center pt-5 border-t border-slate-100 mt-auto bg-white sticky bottom-0">
                            <span className="text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Editing as: <span className="font-bold text-slate-600 uppercase">{userRole}</span></span>
                            <div className="flex gap-3"><button onClick={() => setIsChartModalOpen(false)} className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm transition-colors">Cancel</button><button onClick={handleUpdateChart} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 hover:-translate-y-0.5"><Save size={16} /> Save Changes</button></div>
                        </div>
                     </div>
                 </div>
            )}
        </div>
    );
};

export default PatientManagement;