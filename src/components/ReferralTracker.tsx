import React, { useState, useEffect } from 'react';
import { Language, Referral, ReferralStatus } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { TriageBadge } from './TriageBadge';
import { fetchReferrals, patchReferralStatus } from '../services/api';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Filter, 
  MapPin, 
  RefreshCw, 
  Send, 
  Truck, 
  User, 
  XCircle 
} from 'lucide-react';

interface ReferralTrackerProps {
  currentLanguage: Language;
}

export const ReferralTracker: React.FC<ReferralTrackerProps> = ({ currentLanguage }) => {
  const t = TRANSLATIONS[currentLanguage];

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    setLoading(true);
    try {
      const data = await fetchReferrals();
      setReferrals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: ReferralStatus) => {
    try {
      const updated = await patchReferralStatus(id, newStatus, `Status updated to ${newStatus}`);
      setReferrals((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      console.error(err);
    }
  };

  const stages: { key: ReferralStatus; label: string }[] = [
    { key: 'SENT', label: 'Sent' },
    { key: 'ACCEPTED', label: 'Accepted' },
    { key: 'IN_TRANSIT', label: 'In Transit' },
    { key: 'ARRIVED', label: 'Arrived' },
    { key: 'UNDER_CARE', label: 'Under Care' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  const filtered = referrals.filter((r) => filterStatus === 'ALL' || r.status === filterStatus);

  return (
    <div id="referral-tracker-component" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t.myReferrals}</h2>
            <p className="text-xs text-slate-400">Smart Referral Lifecycle Tracking & Emergency Transport Pipeline</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Referral Statuses</option>
            <option value="SENT">Sent</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <button
            onClick={loadReferrals}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Referrals List */}
      <div className="space-y-4">
        {filtered.map((referral) => {
          const currentStageIndex = stages.findIndex((s) => s.key === referral.status);

          return (
            <div
              key={referral.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5"
            >
              {/* Top Row: Patient Info & ID */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white">
                    <User className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{referral.patientName}</h3>
                      <span className="text-xs text-slate-400">({referral.age} yrs, {referral.gender})</span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>ID: <strong className="text-slate-300">{referral.id}</strong></span>
                      <span>•</span>
                      <span>Target: <strong className="text-emerald-400">{referral.targetFacilityName}</strong></span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TriageBadge level={referral.triageLevel} size="md" />
                </div>
              </div>

              {/* Progress Stepper Timeline */}
              <div className="py-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3">Referral Status Lifecycle Timeline:</span>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {stages.map((stg, idx) => {
                    const isPassed = currentStageIndex >= idx;
                    const isCurrent = currentStageIndex === idx;

                    return (
                      <div
                        key={stg.key}
                        className={`p-2 rounded-xl text-center border text-xs transition ${
                          isCurrent
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                            : isPassed
                            ? 'bg-slate-800 text-emerald-400 border-slate-700'
                            : 'bg-slate-900 text-slate-600 border-slate-800'
                        }`}
                      >
                        <span className="block text-[10px] text-slate-500">Step {idx + 1}</span>
                        <span>{stg.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Clinical Details & Action Bar */}
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase block">Specialty Needed: {referral.requiredSpecialty}</span>
                  <p className="text-xs text-slate-300 mt-1">{referral.reason}</p>
                </div>

                {/* Status Action Buttons for Doctors/Health Workers */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {referral.status === 'SENT' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(referral.id, 'ACCEPTED')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-2 rounded-lg"
                      >
                        Accept Referral
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(referral.id, 'REJECTED')}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3 py-2 rounded-lg"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {referral.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleUpdateStatus(referral.id, 'IN_TRANSIT')}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      Mark In Transit
                    </button>
                  )}

                  {referral.status === 'IN_TRANSIT' && (
                    <button
                      onClick={() => handleUpdateStatus(referral.id, 'ARRIVED')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-2 rounded-lg"
                    >
                      Mark Patient Arrived
                    </button>
                  )}

                  {referral.status === 'ARRIVED' && (
                    <button
                      onClick={() => handleUpdateStatus(referral.id, 'COMPLETED')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-2 rounded-lg"
                    >
                      Complete Care
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
