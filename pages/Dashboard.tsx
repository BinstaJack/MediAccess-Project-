
import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ShieldAlert, 
  Activity, 
  CheckCircle2,
  Briefcase,
  GraduationCap,
  LineChart as LineChartIcon,
  Server,
  Database,
  Wifi,
  HardDrive,
  FileText,
  Microscope,
  Globe,
  UserPlus,
  ListTodo,
  Cpu,
  ArrowUpRight,
  Vote,
  BookOpen,
  Clock,
  Zap,
  Lock,
  WifiOff,
  Siren,
  Ambulance,
  ShieldCheck
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { UserRole } from '../types';
import { useMockData } from '../context/MockDataContext';

const Dashboard: React.FC = () => {
  const userRole = (localStorage.getItem('userRole') as UserRole) || 'STAFF';
  const { tasks, proposals, journals, patients, isOffline, securityLevel, triggerCyberAttack, triggerPatientSurge, resolveSecurityEvent, systemLogs } = useMockData();
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
        logContainerRef.current.scrollTop = 0; // Scroll to top because we map normally, or logic might be reversed. 
        // Actually, logs are usually newest at bottom in a terminal, but we might prepend. 
        // Let's stick to prepending in context so newest is top.
    }
  }, [systemLogs]);

  // Mock Data for Charts
  const authData = [
    { time: '08:00', success: 45, fail: 2 },
    { time: '10:00', success: 120, fail: 5 },
    { time: '12:00', success: 80, fail: 1 },
    { time: '14:00', success: 150, fail: 8 },
    { time: '16:00', success: 90, fail: 3 },
    { time: '18:00', success: 40, fail: 0 },
  ];

  const researchData = [
    { month: 'Jan', papers: 4, citations: 12 },
    { month: 'Feb', papers: 6, citations: 18 },
    { month: 'Mar', papers: 8, citations: 25 },
    { month: 'Apr', papers: 5, citations: 30 },
    { month: 'May', papers: 9, citations: 45 },
  ];

  const renderWelcomeBanner = () => {
      // Override for Critical Security State
      if (securityLevel === 'Critical') {
          return {
              bg: 'bg-gradient-to-r from-rose-900 to-red-800',
              text: 'CRITICAL SECURITY ALERT',
              sub: 'Active threats detected. System lockdown protocols initiated.',
              icon: <Siren className="text-white opacity-20 absolute right-8 bottom-[-10px] w-32 h-32 rotate-12 animate-pulse" />
          };
      }

      switch (userRole) {
          case 'ADMIN':
              return { 
                  bg: 'bg-gradient-to-r from-slate-900 to-slate-800', 
                  text: 'System Administration', 
                  sub: 'Infrastructure monitoring and oversight.', 
                  icon: <Server className="text-white opacity-10 absolute right-8 bottom-[-10px] w-32 h-32 rotate-12" /> 
              };
          case 'INVESTOR':
              return { 
                  bg: 'bg-gradient-to-r from-blue-900 to-indigo-900', 
                  text: 'Investor Overview', 
                  sub: 'Performance metrics, ROI, and Governance.', 
                  icon: <LineChartIcon className="text-white opacity-10 absolute right-8 bottom-[-10px] w-32 h-32 rotate-12" /> 
              };
          case 'PARTNER':
              return { 
                  bg: 'bg-gradient-to-r from-indigo-900 to-violet-900', 
                  text: 'Academic Research Portal', 
                  sub: 'Collaboration, publications, and trainee insights.', 
                  icon: <GraduationCap className="text-white opacity-10 absolute right-8 bottom-[-10px] w-32 h-32 rotate-12" /> 
              };
          default: // STAFF
              return { 
                  bg: 'bg-gradient-to-r from-teal-600 to-emerald-600', 
                  text: 'Medical Operations', 
                  sub: 'System health checks, patient queue, and reporting.', 
                  icon: <Briefcase className="text-white opacity-10 absolute right-8 bottom-[-10px] w-32 h-32 rotate-12" /> 
              };
      }
  };

  const banner = renderWelcomeBanner();

  // Helper for Card
  const StatCard = ({ title, value, sub, subColor, icon, delay, link, border }: any) => {
      const Content = () => (
        <div className={`bg-white p-6 rounded-2xl shadow-sm border ${border || 'border-slate-200'} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 h-full relative group`}>
            {link && <ArrowUpRight className="absolute top-4 right-4 text-slate-300 group-hover:text-blue-500 transition-colors" size={18} />}
            <div className="flex items-center gap-3 mb-3">
                {icon}
                <span className="text-sm font-semibold text-slate-500">{title}</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
            <p className={`text-xs font-medium mt-1 ${subColor || 'text-slate-500'}`}>{sub}</p>
        </div>
      );

      return link ? <Link to={link} style={{ animationDelay: `${delay}ms` }} className="block h-full"><Content /></Link> : <div style={{ animationDelay: `${delay}ms` }} className="h-full"><Content /></div>;
  };

  // --- ROLE SPECIFIC CONTENT ---

  const AdminDashboard = () => {
    const pendingApprovals = tasks.filter(t => t.status === 'Pending').length;
    const criticalIssues = tasks.filter(t => t.slaRating === 'Critical' && t.status === 'Pending').length;
    const sysHealth = criticalIssues === 0 ? 'Optimal' : 'Degraded';

    return (
      <>
        {/* Operations Control Center - Demo Mode */}
        <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl mb-8 border border-slate-700 animate-in fade-in duration-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Cpu size={120} />
            </div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 relative z-10">
                <Activity className="text-blue-400" /> Operations Control Center (Demo Simulation)
            </h3>
            <div className="flex flex-col md:flex-row gap-4 relative z-10">
                {securityLevel === 'Critical' ? (
                    <button 
                        onClick={resolveSecurityEvent}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg transition-all hover:scale-[1.02]"
                    >
                        <ShieldCheck size={24} /> Resolve Security Threat
                    </button>
                ) : (
                    <button 
                        onClick={triggerCyberAttack}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg transition-all hover:scale-[1.02]"
                    >
                        <ShieldAlert size={24} /> Simulate Cyber Attack
                    </button>
                )}
                <button 
                    onClick={triggerPatientSurge}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg transition-all hover:scale-[1.02]"
                >
                    <Ambulance size={24} /> Simulate Patient Surge
                </button>
            </div>
            
            {/* Live System Ticker */}
            <div className="mt-6 bg-black/30 rounded-xl p-3 font-mono text-xs h-24 overflow-y-auto border border-white/10 relative custom-scrollbar" ref={logContainerRef}>
                <div className="sticky top-0 right-0 float-right text-[10px] text-slate-400 flex items-center gap-1 z-10 bg-slate-900/50 px-1 rounded"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> LIVE</div>
                <div className="space-y-1">
                    {systemLogs.map((log) => (
                        <p key={log.id} className={`${
                            log.status === 'ERR' ? 'text-red-400 font-bold' : 
                            log.status === 'WARN' ? 'text-amber-400' : 'text-emerald-400 opacity-90'
                        }`}>
                            <span className="opacity-50">[{log.timestamp}]</span> {'>'} [{log.module}] {log.message}
                        </p>
                    ))}
                </div>
            </div>
        </div>

        {/* System Health Monitor Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            <div className={`md:col-span-8 p-6 rounded-2xl border ${criticalIssues === 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'} flex items-center justify-between animate-in fade-in duration-500 relative overflow-hidden`}>
                {isOffline && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                        <span className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">
                            <WifiOff size={16} /> Monitoring Paused
                        </span>
                    </div>
                )}
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${criticalIssues === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600 animate-pulse'}`}>
                        {criticalIssues === 0 ? <Activity size={24} /> : <ShieldAlert size={24} />}
                    </div>
                    <div>
                        <h3 className={`font-bold text-lg ${criticalIssues === 0 ? 'text-emerald-900' : 'text-rose-900'}`}>System Status: {sysHealth}</h3>
                        <p className={`text-sm ${criticalIssues === 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {criticalIssues === 0 ? 'All services running normally. No critical latency detected.' : `${criticalIssues} Critical issue(s) detected requiring immediate attention.`}
                        </p>
                    </div>
                </div>
                {criticalIssues > 0 && (
                    <Link to="/admin-approvals" className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors">
                        View Alerts
                    </Link>
                )}
            </div>
            
            <div className="md:col-span-4">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-full flex items-center justify-between relative overflow-hidden">
                    {isOffline && <div className="absolute inset-0 bg-slate-100/50 z-10"></div>}
                    <div>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-wide mb-1">Server Uptime</p>
                        <p className="text-2xl font-bold text-slate-800">99.98%</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2 mb-1 justify-end">
                            <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-slate-400' : 'bg-emerald-500 animate-pulse'}`}></span>
                            <span className={`text-xs font-bold ${isOffline ? 'text-slate-500' : 'text-emerald-600'}`}>
                                {isOffline ? 'Offline' : 'Live'}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">{isOffline ? 'Data Stale' : 'Last 24h'}</p>
                    </div>
                 </div>
            </div>
        </div>

        {/* Priority Actions */}
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Zap size={20} className="text-amber-500" /> Priority Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
              title="Pending Approvals" 
              value={pendingApprovals} 
              sub={pendingApprovals > 0 ? "Requests awaiting review" : "Queue empty"} 
              subColor={pendingApprovals > 0 ? "text-amber-600" : "text-slate-400"}
              icon={<ListTodo className={pendingApprovals > 0 ? "text-amber-500" : "text-slate-400"} size={24} />}
              delay={100}
              link="/admin-approvals"
              border="border-amber-200"
          />
          <StatCard 
              title="Security Alerts" 
              value={criticalIssues} 
              sub="Potential vulnerabilities" 
              subColor="text-rose-500"
              icon={<ShieldAlert className="text-rose-600" size={24} />}
              delay={200}
              link="/admin-approvals"
              border={criticalIssues > 0 ? "border-rose-200" : undefined}
          />
          <StatCard 
              title="SLA Breaches" 
              value="0" 
              sub="Last 7 Days" 
              subColor="text-emerald-600"
              icon={<CheckCircle2 className="text-emerald-500" size={24} />}
              delay={300}
              link="/admin-approvals"
          />
        </div>

        {/* Infrastructure & Load Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
           {/* Detailed Server Status */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in duration-500 h-full">
               <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <Server size={18} className="text-blue-600" /> Infrastructure
                   </h3>
                   <button className="text-xs font-bold text-blue-600 hover:underline">View Logs</button>
               </div>
               <div className="space-y-3">
                   <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                       <div className="flex items-center gap-3">
                           <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm"><Database size={16} className="text-blue-500" /></div>
                           <div>
                                <span className="text-sm font-bold text-slate-700 block">Primary DB</span>
                                <span className="text-[10px] text-slate-400">PostgreSQL v14</span>
                           </div>
                       </div>
                       <span className={`text-xs font-bold flex items-center gap-1 ${isOffline ? 'text-slate-400' : 'text-emerald-600'}`}>
                           <Wifi size={12}/> {isOffline ? 'Unreachable' : '12ms'}
                       </span>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                       <div className="flex items-center gap-3">
                           <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm"><Globe size={16} className="text-purple-500" /></div>
                           <div>
                                <span className="text-sm font-bold text-slate-700 block">API Gateway</span>
                                <span className="text-[10px] text-slate-400">Rest / GraphQL</span>
                           </div>
                       </div>
                       <span className={`text-xs font-bold flex items-center gap-1 ${isOffline ? 'text-slate-400' : 'text-emerald-600'}`}>
                           <Wifi size={12}/> {isOffline ? 'Offline' : 'Online'}
                       </span>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                       <div className="flex items-center gap-3">
                           <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm"><Lock size={16} className="text-amber-500" /></div>
                           <div>
                                <span className="text-sm font-bold text-slate-700 block">Auth Service</span>
                                <span className="text-[10px] text-slate-400">JWT / OAuth2</span>
                           </div>
                       </div>
                       <span className={`text-xs font-bold flex items-center gap-1 ${isOffline ? 'text-slate-400' : 'text-emerald-600'}`}>
                           <Wifi size={12}/> {isOffline ? 'Cached' : 'Secured'}
                       </span>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                       <div className="flex items-center gap-3">
                           <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm"><HardDrive size={16} className="text-slate-500" /></div>
                           <div>
                                <span className="text-sm font-bold text-slate-700 block">Storage</span>
                                <span className="text-[10px] text-slate-400">Encrypted Buckets</span>
                           </div>
                       </div>
                       <span className="text-xs font-bold text-blue-600">45% Used</span>
                   </div>
               </div>
           </div>

           {/* System Traffic / Load Chart */}
           <div className={`lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in duration-500 delay-100 h-full flex flex-col relative ${isOffline ? 'opacity-75' : ''}`}>
               {isOffline && (
                   <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                       <span className="bg-slate-100/90 text-slate-500 px-4 py-2 rounded-lg font-bold text-sm shadow-sm border border-slate-200">
                           Showing Cached Metrics
                       </span>
                   </div>
               )}
               <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Cpu size={18} className="text-indigo-600" /> Server Load & Traffic
                    </h3>
                    <select className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none text-slate-500 bg-slate-50 font-medium">
                        <option>Last 12 Hours</option>
                        <option>Last 24 Hours</option>
                    </select>
               </div>
               <div className={`flex-1 w-full min-h-[200px] ${isOffline ? 'grayscale' : ''}`}>
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={authData}>
                        <defs>
                            <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip 
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        />
                        <Area type="monotone" dataKey="success" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSuccess)" strokeWidth={3} />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
           </div>
        </div>
      </>
    );
  }

  // ... (Keep StaffDashboard, PartnerDashboard, InvestorDashboard as they were in the original file) ...
  const StaffDashboard = () => {
    // Get last 5 updates across all patients notes
    const recentUpdates = patients
        .flatMap(p => p.notes.map(n => ({ ...n, patientName: p.name, patientId: p.id })))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4);

    const waitingCount = patients.filter(p => p.status === 'Waiting').length;

    return (
    <>
      {/* Quick Actions Bar - Redesigned Grid */}
      <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
          <Zap size={20} className="text-amber-500" /> Quick Actions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/patients" className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-blue-200 hover:-translate-y-1 transition-all group relative overflow-hidden">
              <div className="relative z-10">
                  <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                      <UserPlus size={24} className="text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-1">Register Patient</h3>
                  <p className="text-blue-100 text-sm opacity-90">Add new admission details</p>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-2 translate-y-2">
                  <UserPlus size={100} />
              </div>
          </Link>

          <Link to="/patients" className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-1 transition-all group">
              <div className="flex justify-between items-start mb-4">
                  <div className="bg-amber-50 text-amber-600 w-12 h-12 rounded-xl flex items-center justify-center">
                      <Clock size={24} />
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">{waitingCount} Waiting</span>
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-1">Waiting Room</h3>
              <p className="text-slate-500 text-sm">Manage triage queue</p>
          </Link>

          <Link to="/medical-reports" className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-300 hover:-translate-y-1 transition-all group">
              <div className="flex justify-between items-start mb-4">
                  <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center">
                      <Activity size={24} />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isOffline ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'}`}>
                      {isOffline ? 'OFFLINE' : 'ONLINE'}
                  </span>
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-1">System Check</h3>
              <p className="text-slate-500 text-sm">Scanner & server status</p>
          </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 ${isOffline ? 'border-l-slate-400' : 'border-l-emerald-500'} hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-700">Scanner Status</h3>
            {isOffline ? <WifiOff className="text-slate-400" size={24} /> : <Wifi className="text-emerald-500" size={24} />}
          </div>
          <p className="text-3xl font-bold text-slate-900">{isOffline ? 'Offline' : 'Online'}</p>
          <p className="text-xs text-slate-500 mt-1">{isOffline ? 'Operating in local mode' : 'Connected to Main Entrance Node'}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 delay-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-700">Active Patients</h3>
            <Users className="text-blue-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-slate-900">{patients.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total registered profiles</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-purple-500 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 delay-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-700">System Alerts</h3>
            <HardDrive className="text-purple-500" size={24} />
          </div>
          <p className="text-3xl font-bold text-slate-900">None</p>
          <p className="text-xs text-slate-500 mt-1">All systems nominal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Activity size={20} className="text-teal-600" /> Recent Clinical Updates
                </h3>
                <Link to="/patients" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-4">
               {recentUpdates.length === 0 ? (
                   <p className="text-slate-400 text-sm italic">No recent patient activity logged.</p>
               ) : recentUpdates.map((update, i) => (
                   <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md border border-slate-100 hover:border-blue-100 transition-all duration-300 cursor-default">
                      <div className="bg-white p-2 rounded-full border border-slate-100 text-teal-600 shadow-sm mt-1">
                         <Activity size={16} />
                      </div>
                      <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-bold text-slate-800 text-sm">{update.patientName}</p>
                            <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100">{update.date}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{update.text}</p>
                          <p className="text-[10px] text-slate-400 mt-2 font-medium">Logged by: {update.author}</p>
                      </div>
                   </div>
               ))}
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in duration-500 delay-100">
            <h3 className="font-bold text-slate-800 mb-6">System Reports</h3>
            <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between group hover:border-blue-300 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg"><CheckCircle2 size={18} /></div>
                        <div>
                            <p className="font-bold text-slate-700 text-sm">Daily Diagnostic</p>
                            <p className="text-xs text-slate-500">Passed • 08:00 AM</p>
                        </div>
                    </div>
                    <Link to="/medical-reports" className="text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">View Report</Link>
                </div>
            </div>
         </div>
      </div>
    </>
  );
  }

  const PartnerDashboard = () => (
    <>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
            title="Active Studies" 
            value="12" 
            sub="Biometric Efficacy" 
            subColor="text-indigo-600"
            icon={<Microscope className="text-indigo-600" size={24} />}
            delay={0}
        />
        <StatCard 
            title="Published Papers" 
            value={journals.length.toString()} 
            sub="Total Database" 
            icon={<FileText className="text-blue-600" size={24} />}
            delay={100}
            link="/journals"
        />
        <StatCard 
            title="Partner Institutions" 
            value="5" 
            sub="Regional Network" 
            subColor="text-emerald-500"
            icon={<Globe className="text-emerald-600" size={24} />}
            delay={200}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in duration-700">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Research Impact</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={researchData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                    <Bar dataKey="citations" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in duration-700 delay-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen size={20} className="text-indigo-600" /> Recent Contributions
                </h3>
                <Link to="/journals" className="text-xs font-bold text-indigo-600 hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
                {journals.slice(0, 4).map((j, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group cursor-pointer">
                        <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <FileText size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-700 truncate">{j.title}</h4>
                            <p className="text-xs text-slate-500">{j.author} • {j.date}</p>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 bg-slate-100 px-2 py-1 rounded">{j.type}</span>
                    </div>
                ))}
                {journals.length === 0 && <p className="text-slate-400 text-sm">No journals found.</p>}
            </div>
        </div>
      </div>
    </>
  );

  const InvestorDashboard = () => {
    const pendingProposals = proposals.filter(p => p.status === 'Pending').length;

    return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4">
           <h3 className="text-sm font-bold text-slate-500 mb-2">Total Revenue (YTD)</h3>
           <p className="text-3xl font-bold text-slate-800">R 4.2M</p>
           <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mt-2 inline-block">+15% vs target</span>
        </div>
        
        <Link to="/board-review" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 delay-75 group cursor-pointer relative overflow-hidden">
           <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
           <h3 className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2">
               Board Action Items
               {pendingProposals > 0 && <span className="bg-rose-500 w-2 h-2 rounded-full animate-pulse"></span>}
           </h3>
           <p className="text-3xl font-bold text-slate-800">{pendingProposals}</p>
           <p className="text-xs font-bold text-slate-500 mt-2 flex items-center gap-1">
               Pending Proposals <ArrowUpRight size={12} className="text-blue-500" />
           </p>
        </Link>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 delay-150">
           <h3 className="text-sm font-bold text-slate-500 mb-2">Burn Rate</h3>
           <p className="text-3xl font-bold text-slate-800">R 120k</p>
           <span className="text-xs font-bold text-slate-500 mt-2 inline-block">Monthly Average</span>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 delay-200">
           <h3 className="text-sm font-bold text-slate-500 mb-2">Projected ROI</h3>
           <p className="text-3xl font-bold text-emerald-600">22.5%</p>
           <span className="text-xs font-bold text-slate-500 mt-2 inline-block">Annualized Return</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in duration-500">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Growth Trajectory</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={authData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="success" stroke="#2563eb" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  </LineChart>
              </ResponsiveContainer>
            </div>
         </div>
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in duration-500 delay-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Market Share Goals</h3>
            <div className="space-y-6">
                <div>
                   <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-slate-700">Public Sector Hospitals</span>
                      <span className="text-sm font-bold text-blue-600">12%</span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full transition-all duration-1000" style={{width: '12%'}}></div>
                   </div>
                </div>
                <div>
                   <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-slate-700">Private Clinics</span>
                      <span className="text-sm font-bold text-purple-600">45%</span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-3">
                      <div className="bg-purple-600 h-3 rounded-full transition-all duration-1000" style={{width: '45%'}}></div>
                   </div>
                </div>
            </div>
         </div>
      </div>
    </>
  );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      {/* Role-Based Welcome Banner */}
      <div className={`relative ${banner.bg} p-10 rounded-3xl shadow-xl mb-10 overflow-hidden text-white transition-all hover:scale-[1.01] duration-500`}>
          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">{banner.text}</h1>
            <p className="opacity-90 text-xl font-medium">{banner.sub}</p>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-white/10">
                <span className={`w-2 h-2 rounded-full ${userRole === 'ADMIN' ? 'bg-rose-400' : 'bg-emerald-400'} animate-pulse`}></span>
                {userRole} Portal
            </div>
          </div>
          {banner.icon}
      </div>

      {/* Render Role Specific Content */}
      <div className="animate-in fade-in-up duration-500">
        {userRole === 'ADMIN' && <AdminDashboard />}
        {userRole === 'STAFF' && <StaffDashboard />}
        {userRole === 'PARTNER' && <PartnerDashboard />}
        {userRole === 'INVESTOR' && <InvestorDashboard />}
      </div>

    </div>
  );
};

export default Dashboard;