

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Patient, Trainee, BoardProposal, AdminTask, JournalArticle, SystemReport, SystemGuide, AppNotification, SecurityLevel, PatientStatus, SystemLog } from '../types';

// ... (Keep existing Initial Data Constants) ...
const INITIAL_USERS: User[] = [
  { id: '1', name: 'Dr. Sarah Smith', email: 's.smith@mediaccess.io', role: 'STAFF', status: 'Active', lastActive: '2 mins ago' },
  { id: '2', name: 'James Wilson', email: 'admin@mediaccess.io', role: 'ADMIN', status: 'Active', lastActive: 'Just now' },
  { id: '3', name: 'Global Health Ventures', email: 'investments@ghv.com', role: 'INVESTOR', status: 'Active', lastActive: '2 days ago' },
  { id: '4', name: 'UCT Research Lab', email: 'partners@uct.ac.za', role: 'PARTNER', status: 'Pending', lastActive: '1 week ago' },
  { id: '5', name: 'Nurse John Doe', email: 'j.doe@mediaccess.io', role: 'STAFF', status: 'Suspended', lastActive: '1 month ago' },
  { id: '6', name: 'Dr. Emily Blunt', email: 'e.blunt@mediaccess.io', role: 'STAFF', status: 'On Leave', lastActive: '3 days ago' },
  { id: '7', name: 'Tech Support', email: 'support@mediaccess.io', role: 'ADMIN', status: 'Disabled', lastActive: 'Never' },
];

const INITIAL_PATIENTS: Patient[] = [
    {
        id: '1',
        name: 'John Doe',
        dob: '1985-04-12',
        contact: '555-0101',
        history: 'Hypertension, T2 Diabetes',
        lastVisit: '2023-10-25',
        status: 'Consultation',
        notes: [
            { date: '2023-10-25', text: 'Routine checkup. BP slightly elevated. Advised diet change.', author: 'Dr. Smith' },
            { date: '2023-09-10', text: 'Patient complained of mild headaches. Prescribed analgesics.', author: 'Nurse Joy' }
        ],
        vitals: { bp: '135/85', heartRate: '78', temp: '36.8' }
    },
    {
        id: '2',
        name: 'Jane Smith',
        dob: '1992-08-30',
        contact: '555-0202',
        history: 'Asthma',
        lastVisit: '2023-10-20',
        status: 'Waiting',
        notes: [],
        vitals: { bp: '120/80', heartRate: '72', temp: '37.0' }
    },
    {
        id: '3',
        name: 'Robert Fox',
        dob: '1978-11-15',
        contact: '555-0303',
        history: 'Fractured Tibia (Recovering)',
        lastVisit: '2023-10-28',
        status: 'Triage',
        notes: [],
        vitals: { bp: '128/82', heartRate: '80', temp: '36.5' }
    }
];

const INITIAL_TRAINEES: Trainee[] = [
    {
        id: '1', name: 'Dr. Emily Chen', role: 'Trainee Doctor', performance: 88, clinicalHours: 120, supervisorRating: 4.5, journalEntries: 3,
        assignedSupervisor: 'Prof. Alan Grant',
        reviews: [{ date: '2023-10-01', comment: 'Excellent patient interaction during rounds. Demonstrated strong diagnostic skills.', author: 'Prof. Alan Grant' }]
    },
    {
        id: '2', name: 'James Botha', role: 'Researcher', performance: 92, clinicalHours: 40, supervisorRating: 5.0, journalEntries: 2,
        assignedSupervisor: 'Dr. Ellie Sattler',
        reviews: []
    },
    {
        id: '3', name: 'Sarah Connor', role: 'Trainee Doctor', performance: 76, clinicalHours: 95, supervisorRating: 3.8, journalEntries: 1,
        assignedSupervisor: undefined,
        reviews: []
    },
];

