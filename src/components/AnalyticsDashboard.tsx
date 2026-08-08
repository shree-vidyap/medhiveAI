import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { fetchAnalytics } from '../services/api';
import { 
  Activity, 
  AlertOctagon, 
  BarChart3, 
  Bed, 
  CheckCircle2, 
  Clock, 
  PieChart, 
  RefreshCw, 
  Send, 
  TrendingUp, 
  Users 
} from 'lucide-react';

interface AnalyticsDashboardProps {
  currentLanguage: Language;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ currentLanguage }) => {
  const t = TRANSLATIONS[currentLanguage];

  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-2" />
        <p className="text-sm font-semibold">Loading Health Worker Analytics...</p>
      </div>
    );
  }

  return (
    <div id="analytics-dashboard-component" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t.analytics} Dashboard</h2>
            <p className="text-xs text-slate-400">Real-Time Rural Healthcare Triage & Referral Analytics</p>
          </div>
        </div>

        <button
          onClick={loadData}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">{t.totalPatients}</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{analytics.totalPatientsToday}</div>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% from yesterday
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">{t.emergencyCases}</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">{analytics.emergencyCases}</div>
          <p className="text-[10px] text-rose-300">RED Urgency — Immediate ER</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">{t.pendingReferrals}</span>
            <Send className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">{analytics.pendingReferrals}</div>
          <p className="text-[10px] text-purple-400">In-transit & pending acceptance</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">{t.availableBeds}</span>
            <Bed className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">{analytics.totalAvailableBeds}</div>
          <p className="text-[10px] text-slate-400">Across Mandya District PHCs/Hospitals</p>
        </div>
      </div>

      {/* Visual Triage Distribution Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <PieChart className="w-5 h-5 text-emerald-400" />
          Triage Urgency Breakdown Today
        </h3>

        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div style={{ width: '25%' }} className="bg-rose-600 h-full" title="RED" />
            <div style={{ width: '30%' }} className="bg-amber-500 h-full" title="ORANGE" />
            <div style={{ width: '25%' }} className="bg-yellow-400 h-full" title="YELLOW" />
            <div style={{ width: '20%' }} className="bg-emerald-500 h-full" title="GREEN" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2 bg-slate-800 p-2.5 rounded-xl">
              <span className="w-3 h-3 rounded-full bg-rose-600 shrink-0" />
              <span>RED (Emergency): <strong>{analytics.triageBreakdown?.RED || 5}</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 p-2.5 rounded-xl">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
              <span>ORANGE (Urgent): <strong>{analytics.triageBreakdown?.ORANGE || 8}</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 p-2.5 rounded-xl">
              <span className="w-3 h-3 rounded-full bg-yellow-400 shrink-0" />
              <span>YELLOW (Priority): <strong>{analytics.triageBreakdown?.YELLOW || 8}</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 p-2.5 rounded-xl">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
              <span>GREEN (Routine): <strong>{analytics.triageBreakdown?.GREEN || 12}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
