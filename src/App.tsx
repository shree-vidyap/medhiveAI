import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { SymptomCheckerPage } from './pages/SymptomCheckerPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { ReferralsPage } from './pages/ReferralsPage';
import { ReportsPage } from './pages/ReportsPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { SchemesPage } from './pages/SchemesPage';
import { ClinicsPage } from './pages/ClinicsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AssistantPage } from './pages/AssistantPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#0B0F0E] text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* 1. Landing Page (First view when opening website) */}
              <Route path="/" element={<LandingPage />} />

              {/* 2. Main Home Page / Dashboard */}
              <Route path="/home" element={<HomePage />} />

              {/* 3. AI Symptom Assessment */}
              <Route path="/symptom-checker" element={<SymptomCheckerPage />} />

              {/* 4. Facilities Directory & Detail */}
              <Route path="/facilities" element={<FacilitiesPage />} />
              <Route path="/facilities/:id" element={<FacilitiesPage />} />

              {/* 5. Referrals Tracking, New Referral & Detail */}
              <Route path="/referrals" element={<ReferralsPage />} />
              <Route path="/referrals/new" element={<ReferralsPage />} />
              <Route path="/referrals/:id" element={<ReferralsPage />} />

              {/* 6. Reports List, Scan Report & Report Detail */}
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/reports/scan" element={<ReportsPage />} />
              <Route path="/reports/:id" element={<ReportsPage />} />

              {/* 7. Dedicated Emergency Center */}
              <Route path="/emergency" element={<EmergencyPage />} />

              {/* 8. Government Healthcare Schemes */}
              <Route path="/schemes" element={<SchemesPage />} />

              {/* 9. Mobile Clinics Schedule */}
              <Route path="/clinics" element={<ClinicsPage />} />

              {/* 10. Notifications Center */}
              <Route path="/notifications" element={<NotificationsPage />} />

              {/* 11. Medihivi AI Assistant Chat */}
              <Route path="/assistant" element={<AssistantPage />} />

              {/* 12. User Profile */}
              <Route path="/profile" element={<ProfilePage />} />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Persistent Dark Theme Footer across dashboard pages */}
          <footer className="bg-[#0B0F0E] border-t border-slate-800/80 text-slate-500 text-xs py-6 mt-12 text-center">
            <div className="max-w-7xl mx-auto px-4 space-y-1">
              <p className="font-bold text-slate-300">
                Medihivi AI — AI-Powered Healthcare Triage, Smart Referral & Assistance Platform
              </p>
              <p className="bento-tag text-[10px] text-slate-500">
                Clinical Decision Support Prototype • All data simulated locally
              </p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
