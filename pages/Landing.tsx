import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Fingerprint, Lock, Server, ArrowRight } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-800">MediAccess</span>
          </div>
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2">
            Access Portal <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Secure Biometric Access for <br />
          <span className="text-blue-600">Modern Healthcare</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
          Protect sensitive patient data with multi-factor facial and fingerprint recognition, HIPAA-compliant security, and seamless user experiences for medical professionals.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login" className="bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl">
            Launch Demo
          </Link>
          <button className="bg-white text-slate-700 border border-slate-200 px-8 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-all">
            Read Proposal
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why MediAccess?</h2>
            <p className="text-slate-500 mt-2">Solving the balance between security, compliance, and usability.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                <Fingerprint size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Biometric Auth</h3>
              <p className="text-slate-500 text-sm">Face + Fingerprint MFA to eliminate unauthorized access.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-6">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">HIPAA Compliant</h3>
              <p className="text-slate-500 text-sm">Designed from the ground up to meet international medical data standards.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6">
                <Server size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Scalable Tech</h3>
              <p className="text-slate-500 text-sm">Built on Docker & Kubernetes for seamless deployment across hospitals.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 transition-colors">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Data Security</h3>
              <p className="text-slate-500 text-sm">End-to-end encryption with JWT-based session management.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; 2024 MediAccess. Prepared by Lebini Wayne Jack.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;