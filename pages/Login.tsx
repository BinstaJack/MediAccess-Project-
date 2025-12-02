
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanFace, Lock, CheckCircle, AlertCircle, ChevronDown, Shield, Briefcase, DollarSign, GraduationCap, ArrowRight, WifiOff, Wifi, Fingerprint, Smartphone } from 'lucide-react';
import { AuthState, UserRole } from '../types';
import { useMockData } from '../context/MockDataContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isOffline } = useMockData();
  const [authState, setAuthState] = useState<AuthState>(AuthState.IDLE);
  const [selectedRole, setSelectedRole] = useState<UserRole>('STAFF');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [scanMode, setScanMode] = useState<'face' | 'finger'>('face');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [password, setPassword] = useState('');

  // Robust Stream Cleanup
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleLoginSuccess = () => {
    setAuthState(AuthState.VERIFIED);
    localStorage.setItem('userRole', selectedRole);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const startCamera = async () => {
    setScanMode('face');
    if (isOffline) {
        setAuthState(AuthState.SCANNING);
        // Simulate local verification without camera
        setTimeout(() => {
            handleLoginSuccess();
        }, 1500);
        return;
    }

    setAuthState(AuthState.SCANNING);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      // Simulate verification process
      setTimeout(() => {
        if (stream) stream.getTracks().forEach(track => track.stop()); // Stop stream upon success
        handleLoginSuccess();
      }, 3000);

    } catch (err) {
      console.error("Camera access denied", err);
      setAuthState(AuthState.FAILED);
    }
  };

  const startFingerprint = () => {
      setScanMode('finger');
      setAuthState(AuthState.SCANNING);
      // Simulate biometric handshake
      setTimeout(() => {
          handleLoginSuccess();
      }, 2000);
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
      e.preventDefault();
      // Simulate API call delay
      setAuthState(AuthState.SCANNING); // Reuse scanning state for loading visual
      setTimeout(() => {
          handleLoginSuccess();
      }, 1000);
  };

  const roles = [
    { 
      value: 'STAFF', 
      label: 'Healthcare Professional', 
      desc: 'Access patient records, vitals & daily ops',
      icon: <Briefcase size={22} className="text-blue-600" />,
      bg: 'bg-blue-50',
      border: 'border-blue-100'
    },
    { 
      value: 'ADMIN', 
      label: 'System Administrator', 
      desc: 'Manage users, security protocols & logs',
      icon: <Shield size={22} className="text-rose-600" />,
      bg: 'bg-rose-50',
      border: 'border-rose-100'
    },
    { 
      value: 'INVESTOR', 
      label: 'Investor / Stakeholder', 
      desc: 'View financial ROI & board proposals',
      icon: <DollarSign size={22} className="text-emerald-600" />,
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    { 
      value: 'PARTNER', 
      label: 'Academic Partner', 
      desc: 'Track research stats & trainee performance',
      icon: <GraduationCap size={22} className="text-indigo-600" />,
      bg: 'bg-indigo-50',
      border: 'border-indigo-100'
    },
  ];

  const currentRoleObj = roles.find(r => r.value === selectedRole);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
      {/* Persistent Network Status Indicator */}
      <div className={`absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border shadow-sm transition-all duration-300 z-10 ${
          isOffline 
            ? 'bg-rose-100 text-rose-700 border-rose-200 animate-pulse' 
            : 'bg-white text-emerald-600 border-emerald-200'
      }`}>
          {isOffline ? <WifiOff size={16} /> : <Wifi size={16} />}
          <span>{isOffline ? 'OFFLINE' : 'ONLINE'}</span>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-300 relative">
        {isOffline && (
            <div className="absolute top-0 left-0 right-0 bg-rose-50 text-rose-700 text-xs font-bold py-1.5 text-center flex items-center justify-center gap-2 border-b border-rose-100">
                <WifiOff size={12} /> Local Offline Mode Active
            </div>
        )}
        <div className="p-8 text-center pt-10">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="text-blue-600 w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">MediAccess</h2>
          <p className="text-slate-500 mb-6">Secure Healthcare Authentication</p>

          <div className="mb-6 text-left relative">
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Select User Role</label>
            
            {/* Custom Dropdown Trigger */}
            <button 
                onClick={() => authState === AuthState.IDLE && setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                disabled={authState !== AuthState.IDLE}
                className={`w-full bg-slate-50 border border-slate-200 text-slate-700 py-3 px-4 rounded-xl flex items-center justify-between transition-all group ${authState === AuthState.IDLE ? 'hover:bg-white hover:border-blue-300 cursor-pointer shadow-sm' : 'opacity-60 cursor-not-allowed'}`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${currentRoleObj?.bg} ${currentRoleObj?.border}`}>
                        {currentRoleObj?.icon}
                    </div>
                    <div className="text-left">
                        <span className="font-bold text-sm block text-slate-800">{currentRoleObj?.label}</span>
                        <span className="text-xs text-slate-500 block">{currentRoleObj?.desc}</span>
                    </div>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Options */}
            {isRoleDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {roles.map((role) => (
                        <div 
                            key={role.value}
                            onClick={() => {
                                setSelectedRole(role.value as UserRole);
                                setIsRoleDropdownOpen(false);
                            }}
                            className={`p-3 flex items-start gap-3 cursor-pointer transition-colors border-b border-slate-50 last:border-0 ${selectedRole === role.value ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                        >
                            <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${role.bg} border ${role.border}`}>
                                {role.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm font-bold ${selectedRole === role.value ? 'text-slate-900' : 'text-slate-700'}`}>
                                        {role.label}
                                    </span>
                                    {selectedRole === role.value && <CheckCircle className="text-blue-600" size={16} />}
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5 leading-tight">{role.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <InfoIcon size={12} /> Select "Investor" to view confidential proposals.
            </p>
          </div>

          <div className="relative bg-slate-900 rounded-2xl overflow-hidden h-64 w-full mb-6 flex items-center justify-center shadow-inner border border-slate-800">
            {authState === AuthState.IDLE && (
              <div className="text-slate-400 flex flex-col items-center">
                <div className="flex gap-4 mb-4 opacity-50">
                    <ScanFace size={32} />
                    <div className="w-[1px] h-8 bg-slate-700"></div>
                    <Fingerprint size={32} />
                </div>
                <span className="text-sm font-medium">Select Verification Method</span>
              </div>
            )}
            
            {(authState === AuthState.SCANNING || authState === AuthState.VERIFIED) && (
              <>
                {scanMode === 'face' ? (
                    // Face Mode UI
                    !isOffline && stream ? (
                        <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    ) : (
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-white">
                            {isOffline ? (
                                <div className="flex flex-col items-center animate-pulse">
                                    <ScanFace size={40} className="mb-2 text-emerald-400" />
                                    <span className="text-sm font-bold text-emerald-100">Offline Verification...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mb-3"></div>
                                    <span className="text-xs tracking-wider uppercase opacity-80">Initializing Camera</span>
                                </div>
                            )}
                        </div>
                    )
                ) : (
                    // Fingerprint Mode UI
                    <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-white">
                        <div className={`relative ${authState === AuthState.SCANNING ? 'animate-pulse' : ''}`}>
                            <Fingerprint size={80} className={`${authState === AuthState.VERIFIED ? 'text-emerald-500' : 'text-blue-500'} transition-colors duration-500`} />
                            {authState === AuthState.SCANNING && (
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-blue-400/30 to-transparent scan-line-fingerprint"></div>
                            )}
                        </div>
                        <span className="text-xs tracking-wider uppercase opacity-80 mt-4 font-mono">
                            {authState === AuthState.VERIFIED ? "Print Recognized" : "Scanning Print..."}
                        </span>
                    </div>
                )}
               
                {scanMode === 'face' && authState === AuthState.SCANNING && stream && <div className="scan-line z-10"></div>}
                
                {/* Overlay Elements for Futuristic Look */}
                <div className="absolute inset-0 border-[3px] border-blue-500/30 rounded-2xl z-0 pointer-events-none"></div>
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-blue-400 rounded-tl-md opacity-50"></div>
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-blue-400 rounded-tr-md opacity-50"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-blue-400 rounded-bl-md opacity-50"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-blue-400 rounded-br-md opacity-50"></div>

                {/* Status Badge */}
                <div className="absolute bottom-6 left-0 right-0 text-center z-10">
                   <span className={`px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-lg ${authState === AuthState.VERIFIED ? 'bg-emerald-500/90 text-white' : 'bg-black/60 text-blue-100 border border-white/10'}`}>
                      {authState === AuthState.SCANNING ? (scanMode === 'face' ? "SCANNING FACE..." : "ANALYZING PRINT...") : "IDENTITY CONFIRMED"}
                   </span>
                </div>
              </>
            )}

            {authState === AuthState.FAILED && (
               <div className="text-red-400 flex flex-col items-center z-10">
               <AlertCircle size={48} className="mb-2" />
               <span className="text-sm font-bold">Biometric Access Denied</span>
             </div>
            )}
          </div>

          <div className="space-y-4">
             {authState === AuthState.IDLE || authState === AuthState.FAILED ? (
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={startCamera}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex flex-col items-center justify-center gap-1 shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <ScanFace size={24} />
                        <span className="text-xs font-bold uppercase tracking-wide">Face Scan</span>
                    </button>
                    <button
                        onClick={startFingerprint}
                        className="bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 font-bold py-3.5 px-4 rounded-xl transition-all flex flex-col items-center justify-center gap-1 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Fingerprint size={24} />
                        <span className="text-xs font-bold uppercase tracking-wide">Touch ID</span>
                    </button>
                </div>
             ) : (
                <button
                disabled
                className={`w-full font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                  authState === AuthState.VERIFIED 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {authState === AuthState.VERIFIED ? (
                  <>
                    <CheckCircle size={20} />
                    Redirecting...
                  </>
                ) : (
                  "Verifying Identity..."
                )}
              </button>
             )}
            
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Or continue with password</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handlePasswordLogin} className="space-y-3">
              <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Healthcare ID / Email (e.g. user@mediaccess.io)" 
                    className="w-full pl-4 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm font-medium"
                  />
              </div>
              <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" 
                    className="w-full pl-4 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm font-medium"
                  />
              </div>
               <button
                type="submit"
                className="w-full bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-sm"
              >
                Sign In <ArrowRight size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component
const InfoIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

export default Login;
