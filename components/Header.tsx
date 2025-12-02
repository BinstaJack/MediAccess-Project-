import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Wifi, WifiOff, Search, User, ChevronDown, Check, Info, AlertTriangle, XCircle, ShieldAlert, Menu } from 'lucide-react';
import { useMockData } from '../context/MockDataContext';
import { UserRole } from '../types';

const Header: React.FC = () => {
    const location = useLocation();
    const { isOffline, toggleOffline, notifications, markNotificationRead, securityLevel, toggleMobileMenu } = useMockData();
    const userRole = localStorage.getItem('userRole') as UserRole;
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const isCritical = securityLevel === 'Critical';

    // Dynamic Title based on route
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/dashboard': return 'Dashboard';
            case '/users': return 'User Management';
            case '/patients': return 'Patient Management';
            case '/financials': return 'Financial Overview';
            case '/admin-approvals': return 'Approvals & SLA';
            case '/developer-api': return 'Developer API & Integration';
            default: return 'MediAccess Portal';
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const getIcon = (type: string) => {
        switch(type) {
            case 'success': return <Check size={14} />;
            case 'warning': return <AlertTriangle size={14} />;
            case 'error': return <XCircle size={14} />;
            default: return <Info size={14} />;
        }
    };

    const getColor = (type: string) => {
        switch(type) {
            case 'success': return 'bg-emerald-100 text-emerald-600';
            case 'warning': return 'bg-amber-100 text-amber-600';
            case 'error': return 'bg-rose-100 text-rose-600';
            default: return 'bg-blue-100 text-blue-600';
        }
    };

    return (
        <header className={`bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 transition-all duration-500 ${isOffline ? 'border-b-4 border-b-rose-400' : ''} ${isCritical ? 'bg-rose-50 border-b-rose-500 animate-pulse' : ''}`}>
            
            {/* Left: Menu & Title */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleMobileMenu}
                    className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>

                <div className="flex items-center gap-3">
                    <h2 className={`text-lg font-bold ${isCritical ? 'text-rose-700' : 'text-slate-800'}`}>{getPageTitle()}</h2>
                    {isOffline && (
                        <span className="hidden md:flex px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full items-center gap-2 animate-pulse">
                            <WifiOff size={12} /> OFFLINE
                        </span>
                    )}
                    {isCritical && (
                        <span className="hidden md:flex px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-full items-center gap-2 animate-bounce shadow-md">
                            <ShieldAlert size={12} /> LOCKDOWN
                        </span>
                    )}
                </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-3 md:gap-6">
                
                {/* Search (Visual) */}
                <div className={`hidden md:flex items-center rounded-lg px-3 py-1.5 border ${isCritical ? 'bg-white border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                    <Search size={16} className="text-slate-400" />
                    <input type="text" placeholder="Global search..." className="bg-transparent border-none focus:outline-none text-sm ml-2 w-48 text-slate-600" />
                </div>

                {/* Offline Toggle */}
                <button 
                    onClick={toggleOffline}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isOffline ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    title="Simulate network disconnect for rural clinic testing"
                >
                    {isOffline ? <WifiOff size={14} /> : <Wifi size={14} />}
                    <span className="hidden md:inline">{isOffline ? 'Go Online' : 'Simulate Offline'}</span>
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button 
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className={`relative p-2 rounded-full transition-colors ${isCritical ? 'text-rose-600 bg-rose-100 hover:bg-rose-200' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'}`}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>

                    {isNotifOpen && (
                        <>
                            <div className="fixed inset-0 z-30" onClick={() => setIsNotifOpen(false)}></div>
                            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-40 overflow-hidden animate-in zoom-in-95 duration-200">
                                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                    <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
                                    <span className="text-xs text-slate-500">{unreadCount} unread</span>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400 text-sm">No new notifications</div>
                                    ) : notifications.map(n => (
                                        <div 
                                            key={n.id} 
                                            onClick={() => markNotificationRead(n.id)}
                                            className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${n.read ? 'opacity-60' : 'bg-blue-50/30'}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getColor(n.type)}`}>
                                                {getIcon(n.type)}
                                            </div>
                                            <div>
                                                <p className={`text-sm ${n.read ? 'font-medium text-slate-600' : 'font-bold text-slate-800'}`}>{n.title}</p>
                                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-800">Demo User</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">{userRole}</p>
                    </div>
                    <div className="w-9 h-9 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        <User size={16} />
                    </div>
                </div>

            </div>
        </header>
    );
};

export default Header;