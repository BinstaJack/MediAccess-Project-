import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  Users,
  BookOpen,
  Stethoscope,
  PieChart,
  UploadCloud,
  FileBarChart,
  UserPlus,
  ClipboardCheck,
  Vote,
  ListTodo,
  FileSearch,
  LogOut,
  Code
} from 'lucide-react';
import { UserRole } from '../types';
import { useMockData } from '../context/MockDataContext';

const Sidebar: React.FC = () => {
  const userRole = (localStorage.getItem('userRole') as UserRole) || 'STAFF';
  const { isMobileMenuOpen, toggleMobileMenu } = useMockData();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
    }`;

  const renderLinks = () => {
    switch (userRole) {
      case 'ADMIN':
        return (
          <>
            <NavLink to="/dashboard" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
              <LayoutDashboard size={18} />
              System Overview
            </NavLink>
             <NavLink to="/admin-approvals" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
              <ListTodo size={18} />
              Approvals & SLA
            </NavLink>
            <NavLink to="/compliance" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
              <ShieldCheck size={18} />
              Security & Compliance
            </NavLink>
            <NavLink to="/timeline" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
              <FileText size={18} />
              Project Roadmap
            </NavLink>
            <div className="pt-4 pb-2">
              <div className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Administration
              </div>
              <NavLink to="/users" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
                <Users size={18} />
                User Management
              </NavLink>
              <NavLink to="/guides" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
                <UploadCloud size={18} />
                System Guides
              </NavLink>
              <NavLink to="/developer-api" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
                <Code size={18} />
                Developer API
              </NavLink>
            </div>
          </>
        );

      case 'STAFF':
        return (
          <>
            <NavLink to="/dashboard" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
              <LayoutDashboard size={18} />
              Medical Ops Overview
            </NavLink>
            <NavLink to="/patients" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
              <UserPlus size={18} />
              Patient Management
            </NavLink>
             <NavLink to="/performance-reviews" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
              <ClipboardCheck size={18} />
              Performance Reviews
            </NavLink>
            <div className="pt-4 pb-2">
              <div className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Medical Resources
              </div>
              <NavLink to="/medical-reports" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
                <Stethoscope size={18} />
                Medical Reports
              </NavLink>
              <NavLink to="/journals" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
                <BookOpen size={18} />
                Journals & Research
              </NavLink>
            </div>
          </>
        );

      case 'PARTNER':
        return (
          <>
            <NavLink to="/dashboard" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
              <LayoutDashboard size={18} />
              Academic Overview
            </NavLink>
             <NavLink to="/performance-reviews" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
              <ClipboardCheck size={18} />
              Performance Reviews
            </NavLink>
            <NavLink to="/timeline" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
              <FileText size={18} />
              Project Roadmap
            </NavLink>
            <div className="pt-4 pb-2">
              <div className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Research Data
              </div>
              <NavLink to="/research-stats" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
                <PieChart size={18} />
                Research Contributions
              </NavLink>
              <NavLink to="/journals" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
                <BookOpen size={18} />
                Journals & Research
              </NavLink>
              <NavLink to="/developer-api" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
                <Code size={18} />
                Developer API
              </NavLink>
            </div>
          </>
        );

      case 'INVESTOR':
        return (
          <>
            <NavLink to="/dashboard" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
              <LayoutDashboard size={18} />
              Investor Overview
            </NavLink>
             <NavLink to="/board-review" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
              <Vote size={18} />
              Board Review
            </NavLink>
            <NavLink to="/financials" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
              <TrendingUp size={18} />
              Financials & ROI
            </NavLink>
            <NavLink to="/compliance" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
              <ShieldCheck size={18} />
              Security & Compliance
            </NavLink>
            <NavLink to="/timeline" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
              <FileText size={18} />
              Project Roadmap
            </NavLink>
            <div className="pt-4 pb-2">
              <div className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Investor Resources
              </div>
              <NavLink to="/documents" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
                <FileSearch size={18} />
                Project Docs
              </NavLink>
              <NavLink to="/investor-reports" onClick={() => isMobileMenuOpen && toggleMobileMenu()} className={navClass}>
                <FileBarChart size={18} />
                Strategic Reports
              </NavLink>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
        {/* Mobile Backdrop */}
        {isMobileMenuOpen && (
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-200"
                onClick={toggleMobileMenu}
            />
        )}

        {/* Sidebar Drawer */}
        <div className={`
            fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-40 flex flex-col transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0
        `}>
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
                <ShieldCheck className="text-white w-5 h-5" />
                </div>
                <div>
                    <span className="text-lg font-bold text-slate-800 leading-tight block">MediAccess</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Secure Auth</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
                {renderLinks()}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <NavLink to="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut size={18} />
                Sign Out
                </NavLink>
            </div>
        </div>
    </>
  );
};

export default Sidebar;