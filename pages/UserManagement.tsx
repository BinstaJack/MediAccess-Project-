

import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Users, Shield, MoreVertical, Mail, AlertTriangle, UserPlus, Search, HelpCircle, X, Check, XCircle, ChevronDown, UserX, Clock, Ban, Coffee, Send } from 'lucide-react';
import { useMockData } from '../context/MockDataContext';

const ROLE_DESCRIPTIONS = [
  {
    role: 'STAFF',
    title: 'Healthcare Staff',
    description: 'Standard access for medical professionals and employees.',
    permissions: ['View Dashboard', 'View Timeline', 'View Financials (Read-only)'],
    restrictions: ['No access to Confidential Documents', 'No User Management']
  },
  {
    role: 'ADMIN',
    title: 'System Administrator',
    description: 'Full control over the platform and user management.',
    permissions: ['Full Access to all modules', 'Manage Users & Roles', 'View System Logs'],
    restrictions: ['None']
  },
  {
    role: 'INVESTOR',
    title: 'Investor / Stakeholder',
    description: 'Specialized access for funding partners and stakeholders.',
    permissions: ['View Dashboard', 'View Financials', 'Access Confidential Documents (Proposal, Tech Specs)'],
    restrictions: ['No User Management']
  },
  {
    role: 'PARTNER',
    title: 'Academic Partner',
    description: 'Collaborator access for universities and research partners.',
    permissions: ['View Dashboard', 'Access Confidential Documents', 'View Research Timeline'],
    restrictions: ['No User Management', 'Limited Financial View']
  }
];