const INITIAL_PROPOSALS: BoardProposal[] = [
    {
        id: '1', title: 'Q4 Budget Expansion for Regional Rollout', submittedBy: 'CFO', date: '2023-10-20', status: 'Pending',
        summary: 'Requesting R2.5M additional funding to support the expansion into 5 new district hospitals. Breakdown includes hardware procurement (40%), staff training (30%), and logistical support (30%).',
        votes: { yes: 3, no: 1 }
    },
    {
        id: '2', title: 'Partnership Agreement with MedTech Sol', submittedBy: 'CEO', date: '2023-10-15', status: 'Approved',
        summary: 'Strategic alliance for hardware procurement discounts. This 2-year contract locks in a 15% discount on all biometric scanners.',
        votes: { yes: 5, no: 0 }
    },
    {
        id: '3', title: 'Delay of Phase 3 Scaling', submittedBy: 'CTO', date: '2023-10-28', status: 'Rejected',
        summary: 'Proposal to delay Kubernetes deployment by 2 weeks to conduct further load testing on the legacy auth server.',
        votes: { yes: 1, no: 4 }
    }
];

const INITIAL_TASKS: AdminTask[] = [
    { id: '1', type: 'Access', title: 'New Intern Access Request', requester: 'Dr. Smith', slaRating: 'Medium', status: 'Pending', date: '2023-10-27' },
    { id: '2', type: 'Hardware', title: 'Server Rack Maintenance', requester: 'IT Ops', slaRating: 'Critical', status: 'Pending', date: '2023-10-26' },
    { id: '3', type: 'SystemUpdate', title: 'v2.4 Security Patch', requester: 'DevOps', slaRating: 'High', status: 'Approved', date: '2023-10-25' },
    { id: '4', type: 'ChartAudit', title: 'Routine Audit: Ward A Logs', requester: 'Compliance Bot', slaRating: 'Medium', status: 'Pending', date: '2023-10-27' },
    { id: '5', type: 'Software', title: 'License Renewal: Radiography Suite', requester: 'Procurement', slaRating: 'Low', status: 'Pending', date: '2023-10-28' },
    { id: '6', type: 'SystemUpdate', title: 'Database Migration Approval', requester: 'Lead Eng.', slaRating: 'Critical', status: 'Pending', date: '2023-10-28' },
    { id: '7', type: 'Access', title: 'Revoke Access: Ex-Employee', requester: 'HR Dept', slaRating: 'High', status: 'Pending', date: '2023-10-28' },
];

const INITIAL_JOURNALS: JournalArticle[] = [
    { id: '1', title: 'Biometric Efficacy in High-Trauma Environments', author: 'Dr. A. Peterson', type: 'Research', date: '2023-11-01', abstract: 'Analysis of facial recognition speed in emergency room settings.' },
    { id: '2', title: 'Patient Data Privacy: A New Paradigm', author: 'MediAccess Security Team', type: 'Medical', date: '2023-10-15', abstract: 'Implementing zero-trust architecture in hospital networks.' },
    { id: '3', title: 'Ethical Implications of AI in Healthcare', author: 'UCT Research Dept', type: 'Research', date: '2023-09-28', abstract: 'A qualitative study on patient perception of automated entry systems.' },
    { id: '4', title: 'Monthly Operational Efficiency Report', author: 'Ops Team', type: 'Medical', date: '2023-10-01', abstract: 'Statistics on wait time reduction post-implementation.' },
];

const INITIAL_REPORTS: SystemReport[] = [
    { id: '1', title: 'Q3 2024 Financial Performance Review', type: 'Financial', size: '2.4 MB', date: '2023-10-24', generatedBy: 'System' },
    { id: '2', title: 'Expansion Feasibility Study: Sub-Saharan Region', type: 'Strategy', size: '5.1 MB', date: '2023-10-20', generatedBy: 'External Audit' },
    { id: '3', title: 'Technical Infrastructure Audit', type: 'System', size: '3.2 MB', date: '2023-10-15', generatedBy: 'DevOps' },
    { id: '4', title: 'Q2 2024 Stakeholder Update', type: 'General', size: '1.8 MB', date: '2023-09-30', generatedBy: 'CEO' },
    { id: '5', title: 'MediAccess System Deep Scan Audit', type: 'Audit', size: '1.5 MB', date: new Date().toISOString().split('T')[0], generatedBy: 'Auto-Scan' }
];

