import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { TriageLevel, ReferralStatus } from '../types';
import { 
  Send, 
  Plus, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Phone, 
  X, 
  AlertCircle,
  Ban
} from 'lucide-react';

export const ReferralsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { referrals, facilities, addReferral, updateReferralStatus, user } = useApp();
  const { t } = useTranslation();

  // If URL path is `/referrals/new`
  const isNewRoute = window.location.pathname.endsWith('/new');

  // New Referral Form State
  const initialFacilityId = searchParams.get('facilityId') || facilities[0]?.id || '';
  const [patientName, setPatientName] = useState(user.name);
  const [triageLevel, setTriageLevel] = useState<TriageLevel>('RED');
  const [targetFacilityId, setTargetFacilityId] = useState(initialFacilityId);
  const [reason, setReason] = useState('');
  const [specialty, setSpecialty] = useState('Cardiology');

  // Modals for Detail View
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // 1. NEW REFERRAL FORM VIEW
  if (isNewRoute) {
    const handleCreateReferral = (e: React.FormEvent) => {
      e.preventDefault();
      if (!reason.trim()) return;

      const targetFac = facilities.find((f) => f.id === targetFacilityId) || facilities[0];

      const created = addReferral({
        patientId: user.id,
        patientName,
        age: 64,
        gender: 'male',
        triageLevel,
        referringFacility: 'Srirangapatna PHC',
        targetFacilityId: targetFac.id,
        targetFacilityName: targetFac.name,
        requiredSpecialty: specialty,
        reason,
        status: 'SENT',
      });

      navigate(`/referrals/${created.id}`);
    };

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <button
            onClick={() => navigate('/referrals')}
            className="p-2 bg-[#131C1E] hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-teal-400" />
              {t('referrals.newTitle', 'Create New Referral Note')}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Create a digital referral record routed directly to hospital emergency desk
            </p>
          </div>
        </div>

        <form onSubmit={handleCreateReferral} className="bento-card p-6 sm:p-8 space-y-6">
          {/* Patient Info */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {t('referrals.patientName', 'Patient Full Name')}
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
              className="w-full bg-[#0B0F0E] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500/80 transition"
            />
          </div>

          {/* Triage Priority Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {t('referrals.priority', 'Priority')} Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { level: 'RED', label: '🔴 High (RED)' },
                { level: 'ORANGE', label: '🟠 Urgent' },
                { level: 'YELLOW', label: '🟡 Priority' },
                { level: 'GREEN', label: '🟢 Routine' },
              ].map((item) => (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => setTriageLevel(item.level as TriageLevel)}
                  className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    triageLevel === item.level
                      ? 'bg-teal-600/20 text-teal-300 border-teal-500/80 shadow-xs'
                      : 'bg-[#0B0F0E] text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Destination Facility Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {t('referrals.selectFacility', 'Select Destination Facility')}
            </label>
            <select
              value={targetFacilityId}
              onChange={(e) => setTargetFacilityId(e.target.value)}
              className="w-full bg-[#0B0F0E] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500/80 transition"
            >
              {facilities.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.name} ({fac.type} - {fac.distanceKm} km)
                </option>
              ))}
            </select>
          </div>

          {/* Specialty */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Required Specialty Department
            </label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="e.g. Cardiology, Neurology, Orthopedics"
              className="w-full bg-[#0B0F0E] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500/80 transition"
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              {t('referrals.reason', 'Referral Reason / Medical Notes')}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe acute symptoms, SpO2, vitals, or why local PHC cannot manage..."
              rows={4}
              required
              className="w-full bg-[#0B0F0E] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500/80 transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-500 text-slate-950 font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-teal-600/20 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4 text-slate-950" />
            <span>{t('referrals.submit', 'Submit Referral')}</span>
          </button>
        </form>
      </div>
    );
  }

  // 2. REFERRAL DETAIL VIEW (`/referrals/:id`)
  if (id) {
    const referral = referrals.find((r) => r.id === id) || referrals[0];

    const timelineSteps: { status: ReferralStatus; title: string; desc: string }[] = [
      { status: 'SENT', title: t('referrals.statusSent', 'Sent to Facility'), desc: 'Submitted by referring healthcare center' },
      { status: 'ACCEPTED', title: 'Hospital Accepted', desc: 'Desk confirmed bed reservation' },
      { status: 'IN_TRANSIT', title: 'Patient In Transit', desc: 'En route via emergency transport' },
      { status: 'COMPLETED', title: t('referrals.statusCompleted', 'Patient Admitted / Completed'), desc: 'Admitted & under specialist care' },
    ];

    const currentIdx = timelineSteps.findIndex((s) => s.status === referral.status);

    const handleCancelReferral = () => {
      updateReferralStatus(referral.id, 'REJECTED');
      setShowCancelConfirm(false);
    };

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <button
            onClick={() => navigate('/referrals')}
            className="p-2 bg-[#131C1E] hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">Referral #{referral.id}</h1>
              <span className={`bento-tag border px-2 py-0.5 rounded text-[10px] ${
                referral.status === 'REJECTED'
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-teal-950 text-teal-300 border-teal-800'
              }`}>
                {referral.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Patient: {referral.patientName} • Specialty: {referral.requiredSpecialty}
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bento-card p-6 space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {t('referrals.timelineTitle', 'Referral Processing Timeline')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            {timelineSteps.map((stepItem, idx) => {
              const isPassed = referral.status !== 'REJECTED' && idx <= (currentIdx === -1 ? 1 : currentIdx);
              return (
                <div
                  key={stepItem.status}
                  className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                    isPassed
                      ? 'bg-teal-950/40 border-teal-500/50 text-teal-200'
                      : 'bg-[#0B0F0E] border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    {isPassed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                    )}
                    <span>{stepItem.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    {stepItem.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clinical Summary Box */}
        <div className="bento-card p-6 space-y-3">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {t('referrals.reason', 'Referral Reason / Medical Notes')}
          </h2>
          <div className="bg-[#0B0F0E] border border-slate-800 p-4 rounded-xl text-xs text-slate-200 leading-relaxed font-medium">
            {referral.reason}
          </div>
          <p className="text-[11px] text-slate-400">
            Destination: <span className="text-white font-bold">{referral.targetFacilityName}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => navigate(`/facilities/${referral.targetFacilityId}`)}
            className="bg-[#131C1E] hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-2 cursor-pointer transition"
          >
            <Building2 className="w-4 h-4 text-teal-400" />
            <span>View Destination Facility</span>
          </button>

          <button
            onClick={() => setShowContactModal(true)}
            className="bg-[#131C1E] hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-2 cursor-pointer transition"
          >
            <Phone className="w-4 h-4 text-teal-400" />
            <span>{t('referrals.contactFacility', 'Contact Facility')}</span>
          </button>

          {referral.status !== 'REJECTED' && referral.status !== 'COMPLETED' && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800 font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-1.5 cursor-pointer transition ml-auto"
            >
              <Ban className="w-4 h-4 text-rose-400" />
              <span>{t('referrals.cancelReferral', 'Cancel Referral')}</span>
            </button>
          )}
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#131C1E] border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-white text-base">Hospital Contact</h3>
                <button onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 bg-[#0B0F0E] rounded-xl border border-slate-800 space-y-2 text-xs">
                <p className="text-slate-400">{referral.targetFacilityName}</p>
                <p className="font-mono text-sm text-teal-300 font-bold">+91-8232-220055</p>
                <p className="text-[11px] text-slate-500">24/7 Casualty Emergency Desk</p>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="w-full bg-slate-800 text-slate-200 text-xs font-bold py-2.5 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#131C1E] border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-white text-base">Confirm Cancellation</h3>
                <button onClick={() => setShowCancelConfirm(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-300">
                {t('referrals.cancelConfirm', 'Are you sure you want to cancel this referral?')}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleCancelReferral}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold py-2.5 rounded-xl cursor-pointer"
                >
                  Yes, Cancel Referral
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 bg-slate-800 text-slate-200 text-xs font-bold py-2.5 rounded-xl cursor-pointer"
                >
                  Keep Active
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. REFERRALS LIST VIEW (`/referrals`)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Send className="w-6 h-6 text-teal-400" />
            {t('referrals.title', 'My Health Referrals')}
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {t('referrals.subtitle', 'Track digital referral notes between primary health centers and district hospitals')}
          </p>
        </div>
        <button
          onClick={() => navigate('/referrals/new')}
          className="bg-teal-600 hover:bg-teal-500 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-teal-600/20 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>{t('referrals.newReferral', '+ New Referral')}</span>
        </button>
      </div>

      {/* Referrals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {referrals.map((ref) => (
          <div
            key={ref.id}
            className="bento-card p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/40 transition"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-sm text-white">Referral #{ref.id}</h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {t('referrals.patient', 'Patient')}: {ref.patientName}
                  </p>
                </div>
                <span className={`bento-tag border px-2 py-0.5 rounded text-[9px] ${
                  ref.status === 'REJECTED'
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : 'bg-teal-950 text-teal-300 border-teal-800'
                }`}>
                  {ref.status}
                </span>
              </div>

              <div className="p-3 bg-[#0B0F0E] rounded-xl border border-slate-800 space-y-1 text-xs">
                <p className="text-slate-400">
                  Target: <span className="text-slate-200 font-bold">{ref.targetFacilityName}</span>
                </p>
                <p className="text-slate-400">
                  Specialty: <span className="text-teal-400 font-bold">{ref.requiredSpecialty}</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500 font-mono">
                {new Date(ref.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => navigate(`/referrals/${ref.id}`)}
                className="font-bold text-teal-400 hover:text-teal-300 transition cursor-pointer"
              >
                {t('referrals.track', 'Track Progress')} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
