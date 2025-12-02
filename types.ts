
export type UserRole = 'STAFF' | 'ADMIN' | 'INVESTOR' | 'PARTNER';

export type SecurityLevel = 'Low' | 'Elevated' | 'Critical';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Pending' | 'Disabled' | 'Suspended' | 'On Leave';
  lastActive: string;
}

export interface FinancialData {
  year: string;
  revenueUSD: number;
  revenueZAR: number;
  label: string;
}

export interface DeploymentPhase {
  phase: string;
  duration: string;
  deliverables: string[];
  status: 'completed' | 'current' | 'upcoming';
}

export interface SecurityLog {
  id: number;
  timestamp: string;
  event: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Resolved' | 'Pending';
}

export enum AuthState {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface SystemGuide {
  id: string;
  title: string;
  category: 'Security' | 'Setup' | 'Onboarding' | 'Troubleshooting';
  uploadedBy: string;
  date: string;
  size: string;
}

export interface JournalArticle {
  id: string;
  title: string;
  author: string;
  type: 'Medical' | 'Research';
  date: string;
  abstract: string;
}

export interface ResearchStat {
  area: string;
  papers: number;
  contributors: number;
}

export type PatientStatus = 'Waiting' | 'Triage' | 'Consultation' | 'Observation' | 'Discharged';

export interface Patient {
  id: string;
  name: string;
  dob: string;
  contact: string;
  history: string;
  lastVisit: string;
  status: PatientStatus; // New field for Kanban
  notes: { date: string; text: string; author: string }[];
  vitals: { bp: string; heartRate: string; temp: string };
}

export interface Trainee {
  id: string;
  name: string;
  role: string; // e.g. "Trainee Doctor", "Researcher"
  performance: number; // 0-100
  clinicalHours: number;
  supervisorRating: number; // 1-5
  journalEntries: number;
  assignedSupervisor?: string;
  reviews: { date: string; comment: string; author: string }[];
}

export interface BoardProposal {
  id: string;
  title: string;
  submittedBy: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  summary: string;
  votes: { yes: number; no: number };
}

export interface AdminTask {
  id: string;
  type: 'Hardware' | 'Software' | 'Access' | 'SystemUpdate' | 'ChartAudit';
  title: string;
  requester: string;
  slaRating: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Approved' | 'Completed' | 'Rejected';
  date: string;
}

export interface SystemReport {
  id: string;
  title: string;
  type: 'Financial' | 'Strategy' | 'System' | 'General' | 'Audit';
  size: string;
  date: string;
  generatedBy: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

export interface SystemLog {
    id: string;
    timestamp: string;
    module: 'AUTH' | 'DB' | 'API' | 'SYSTEM' | 'NETWORK' | 'SEC';
    message: string;
    status: 'OK' | 'WARN' | 'ERR';
}