const UserManagement: React.FC = () => {
  const currentUserRole = localStorage.getItem('userRole') as UserRole;
  const { users, addUser, updateUser } = useMockData();
  const [showRoleInfo, setShowRoleInfo] = useState(false);

  // New State for Add User
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'STAFF' as UserRole,
    status: 'Active' as User['status']
  });

  // Contact Admin State
  const [isContactAdminModalOpen, setIsContactAdminModalOpen] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const handleSendAdminMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending message
    setMessageSent(true);
    setTimeout(() => {
        setIsContactAdminModalOpen(false);
        setMessageSent(false);
        setAdminMessage('');
    }, 2000);
  };

  // Access Control Check
  if (currentUserRole !== 'ADMIN') {
    return (
      <div className="p-8 max-w-7xl mx-auto h-[80vh] flex items-center justify-center animate-in fade-in zoom-in duration-300">
        <div className="text-center max-w-lg bg-white p-10 rounded-2xl shadow-xl border border-red-100">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Shield className="text-red-500 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-6">
            The User Management portal is restricted to <strong>System Administrators</strong> only.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 mb-6 border border-slate-200">
            <p className="flex items-center justify-center gap-2 font-medium">
              <AlertTriangle size={16} className="text-amber-500" />
              Your Role: {currentUserRole}
            </p>
          </div>
          
          <button 
            onClick={() => setIsContactAdminModalOpen(true)}
            className="w-full bg-slate-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <Mail size={18} />
            Contact Administrator
          </button>
        </div>

        {/* Contact Admin Modal */}
        {isContactAdminModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 text-left">
                    {messageSent ? (
                         <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                <Send size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Message Sent</h3>
                            <p className="text-slate-500 mt-2">The administrator will review your request shortly.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-800">Contact Administrator</h3>
                                <button onClick={() => setIsContactAdminModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSendAdminMessage}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Message or Request</label>
                                    <textarea 
                                        required
                                        value={adminMessage}
                                        onChange={(e) => setAdminMessage(e.target.value)}
                                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                                        placeholder="Describe your issue or request user changes..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button 
                                        type="button"
                                        onClick={() => setIsContactAdminModalOpen(false)}
                                        className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm flex items-center gap-2"
                                    >
                                        <Send size={16} /> Send Message
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        )}
      </div>
    );
  }

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    if (currentUserRole !== 'ADMIN') return; // Strict Guard
    updateUser(userId, { role: newRole });
  };

  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    if (currentUserRole !== 'ADMIN') return; // Strict Guard
    updateUser(userId, { status: newStatus });
  };

  const handleContactUser = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUserRole !== 'ADMIN') return; // Strict Guard

    const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        lastActive: 'Never'
    };
    addUser(user);
    setIsAddUserModalOpen(false);
    setNewUser({ name: '', email: '', role: 'STAFF', status: 'Active' });
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Suspended': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'On Leave': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Disabled': return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const getStatusIcon = (status: User['status']) => {
    switch (status) {
        case 'Active': return <Check size={12} />;
        case 'Pending': return <Clock size={12} />;
        case 'Suspended': return <Ban size={12} />;
        case 'On Leave': return <Coffee size={12} />;
        case 'Disabled': return <UserX size={12} />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1">Manage system access, roles, and operational status.</p>
        </div>
        <button 
            onClick={() => setIsAddUserModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5"
        >
          <UserPlus size={18} />
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-4 backdrop-blur-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all shadow-sm focus:shadow-md"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">
                  <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setShowRoleInfo(true)}>
                    Role
                    <HelpCircle size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Last Active</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold shadow-inner">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="relative inline-block">
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 pr-8 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-colors shadow-sm"
                      >
                        <option value="STAFF">STAFF</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="INVESTOR">INVESTOR</option>
                        <option value="PARTNER">PARTNER</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                     <div className="relative inline-block group/status">
                        <select
                             value={user.status}
                             onChange={(e) => handleStatusChange(user.id, e.target.value as User['status'])}
                             className={`appearance-none pl-2 pr-8 py-1.5 rounded-full text-xs font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-all ${getStatusColor(user.status)}`}
                        >
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Suspended">Suspended</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Disabled">Disabled</option>
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                             {getStatusIcon(user.status)}
                        </div>
                     </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-500 font-medium">
                    {user.lastActive}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleContactUser(user.email)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Contact User"
                      >
                        <Mail size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Guide Modal */}
      {showRoleInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Shield size={20} className="text-blue-600" />
                  Role Definitions & Permissions
                </h3>
                <p className="text-slate-500 text-sm mt-1">Understanding access levels within MediAccess.</p>
              </div>
              <button 
                onClick={() => setShowRoleInfo(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50">
              {ROLE_DESCRIPTIONS.map((roleDef) => (
                <div key={roleDef.role} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-slate-800 text-lg">{roleDef.title}</span>
                    <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded uppercase">
                      {roleDef.role}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 h-10">{roleDef.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                        <Check size={12} /> Includes
                      </p>
                      <ul className="space-y-1">
                        {roleDef.permissions.map((perm, idx) => (
                          <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5"></span>
                            {perm}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {roleDef.restrictions[0] !== 'None' && (
                      <div>
                        <p className="text-xs font-semibold text-rose-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                          <XCircle size={12} /> Restrictions
                        </p>
                        <ul className="space-y-1">
                          {roleDef.restrictions.map((res, idx) => (
                            <li key={idx} className="text-xs text-slate-500 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-rose-300 rounded-full mt-1.5"></span>
                              {res}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
              <button 
                onClick={() => setShowRoleInfo(false)}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

       {/* Add User Modal */}
       {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Add New User</h3>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="space-y-5 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                    placeholder="e.g. Dr. Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                    placeholder="e.g. j.doe@mediaccess.io"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
                        <div className="relative">
                            <select 
                                value={newUser.role}
                                onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}
                                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white appearance-none"
                            >
                                <option value="STAFF">Staff</option>
                                <option value="ADMIN">Admin</option>
                                <option value="INVESTOR">Investor</option>
                                <option value="PARTNER">Partner</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                         <div className="relative">
                            <select 
                                value={newUser.status}
                                onChange={(e) => setNewUser({...newUser, status: e.target.value as any})}
                                className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white appearance-none"
                            >
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Suspended">Suspended</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Disabled">Disabled</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;