const INITIAL_GUIDES: SystemGuide[] = [
    { id: '1', title: 'Cybersecurity Level 1 Support', category: 'Security', uploadedBy: 'Admin', date: '2023-10-25', size: '2.4 MB' },
    { id: '2', title: 'Network Troubleshooting Cheat Sheet', category: 'Troubleshooting', uploadedBy: 'Admin', date: '2023-10-20', size: '1.1 MB' },
    { id: '3', title: 'New Employee Onboarding', category: 'Onboarding', uploadedBy: 'HR', date: '2023-09-15', size: '3.5 MB' },
    { id: '4', title: 'Hardware Setup SOP', category: 'Setup', uploadedBy: 'Admin', date: '2023-08-10', size: '4.2 MB' },
    { id: '5', title: 'Website Audit Guide', category: 'Security', uploadedBy: 'Admin', date: '2023-11-01', size: '1.8 MB' },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
    { id: '1', title: 'SLA Warning', message: 'API Latency check spiking > 200ms.', time: '10 mins ago', type: 'warning', read: false },
    { id: '2', title: 'New Proposal', message: 'Phase 3 Budget Adjustment submitted for review.', time: '1 hour ago', type: 'info', read: false },
    { id: '3', title: 'Backup Success', message: 'Daily database snapshot completed successfully.', time: '4 hours ago', type: 'success', read: true },
];

export const PATIENT_AFFIRMATIONS = [
    "Day 1: Move with purpose. Trust your direction.",
    "Day 2: Your confidence grows every time you show up.",
    "Day 3: Choose calm over chaos.",
    "Day 4: You deserve every good thing coming your way.",
    "Day 5: Honor your progress. Even the quiet steps count.",
    "Day 6: Be patient with yourself. Stay firm with your goals.",
    "Day 7: Let go of what drains your energy.",
    "Day 8: Build a life that reflects your potential.",
    "Day 9: Stay grounded, even when life moves fast.",
    "Day 10: Be proud of who you’re becoming.",
    "Day 11: Choose courage, even when fear pulls up.",
    "Day 12: Learn, grow, evolve.",
    "Day 13: Your energy attracts the right people and chances.",
    "Day 14: You are worthy of respect, love, and peace.",
    "Day 15: Rest. Reset. Protect your energy.",
    "Day 16: Show up as the strongest version of you today.",
    "Day 17: Guard your mind, your space, your peace.",
    "Day 18: Discipline and focus are building your future.",
    "Day 19: Allow yourself to receive what’s meant for you.",
    "Day 20: Handle what comes your way with clarity.",
    "Day 21: Release habits that no longer serve you.",
    "Day 22: Your dreams are valid. Act on them.",
    "Day 23: You control your mindset and your reactions.",
    "Day 24: Walk with self-respect today.",
    "Day 25: Be grateful and stay present.",
    "Day 26: Consistency creates opportunity.",
    "Day 27: Stay aligned with your purpose.",
    "Day 28: Trust the timing of your life.",
    "Day 29: Let joy in without guilt.",
    "Day 30: Celebrate your growth and your resilience."
];

interface MockDataContextType {
    users: User[];
    addUser: (user: User) => void;
    updateUser: (id: string, updates: Partial<User>) => void;
    
    patients: Patient[];
    addPatient: (patient: Patient) => void;
    updatePatient: (id: string, updates: Partial<Patient>) => void;

    trainees: Trainee[];
    updateTrainee: (id: string, updates: Partial<Trainee>) => void;

    proposals: BoardProposal[];
    voteProposal: (id: string, type: 'yes' | 'no') => void;

    tasks: AdminTask[];
    updateTask: (id: string, updates: Partial<AdminTask>) => void;

    journals: JournalArticle[];
    addJournal: (journal: JournalArticle) => void;

    reports: SystemReport[];
    addReport: (report: SystemReport) => void;

    guides: SystemGuide[];
    addGuide: (guide: SystemGuide) => void;
    deleteGuide: (id: string) => void;

    // Phase 2 & 3
    isOffline: boolean;
    toggleOffline: () => void;
    notifications: AppNotification[];
    markNotificationRead: (id: string) => void;
    
    securityLevel: SecurityLevel;
    triggerCyberAttack: () => void;
    triggerPatientSurge: () => void;
    resolveSecurityEvent: () => void;

    // Responsive State
    isMobileMenuOpen: boolean;
    toggleMobileMenu: () => void;

