import React from 'react';
import { Calendar, CheckCircle2, Clock, CircleDashed } from 'lucide-react';
import { DeploymentPhase } from '../types';

const Timeline: React.FC = () => {
  const phases: DeploymentPhase[] = [
    {
      phase: "Phase 1: Prototype",
      duration: "2 Months",
      deliverables: ["Functional Backend (Flask)", "Flutter App (Basic Auth)", "Facial Recognition Integration"],
      status: "completed"
    },
    {
      phase: "Phase 2: Pilot Deployment",
      duration: "3 Months",
      deliverables: ["Dockerized Deployment", "CI/CD Integration", "Initial Hospital Rollout (10 Institutions)"],
      status: "current"
    },
    {
      phase: "Phase 3: Scaling",
      duration: "4 Months",
      deliverables: ["Kubernetes Cluster", "Monitoring Dashboards (ELK)", "Multi-hospital Adoption"],
      status: "upcoming"
    },
    {
      phase: "Phase 4: Expansion",
      duration: "6 Months",
      deliverables: ["Voice/Iris Biometrics", "Compliance Certifications", "Regional Expansion"],
      status: "upcoming"
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Project Roadmap</h1>
        <p className="text-slate-500">Implementation timeline and key deliverables.</p>
      </div>

      <div className="relative border-l-2 border-slate-200 ml-4 space-y-12">
        {phases.map((p, i) => (
          <div key={i} className="relative pl-8">
            <span className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 bg-white ${
              p.status === 'completed' ? 'border-green-500 bg-green-500' :
              p.status === 'current' ? 'border-blue-500 animate-pulse' :
              'border-slate-300'
            }`}></span>
            
            <div className={`bg-white p-6 rounded-xl shadow-sm border ${p.status === 'current' ? 'border-blue-300 ring-2 ring-blue-50' : 'border-slate-200'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800">{p.phase}</h3>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-600">
                    <Calendar size={12} /> {p.duration}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                     p.status === 'completed' ? 'bg-green-100 text-green-700' :
                     p.status === 'current' ? 'bg-blue-100 text-blue-700' :
                     'bg-slate-100 text-slate-500'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>

              <ul className="space-y-2">
                {p.deliverables.map((d, j) => (
                  <li key={j} className="flex items-center gap-3 text-slate-600 text-sm">
                    {p.status === 'completed' ? <CheckCircle2 size={16} className="text-green-500" /> :
                     p.status === 'current' ? <Clock size={16} className="text-blue-500" /> :
                     <CircleDashed size={16} className="text-slate-400" />}
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;