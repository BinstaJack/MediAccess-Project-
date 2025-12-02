
import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Financials from './pages/Financials';
import Compliance from './pages/Compliance';
import Timeline from './pages/Timeline';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Documents from './pages/Documents';
import UserManagement from './pages/UserManagement';
import SystemChatbot from './components/SystemChatbot';
import Guides from './pages/Guides';
import Journals from './pages/Journals';
import MedicalReports from './pages/MedicalReports';
import ResearchStats from './pages/ResearchStats';
import InvestorReports from './pages/InvestorReports';
import PatientManagement from './pages/PatientManagement';
import PerformanceReviews from './pages/PerformanceReviews';
import BoardReview from './pages/BoardReview';
import AdminApprovals from './pages/AdminApprovals';
import DeveloperApi from './pages/DeveloperApi';
import { MockDataProvider } from './context/MockDataContext';

// Layout for the authenticated dashboard area
const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      {/* Adjusted margin for mobile/desktop responsiveness */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
        <Header />
        <main className="flex-1">
            <Outlet />
        </main>
      </div>
      <SystemChatbot />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <MockDataProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/financials" element={<Financials />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/journals" element={<Journals />} />
            <Route path="/medical-reports" element={<MedicalReports />} />
            <Route path="/research-stats" element={<ResearchStats />} />
            <Route path="/investor-reports" element={<InvestorReports />} />
            <Route path="/patients" element={<PatientManagement />} />
            <Route path="/performance-reviews" element={<PerformanceReviews />} />
            <Route path="/board-review" element={<BoardReview />} />
            <Route path="/admin-approvals" element={<AdminApprovals />} />
            <Route path="/developer-api" element={<DeveloperApi />} />
          </Route>
        </Routes>
      </HashRouter>
    </MockDataProvider>
  );
};

export default App;
