
import React, { useState } from 'react';
import { AdminTask, UserRole, SystemReport } from '../types';
import { 
  ListTodo, 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Server, 
  Database,
  Layout,
  HardDrive,
  UserCog,
  FileCheck,
  XCircle,
  Activity,
  ArrowUpRight,
  Filter,
  Cpu,
  Globe,
  Zap,
  Play,
  Loader2,
  PieChart,
  BarChart3
} from 'lucide-react';
import { useMockData } from '../context/MockDataContext';

const SLA_CHECKS = [
    { id: 1, category: 'Infrastructure', label: 'Daily Backup Verification', status: 'checked' },
    { id: 2, category: 'Infrastructure', label: 'Server Uptime Check (>99.9%)', status: 'checked' },
    { id: 3, category: 'Security', label: 'Intrusion Detection Logs Review', status: 'unchecked' },
    { id: 4, category: 'Security', label: 'MFA Latency Test (< 2s)', status: 'unchecked' },
    { id: 5, category: 'Compliance', label: 'User Access & Privilege Audit', status: 'unchecked' },
    { id: 6, category: 'Performance', label: 'API Response Time Analysis', status: 'unchecked' },
    { id: 7, category: 'Infrastructure', label: 'Database Integrity Verification', status: 'unchecked' },
    { id: 8, category: 'Security', label: 'SSL/TLS Certificate Validity', status: 'checked' },
    { id: 9, category: 'Support', label: 'Help Desk Ticket Resolution Rate', status: 'unchecked' },
    { id: 10, category: 'Compliance', label: 'Data Retention Policy Check', status: 'unchecked' },
];

