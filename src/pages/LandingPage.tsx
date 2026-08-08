import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import heroImg from '../assets/images/hero_healthcare_1786183939077.jpg';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-[calc(100vh-65px)] bg-[#0B0F0E] text-slate-100 flex flex-col justify-between overflow-hidden selection:bg-teal-500 selection:text-slate-950 font-sans">
      {/* Background Graphic with Dark Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={heroImg}
          alt="Healthcare AI Network"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-25 scale-105 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0E] via-[#0B0F0E]/80 to-[#0B0F0E]/60" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-30 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      {/* Main Hero Content */}
      <main className="relative z-10 max-w-4xl w-full mx-auto px-6 py-12 my-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/40 text-teal-300 text-xs font-semibold backdrop-blur-md shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>{t('landing.heroBadge', 'Clinical AI Support')}</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            {t('landing.title', 'AI-Powered Healthcare, Wherever You Are')}
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-teal-400 tracking-tight">
            {t('landing.subheading', 'Faster Triage. Smarter Referrals. Real Assistance.')}
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            {t('landing.description', 'Medihivi AI helps you understand your symptoms, find the right care, and get help fast — powered by AI, designed for real healthcare journeys.')}
          </p>
        </div>

        <div className="pt-4 flex items-center justify-center">
          <button
            onClick={() => navigate('/home')}
            className="group relative inline-flex items-center gap-3 bg-teal-600 hover:bg-teal-500 text-slate-950 font-extrabold text-sm sm:text-base px-8 py-4 rounded-2xl shadow-xl shadow-teal-600/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>{t('landing.getStarted', 'Get Started →')}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-slate-950" />
          </button>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 text-center text-xs text-slate-500 font-medium border-t border-slate-900/80">
        Medihivi AI Decision Support Platform • Built with clinical safety safeguards
      </footer>
    </div>
  );
};
