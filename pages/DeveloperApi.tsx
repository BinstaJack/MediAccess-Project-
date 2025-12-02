import React, { useState } from 'react';
import { Copy, Check, Server, Lock, Code, Database, ChevronRight, ChevronDown, PlayCircle, WifiOff, Loader2, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';
import { useMockData } from '../context/MockDataContext';

const DeveloperApi: React.FC = () => {
    const userRole = localStorage.getItem('userRole') as UserRole;
    const { isOffline, patients } = useMockData();
    
    // Access Control
    if (userRole !== 'ADMIN' && userRole !== 'PARTNER') {
        return (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                <Lock size={48} className="text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-700">Developer Portal Restricted</h2>
                <p>API documentation is available for Administrators and Technical Partners only.</p>
            </div>
        );
    }

    const EndpointCard = ({ method, url, desc, needsAuth, onTest }: any) => {
        const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
        const [response, setResponse] = useState<string | null>(null);

        const handleTest = () => {
            setStatus('loading');
            setResponse(null);
            
            setTimeout(() => {
                if (isOffline) {
                    setStatus('error');
                    setResponse(JSON.stringify({ error: "Connection Timeout", message: "Gateway unreachable" }, null, 2));
                } else {
                    const data = onTest();
                    setStatus('success');
                    setResponse(JSON.stringify(data, null, 2));
                }
            }, 1000 + Math.random() * 1000); // Random latency 1-2s
        };

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
                            method === 'POST' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                            'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                            {method}
                        </span>
                        <span className="text-slate-700 font-mono text-sm font-medium">{url}</span>
                    </div>
                    <button 
                        onClick={handleTest}
                        disabled={status === 'loading'}
                        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {status === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <PlayCircle size={14} />}
                        Try it out
                    </button>
                </div>
                
                <div className="p-5 bg-slate-50/50">
                    <p className="text-sm text-slate-600 mb-4">{desc}</p>
                    
                    {needsAuth && (
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100 mb-4 w-fit">
                            <Lock size={12} />
                            Requires Bearer Token (Level 3 Clearance)
                        </div>
                    )}

                    {response && (
                        <div className={`rounded-xl p-4 font-mono text-xs overflow-x-auto border animate-in fade-in slide-in-from-top-2 ${
                            status === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-slate-900 border-slate-800 text-emerald-400'
                        }`}>
                            <div className="flex justify-between items-center mb-2 opacity-50">
                                <span className="uppercase font-bold">{status === 'error' ? 'Error 503' : 'Status 200 OK'}</span>
                                <span>{isOffline ? '0ms' : '45ms'}</span>
                            </div>
                            <pre>{response}</pre>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <Code size={24} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Developer API Portal</h1>
                </div>
                <p className="text-slate-500">Integrate MediAccess with Hospital Management Systems (HMS) and Research Databases.</p>
                {isOffline && (
                    <div className="mt-4 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium animate-pulse">
                        <WifiOff size={18} />
                        Offline Mode Active: API calls will simulate connection timeouts.
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
                        <h3 className="font-bold text-slate-800 mb-4">API Reference</h3>
                        <nav className="space-y-1">
                            <button className="w-full text-left px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-sm border-l-4 border-indigo-600">Core Endpoints</button>
                            <button className="w-full text-left px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium border-l-4 border-transparent">Webhooks</button>
                            <button className="w-full text-left px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium border-l-4 border-transparent">Error Codes</button>
                        </nav>
                        
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4 text-xs uppercase tracking-wide">Environment</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Status</span>
                                    {isOffline ? (
                                        <span className="flex items-center gap-1.5 text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded"><WifiOff size={10}/> Unreachable</span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded"><Check size={10}/> Operational</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Version</span>
                                    <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-xs">v3.1.0</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Latency</span>
                                    <span className="font-mono text-slate-700">~42ms</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    
                    <EndpointCard 
                        method="POST"
                        url="/api/v1/auth/token"
                        desc="Generate a JWT bearer token for session access. Requires a valid API Key from the admin panel."
                        needsAuth={false}
                        onTest={() => ({
                            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                            expires_in: 3600,
                            type: "Bearer"
                        })}
                    />

                    <EndpointCard 
                        method="GET"
                        url="/api/v1/patients/{id}"
                        desc="Retrieve encrypted patient records. Access logs are immutable and audit-ready."
                        needsAuth={true}
                        onTest={() => {
                            // Return a random patient from context
                            const p = patients[0];
                            return {
                                id: p.id,
                                hash: "sha256:9f86d081884c7d659a2...",
                                status: "active",
                                last_visit: p.lastVisit,
                                encrypted_data: "U2FsdGVkX1+..."
                            };
                        }}
                    />

                    <EndpointCard 
                        method="POST"
                        url="/api/v1/biometric/verify"
                        desc="Submit raw image data for 1:N facial matching against the master database. Returns match confidence score."
                        needsAuth={true}
                        onTest={() => ({
                            match: true,
                            confidence: 0.987,
                            patient_id: "pat_12345",
                            processing_time: "0.4s"
                        })}
                    />

                </div>
            </div>
        </div>
    );
};

export default DeveloperApi;