const AdminApprovals: React.FC = () => {
    const userRole = localStorage.getItem('userRole') as UserRole;
    const { tasks, updateTask, addReport } = useMockData();
    const [activeTab, setActiveTab] = useState<'sla' | 'requests' | 'approvals' | 'infrastructure'>('sla');
    const [checklist, setChecklist] = useState(SLA_CHECKS);
    const [requestFilter, setRequestFilter] = useState<'All' | 'Hardware' | 'Software' | 'Access'>('All');
    
    // Audit State
    const [isAuditRunning, setIsAuditRunning] = useState(false);
    const [auditStep, setAuditStep] = useState(0);

    if (userRole !== 'ADMIN') {
        return <div className="p-8 text-center text-slate-500">Restricted to System Administrators</div>;
    }

    const handleApprove = (id: string) => {
        updateTask(id, { status: 'Approved' });
    };

    const handleReject = (id: string) => {
        updateTask(id, { status: 'Rejected' });
    };

    const toggleCheck = (id: number) => {
        setChecklist(checklist.map(c => c.id === id ? { ...c, status: c.status === 'checked' ? 'unchecked' : 'checked' } : c));
    };

    const runFullAudit = () => {
        setIsAuditRunning(true);
        setAuditStep(1); // Starting
        
        // Simulate audit steps
        setTimeout(() => setAuditStep(2), 1000); // Security
        setTimeout(() => setAuditStep(3), 2000); // Integrity
        setTimeout(() => setAuditStep(4), 3000); // Compiling

        setTimeout(() => {
            // Generate Reports
            const boardReport: SystemReport = {
                id: Date.now().toString(),
                title: 'Board Executive Summary Q4 (Automated)',
                type: 'Strategy',
                size: '1.2 MB',
                date: new Date().toISOString().split('T')[0],
                generatedBy: 'Audit Bot'
            };
            
            const adminReport: SystemReport = {
                id: (Date.now() + 1).toString(),
                title: 'Technical Infrastructure Audit Log',
                type: 'Audit',
                size: '4.5 MB',
                date: new Date().toISOString().split('T')[0],
                generatedBy: 'System'
            };

            addReport(boardReport);
            addReport(adminReport);

            setIsAuditRunning(false);
            setAuditStep(0);
            alert("Audit Complete. Reports generated and sent to Investor/Admin portals.");
        }, 4000);
    };

    const renderSlaDashboard = () => {
        const completedChecks = checklist.filter(c => c.status === 'checked').length;
        const totalChecks = checklist.length;
        const progress = (completedChecks / totalChecks) * 100;

        return (
         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                            <Activity size={20} />
                        </div>
                        <h3 className="text-slate-500 font-bold text-sm uppercase">SLA Adherence</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">98.5%</p>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full mt-2 inline-block">Within Limits</span>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                            <ShieldAlert size={20} />
                        </div>
                        <h3 className="text-slate-500 font-bold text-sm uppercase">Critical Pending</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{tasks.filter(t => t.slaRating === 'Critical' && t.status === 'Pending').length}</p>
                    <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded-full mt-2 inline-block">Requires Action</span>
                </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <CheckSquare size={20} />
                        </div>
                        <h3 className="text-slate-500 font-bold text-sm uppercase">Daily Checks</h3>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{completedChecks}/{totalChecks}</p>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                        <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>
            
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <ListTodo size={20} className="text-blue-600" />
                        Comprehensive SLA Checklist
                    </h3>
                    <div className="text-sm font-medium text-slate-500">
                        {Math.round(progress)}% Complete
                    </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                    {checklist.map((check) => (
                        <div key={check.id} onClick={() => toggleCheck(check.id)} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${check.status === 'checked' ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 hover:border-blue-300'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors ${check.status === 'checked' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'}`}>
                                    {check.status === 'checked' && <CheckCircle2 size={16} />}
                                </div>
                                <div>
                                    <span className={`font-bold block ${check.status === 'checked' ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{check.label}</span>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{check.category}</span>
                                </div>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                check.status === 'checked' 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                                {check.status === 'checked' ? 'COMPLETED' : 'PENDING'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
         </div>
        );
    };

    const renderInfrastructureDashboard = () => (
         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                 <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-blue-600" />
                    Infrastructure Health
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-center hover:bg-white hover:shadow-md transition-all">
                        <Database className="mx-auto text-blue-500 mb-3" size={32} />
                        <span className="block font-bold text-slate-700 text-lg">Database</span>
                        <span className="text-emerald-600 text-sm font-bold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">Online</span>
                    </div>
                     <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-center hover:bg-white hover:shadow-md transition-all">
                        <Globe className="mx-auto text-purple-500 mb-3" size={32} />
                        <span className="block font-bold text-slate-700 text-lg">API Gateway</span>
                        <span className="text-slate-500 text-sm font-medium mt-1">45ms Latency</span>
                    </div>
                     <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-center hover:bg-white hover:shadow-md transition-all">
                        <Cpu className="mx-auto text-rose-500 mb-3" size={32} />
                        <span className="block font-bold text-slate-700 text-lg">CPU Load</span>
                        <span className="text-slate-500 text-sm font-medium mt-1">32% Utilization</span>
                    </div>
                 </div>
              </div>
         </div>
    );

    const renderTaskTable = (filterTypes: string[]) => {
        let filteredTasks = tasks.filter(t => filterTypes.includes(t.type));
        if (activeTab === 'requests' && requestFilter !== 'All') {
            filteredTasks = filteredTasks.filter(t => t.type === requestFilter);
        }

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {activeTab === 'requests' && (
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-2 overflow-x-auto">
                        {['All', 'Hardware', 'Software', 'Access'].map(f => (
                            <button key={f} onClick={() => setRequestFilter(f as any)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${requestFilter === f ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                )}
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Task</th>
                                <th className="px-6 py-4">Requester</th>
                                <th className="px-6 py-4">SLA</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                             {filteredTasks.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400 italic">No pending tasks found in this category.</td>
                                </tr>
                             ) : filteredTasks.map(task => (
                                <tr key={task.id} className={`hover:bg-slate-50 transition-colors border-l-4 ${task.slaRating === 'Critical' ? 'border-l-rose-500 bg-rose-50/30' : 'border-l-transparent'}`}>
                                    <td className="px-6 py-4 font-bold text-slate-700 flex items-center gap-2">
                                        {task.slaRating === 'Critical' && <AlertTriangle size={16} className="text-rose-500 shrink-0" />}
                                        {task.title}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{task.requester}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                            task.slaRating === 'Critical' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                                            task.slaRating === 'High' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                            task.slaRating === 'Medium' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}>
                                            {task.slaRating}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{task.status}</span></td>
                                    <td className="px-6 py-4 text-right">
                                        {task.status === 'Pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleReject(task.id)} className="text-rose-600 hover:bg-rose-50 p-2 rounded transition-colors" title="Reject"><XCircle size={18}/></button>
                                                <button onClick={() => handleApprove(task.id)} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded transition-colors" title="Approve"><CheckCircle2 size={18}/></button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                             ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        );
    };

    const renderGovernanceTab = () => (
         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                 <div>
                     <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                          <FileCheck className="text-purple-600" size={24} />
                          System & Compliance Audit
                     </h3>
                     <p className="text-slate-500 text-sm mt-1">Run automated checks on security logs and infrastructure integrity.</p>
                 </div>
                 <button 
                     onClick={runFullAudit}
                     disabled={isAuditRunning}
                     className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg w-full md:w-auto justify-center"
                 >
                     {isAuditRunning ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} />}
                     {isAuditRunning ? `Running Step ${auditStep}/4...` : 'Run Full Audit'}
                 </button>
             </div>
             
             <div>
                <div className="mb-4 flex items-center gap-2">
                    <Server size={20} className="text-slate-400" />
                    <h3 className="text-lg font-bold text-slate-800">Governance & Updates</h3>
                </div>
                {renderTaskTable(['SystemUpdate', 'ChartAudit'])}
             </div>
         </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
             <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Approvals & SLA Management</h1>
                <p className="text-slate-500 mt-1">Oversight on critical system requests, maintenance, and chart audits.</p>
            </div>

            <div className="flex gap-2 mb-8 border-b border-slate-200 pb-1 overflow-x-auto">
                <button onClick={() => setActiveTab('sla')} className={`px-5 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'sla' ? 'bg-white border-x border-t border-slate-200 text-blue-600 translate-y-[1px] shadow-[0_-2px_5px_rgba(0,0,0,0.02)]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                    <CheckSquare size={16} /> SLA & Checklist
                </button>
                <button onClick={() => setActiveTab('infrastructure')} className={`px-5 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'infrastructure' ? 'bg-white border-x border-t border-slate-200 text-blue-600 translate-y-[1px] shadow-[0_-2px_5px_rgba(0,0,0,0.02)]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                    <Activity size={16} /> Infrastructure
                </button>
                <button onClick={() => setActiveTab('requests')} className={`px-5 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'requests' ? 'bg-white border-x border-t border-slate-200 text-blue-600 translate-y-[1px] shadow-[0_-2px_5px_rgba(0,0,0,0.02)]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                    <UserCog size={16} /> Service Requests
                </button>
                <button onClick={() => setActiveTab('approvals')} className={`px-5 py-2.5 rounded-t-lg font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'approvals' ? 'bg-white border-x border-t border-slate-200 text-blue-600 translate-y-[1px] shadow-[0_-2px_5px_rgba(0,0,0,0.02)]' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                    <Server size={16} /> System Governance
                </button>
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'sla' && renderSlaDashboard()}
                {activeTab === 'infrastructure' && renderInfrastructureDashboard()}
                {activeTab === 'requests' && renderTaskTable(['Hardware', 'Software', 'Access'])}
                {activeTab === 'approvals' && renderGovernanceTab()}
            </div>
        </div>
    );
};

export default AdminApprovals;
