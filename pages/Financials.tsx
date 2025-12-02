import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, TrendingUp, PieChart, Lock } from 'lucide-react';
import { FinancialData, UserRole } from '../types';

const Financials: React.FC = () => {
  const userRole = (localStorage.getItem('userRole') as UserRole) || 'STAFF';
  const isRestricted = userRole === 'STAFF';

  // Data from PDF Page 4: Financial Projection (3-Year Outlook)
  const financialData: FinancialData[] = [
    { year: 'Year 1', revenueUSD: 250000, revenueZAR: 4315000, label: 'Pilot' },
    { year: 'Year 2', revenueUSD: 1200000, revenueZAR: 20712000, label: 'Expansion' },
    { year: 'Year 3', revenueUSD: 3500000, revenueZAR: 60410000, label: 'Regional' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Financial Projections</h1>
        <p className="text-slate-500">Market opportunity and revenue outlook based on current proposal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white shadow-lg">
           <div className="flex items-center gap-3 mb-2 opacity-80">
              <DollarSign size={20} />
              <span className="text-sm font-medium">Global Market by 2030</span>
           </div>
           <h3 className="text-4xl font-bold">R863 Bn</h3>
           <p className="text-sm mt-2 opacity-80">Projected healthcare cybersecurity market size.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-3 mb-2 text-slate-500">
              <TrendingUp size={20} />
              <span className="text-sm font-medium">CAGR Growth</span>
           </div>
           <h3 className="text-4xl font-bold text-slate-800">15-20%</h3>
           <p className="text-sm mt-2 text-slate-500">Expected annual growth for biometric adoption in healthcare.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center gap-3 mb-2 text-slate-500">
              <PieChart size={20} />
              <span className="text-sm font-medium">Initial Budget (Year 1)</span>
           </div>
           <h3 className="text-4xl font-bold text-slate-800">R1.5 M</h3>
           <p className="text-sm mt-2 text-slate-500">Covering salaries, infrastructure, and ops.</p>
        </div>
      </div>

      {/* Charts */}
      {isRestricted ? (
         <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col items-center justify-center h-96 bg-slate-50">
             <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                 <Lock className="text-slate-400 w-8 h-8" />
             </div>
             <h3 className="text-lg font-bold text-slate-700">Financial Data Restricted</h3>
             <p className="text-slate-500 max-w-md text-center mt-2">
                Detailed financial projections and granular revenue data are classified and available only to Investors, Partners, and System Administrators.
             </p>
         </div>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue Projection (ZAR)</h3>
            <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(value) => `R${(value / 1000000).toFixed(1)}M`} 
                />
                <Tooltip 
                    formatter={(value: number) => [`R${value.toLocaleString()}`, 'Revenue (ZAR)']}
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="revenueZAR" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={60}>
                    {financialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 2 ? '#2563eb' : '#60a5fa'} />
                    ))}
                </Bar>
                </BarChart>
            </ResponsiveContainer>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                {financialData.map((d, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm font-semibold text-slate-500">{d.label} ({d.year})</p>
                        <p className="text-lg font-bold text-slate-800">R{d.revenueZAR.toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default Financials;