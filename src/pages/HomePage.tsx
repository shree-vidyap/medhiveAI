import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { 
  Stethoscope, 
  Siren, 
  FileText, 
  Building2, 
  Send, 
  FolderArchive, 
  Landmark, 
  Truck, 
  MessageSquare, 
  ArrowRight 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const { t } = useTranslation();

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Greeting Banner */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t('home.greeting', 'Good morning 👋')}
        </h2>
        <p className="text-sm text-slate-400 font-medium">
          {t('home.subline', 'How can we help you today?')}, {user.name.split(' ')[0]}
        </p>
      </div>

      {/* TWO LARGE PRIMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 — Symptom Checker Primary Card */}
        <div className="bento-card p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group border border-teal-500/30 hover:border-teal-500/60 transition-all">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white group-hover:text-teal-300 transition-colors">
                🩺 {t('home.checkSymptomsTitle', 'Check My Symptoms')}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                {t('home.checkSymptomsDesc', 'Get an AI-assisted health assessment in minutes.')}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/symptom-checker')}
            className="w-full sm:w-auto self-start bg-teal-600 hover:bg-teal-500 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 transition cursor-pointer"
          >
            <span>{t('home.checkSymptomsTitle', 'Check My Symptoms')}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>

        {/* Card 2 — Emergency Card (Reserved Red Styling) */}
        <div className="bento-card-emergency p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-bold">
              <Siren className="w-6 h-6 text-rose-400" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white group-hover:text-rose-200 transition-colors">
                  🚨 {t('home.emergencyTitle', 'Emergency Assistance')}
                </h3>
                <span className="bento-tag bg-rose-950 text-rose-300 border border-rose-700/60 px-2 py-0.5 rounded font-bold text-[10px]">
                  108 Helpline
                </span>
              </div>
              <p className="text-sm text-rose-200/80 leading-relaxed font-medium">
                {t('home.emergencyDesc', 'Get immediate healthcare help, right now.')}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/emergency')}
            className="w-full sm:w-auto self-start bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition cursor-pointer"
          >
            <span>{t('home.emergencyTitle', 'Emergency Assistance')}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* HEALTHCARE SECTION HEADING & 6 FEATURE TILES */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {t('home.healthcareHeading', 'Healthcare')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Tile 1: Scan Report */}
          <div className="bento-card p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/40 transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-teal-400 flex items-center justify-center border border-slate-700">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">📷 {t('home.tileScanReport', 'Scan Report')}</h4>
                <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                  Upload or capture a medical report for AI-assisted reading.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/reports/scan')}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 pt-2 transition cursor-pointer"
            >
              <span>{t('home.tileScanReport', 'Scan Report')} →</span>
            </button>
          </div>

          {/* Tile 2: Facilities */}
          <div className="bento-card p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/40 transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-teal-400 flex items-center justify-center border border-slate-700">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">🏥 {t('home.tileFacilities', 'Facilities')}</h4>
                <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                  Find nearby hospitals, PHCs, clinics and healthcare facilities.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/facilities')}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 pt-2 transition cursor-pointer"
            >
              <span>{t('home.tileFacilities', 'Facilities')} →</span>
            </button>
          </div>

          {/* Tile 3: My Referrals */}
          <div className="bento-card p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/40 transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-teal-400 flex items-center justify-center border border-slate-700">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">📋 {t('home.tileReferrals', 'My Referrals')}</h4>
                <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                  Track referrals from assessment to appointment.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/referrals')}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 pt-2 transition cursor-pointer"
            >
              <span>{t('home.tileReferrals', 'My Referrals')} →</span>
            </button>
          </div>

          {/* Tile 4: My Reports */}
          <div className="bento-card p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/40 transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-teal-400 flex items-center justify-center border border-slate-700">
                <FolderArchive className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">📄 {t('home.tileReports', 'My Reports')}</h4>
                <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                  View your past assessments and scanned reports.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/reports')}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 pt-2 transition cursor-pointer"
            >
              <span>{t('home.tileReports', 'My Reports')} →</span>
            </button>
          </div>

          {/* Tile 5: Government Schemes */}
          <div className="bento-card p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/40 transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center border border-slate-700">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">💰 {t('home.tileSchemes', 'Government Schemes')}</h4>
                <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                  Discover healthcare schemes and benefits available to you.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/schemes')}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 pt-2 transition cursor-pointer"
            >
              <span>{t('home.tileSchemes', 'Government Schemes')} →</span>
            </button>
          </div>

          {/* Tile 6: Mobile Clinics */}
          <div className="bento-card p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/40 transition">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center border border-slate-700">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">📍 {t('home.tileClinics', 'Mobile Clinics')}</h4>
                <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">
                  Find mobile clinic visits near you and set reminders.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/clinics')}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 pt-2 transition cursor-pointer"
            >
              <span>{t('home.tileClinics', 'Mobile Clinics')} →</span>
            </button>
          </div>
        </div>
      </div>

      {/* COMPACT ASSISTANT PROMPT STRIP */}
      <div
        onClick={() => navigate('/assistant')}
        className="bento-card p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-teal-500/50 bg-[#131C1E]/90 hover:bg-slate-800/80 transition group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-200 group-hover:text-teal-300 transition">
            💬 {t('home.assistantStrip', 'Medihivi Assistant — Ask anything about using Medihivi AI')}
          </span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-400 group-hover:translate-x-1 transition-all shrink-0" />
      </div>
    </div>
  );
};