    // Live Logs
    systemLogs: SystemLog[];
    addSystemLog: (module: SystemLog['module'], message: string, status: SystemLog['status']) => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export const MockDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
    const [trainees, setTrainees] = useState<Trainee[]>(INITIAL_TRAINEES);
    const [proposals, setProposals] = useState<BoardProposal[]>(INITIAL_PROPOSALS);
    const [tasks, setTasks] = useState<AdminTask[]>(INITIAL_TASKS);
    const [journals, setJournals] = useState<JournalArticle[]>(INITIAL_JOURNALS);
    const [reports, setReports] = useState<SystemReport[]>(INITIAL_REPORTS);
    const [guides, setGuides] = useState<SystemGuide[]>(INITIAL_GUIDES);
    
    // Phase 2 & 3 State
    const [isOffline, setIsOffline] = useState(false);
    const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
    const [securityLevel, setSecurityLevel] = useState<SecurityLevel>('Low');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Live Logging
    const [systemLogs, setSystemLogs] = useState<SystemLog[]>([
        { id: '1', timestamp: new Date().toLocaleTimeString(), module: 'SYSTEM', message: 'Initializing biometric subsystem...', status: 'OK' },
        { id: '2', timestamp: new Date().toLocaleTimeString(), module: 'DB', message: 'Replication sync with ZA-North', status: 'OK' },
        { id: '3', timestamp: new Date().toLocaleTimeString(), module: 'AUTH', message: 'Service ready. Listening on port 443', status: 'OK' },
    ]);

