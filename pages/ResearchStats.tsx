
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FileText, Users, Award } from 'lucide-react';

const ResearchStats: React.FC = () => {
  const contributionData = [
    { name: 'Biometrics', value: 45, color: '#4f46e5' },
    { name: 'Cybersecurity', value: 30, color: '#06b6d4' },
    { name: 'Patient UX', value: 15, color: '#10b981' },
    { name: 'Hardware', value: 10, color: '#f59e0b' },
  ];

  const publicationData = [
    { area: 'Q1', papers: 5 },
    { area: 'Q2', papers: 8 },
    { area: 'Q3', papers: 12 },
    { area: 'Q4', papers: 7 },
  ];

  const StatBox = ({ icon, label, value, color }: any) => (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5 hover:shadow-lg transition-all duration-300">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-sm`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
            <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
        </div>
      </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Research Contribution Reports</h1>
        <p className="text-slate-500 mt-1">Tracking academic output and research areas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <StatBox 
            icon={<FileText size={28} className="text-blue-600" />}
            label="Total Publications"
            value="42"
            color="bg-blue-50"
         />
         <StatBox 
            icon={<Users size={28} className="text-purple-600" />}
            label="Active Contributors"
            value="18"
            color="bg-purple-50"
         />
         <StatBox 
            icon={<Award size={28} className="text-orange-600" />}
            label="Citations"
            value="156"
            color="bg-orange-50"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Research Areas Distribution</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                            data={contributionData} 
                            innerRadius={60} 
                            outerRadius={80} 
                            paddingAngle={5} 
                            dataKey="value"
                            stroke="none"
                        >
                            {contributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-6 flex-wrap">
                {contributionData.map(d => (
                    <div key={d.name} className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1 rounded-full">
                        <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: d.color}}></span>
                        {d.name} <span className="text-slate-400">({d.value}%)</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Publication Output (Quarterly)</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={publicationData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="area" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="papers" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchStats;
