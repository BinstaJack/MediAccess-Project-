
import React from 'react';
import { Activity, Server, FileText, CheckCircle2, ChevronRight, Clock } from 'lucide-react';

const MedicalReports: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Medical Reports & Health Checks</h1>
        <p className="text-slate-500 mt-1">System status reports and operational logs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Server size={20} />
                </div>
                System Health Checks
            </h3>
            <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="group flex items-center justify-between p-4 bg-slate-50 hover:bg-white hover:shadow-md border border-slate-100 hover:border-blue-100 rounded-xl transition-all duration-300 cursor-default">
                        <div className="flex items-center gap-4">
                             <div className="bg-white p-2 rounded-full border border-slate-100 text-slate-400 group-hover:text-blue-500 transition-colors">
                                <Clock size={16} />
                             </div>
                            <div>
                                <p className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors">Daily Diagnostic Run #{1020 + i}</p>
                                <p className="text-xs text-slate-500 font-medium">Ran at 0{8 + i}:00 AM</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                            <CheckCircle2 size={12} /> Passed
                        </span>
                    </div>
                ))}
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                    <FileText size={20} />
                </div>
                Access Logs
            </h3>
             <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="group p-5 bg-white border border-slate-200 rounded-xl hover:shadow-lg hover:border-purple-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors">Weekly Access Summary</h4>
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Oct 2{i}, 2024</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                            Overview of biometric authentication attempts, failures, and system latency for Ward A.
                        </p>
                        <div className="flex items-center text-xs font-bold text-purple-600 group-hover:gap-2 transition-all">
                            View Report <ChevronRight size={14} />
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default MedicalReports;