    const addSystemLog = (module: SystemLog['module'], message: string, status: SystemLog['status']) => {
        const newLog: SystemLog = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleTimeString(),
            module,
            message,
            status
        };
        setSystemLogs(prev => [newLog, ...prev].slice(0, 50)); // Keep last 50 logs
    };

    // -- Users --
    const addUser = (user: User) => {
        setUsers([...users, user]);
        addSystemLog('SYSTEM', `New user created: ${user.email} [${user.role}]`, 'OK');
    };
    const updateUser = (id: string, updates: Partial<User>) => {
        setUsers(users.map(u => u.id === id ? { ...u, ...updates } : u));
        addSystemLog('SYSTEM', `User profile updated: ID ${id}`, 'OK');
    };

    // -- Patients --
    const addPatient = (patient: Patient) => {
        setPatients([patient, ...patients]);
        addSystemLog('DB', `Patient record created: ${patient.id} (Encrypted)`, 'OK');
    };
    const updatePatient = (id: string, updates: Partial<Patient>) => {
        setPatients(patients.map(p => p.id === id ? { ...p, ...updates } : p));
        // addSystemLog('API', `Patient record updated: ${id}`, 'OK'); // Too noisy?
    };

    // -- Trainees --
    const updateTrainee = (id: string, updates: Partial<Trainee>) => {
        setTrainees(trainees.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    // -- Proposals --
    const voteProposal = (id: string, type: 'yes' | 'no') => {
        setProposals(proposals.map(p => {
            if (p.id === id) {
                return { ...p, votes: { ...p.votes, [type]: p.votes[type] + 1 } };
            }
            return p;
        }));
        setNotifications(prev => [{
            id: Date.now().toString(),
            title: 'Vote Cast',
            message: `A vote was cast on proposal #${id}.`,
            time: 'Just now',
            type: 'success',
            read: false
        }, ...prev]);
        addSystemLog('API', `Vote recorded on Proposal #${id}`, 'OK');
    };

    // -- Tasks --
    const updateTask = (id: string, updates: Partial<AdminTask>) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
        if (updates.status) {
            addSystemLog('SYSTEM', `Task ${id} status changed to ${updates.status}`, 'OK');
        }
    };

    // -- Journals --
    const addJournal = (journal: JournalArticle) => {
        setJournals([journal, ...journals]);
        addSystemLog('DB', `New Research Journal indexed: ${journal.title}`, 'OK');
    };

    // -- Reports --
    const addReport = (report: SystemReport) => {
        setReports([report, ...reports]);
        setNotifications(prev => [{
            id: Date.now().toString(),
            title: 'Report Generated',
            message: `${report.title} is ready for download.`,
            time: 'Just now',
            type: 'info',
            read: false
        }, ...prev]);
        addSystemLog('SYSTEM', `Generated Report: ${report.title}`, 'OK');
    };

    // -- Guides --
    const addGuide = (guide: SystemGuide) => {
        setGuides([guide, ...guides]);
        addSystemLog('DB', `System Guide uploaded: ${guide.title}`, 'OK');
    };
    const deleteGuide = (id: string) => setGuides(guides.filter(g => g.id !== id));

    // -- Offline & Notifications --
    const toggleOffline = () => {
        const newState = !isOffline;
        setIsOffline(newState);
        addSystemLog('NETWORK', newState ? 'Connection Lost. Switching to Local Cache.' : 'Connection Restored.', newState ? 'WARN' : 'OK');
    };
    
    const markNotificationRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    // -- Simulation Operations --
    const triggerCyberAttack = () => {
        setSecurityLevel('Critical');
        
        // Add Critical Task
        const attackTask: AdminTask = {
            id: Date.now().toString(),
            type: 'Software',
            title: 'MITIGATE DDOS ATTACK',
            requester: 'AUTO-DEFENSE',
            slaRating: 'Critical',
            status: 'Pending',
            date: new Date().toISOString().split('T')[0]
        };
        setTasks([attackTask, ...tasks]);

        // Add Alert
        setNotifications(prev => [{
            id: Date.now().toString(),
            title: 'SECURITY ALERT: DDoS DETECTED',
            message: 'High-volume traffic detected on Auth Gateway. Immediate mitigation required.',
            time: 'Just now',
            type: 'error',
            read: false
        }, ...prev]);

        addSystemLog('SEC', 'DDoS Attack Signature detected on Port 443', 'ERR');
        addSystemLog('SYSTEM', 'Automatic Lockdown Protocols Initiated', 'WARN');
    };

    const resolveSecurityEvent = () => {
        setSecurityLevel('Low');
        setNotifications(prev => [{
            id: Date.now().toString(),
            title: 'Threat Resolved',
            message: 'Security threat neutralized. Systems returning to normal.',
            time: 'Just now',
            type: 'success',
            read: false
        }, ...prev]);
        addSystemLog('SEC', 'Threat Neutralized. Firewall rules updated.', 'OK');
        addSystemLog('SYSTEM', 'Returning to Normal Operational State.', 'OK');
    };

    const triggerPatientSurge = () => {
        const mockNames = ['Alex Mercer', 'Diana Prince', 'Bruce Banner', 'Clark Kent', 'Wade Wilson'];
        const newPatients: Patient[] = mockNames.map((name, i) => ({
            id: `surge_${Date.now()}_${i}`,
            name: name,
            dob: '1990-01-01',
            contact: '555-SURGE',
            history: 'Emergency Admission',
            lastVisit: new Date().toISOString().split('T')[0],
            status: 'Waiting', // Default to waiting
            notes: [],
            vitals: { bp: '-', heartRate: '-', temp: '-' }
        }));

        setPatients([...newPatients, ...patients]);
        
        setNotifications(prev => [{
            id: Date.now().toString(),
            title: 'Capacity Warning',
            message: 'Sudden influx of 5 patients in Triage Queue. Wait times exceeding 30 mins.',
            time: 'Just now',
            type: 'warning',
            read: false
        }, ...prev]);

        addSystemLog('API', 'Batch ingest: 5 emergency patient records', 'OK');
        addSystemLog('SYSTEM', 'Triage Queue Capacity > 80%', 'WARN');
    };

    return (
        <MockDataContext.Provider value={{
            users, addUser, updateUser,
            patients, addPatient, updatePatient,
            trainees, updateTrainee,
            proposals, voteProposal,
            tasks, updateTask,
            journals, addJournal,
            reports, addReport,
            guides, addGuide, deleteGuide,
            isOffline, toggleOffline, notifications, markNotificationRead,
            securityLevel, triggerCyberAttack, triggerPatientSurge, resolveSecurityEvent,
            isMobileMenuOpen, toggleMobileMenu,
            systemLogs, addSystemLog
        }}>
            {children}
        </MockDataContext.Provider>
    );
};

export const useMockData = () => {
    const context = useContext(MockDataContext);
    if (context === undefined) {
        throw new Error('useMockData must be used within a MockDataProvider');
    }
    return context;
};