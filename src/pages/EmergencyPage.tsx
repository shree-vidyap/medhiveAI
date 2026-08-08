import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Siren, 
  ShieldAlert, 
  Building2, 
  Truck, 
  PhoneCall, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  X, 
  Info 
} from 'lucide-react';

export const EmergencyPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [viewState, setViewState] = useState<'main' | 'confirm' | 'tracking'>('main');
  const [showContactModal, setShowContactModal] = useState(false);

  const handleConfirmRequest = () => {
    setViewState('tracking');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-rose-900/60 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/home')}
            className="p-2 bg-[#131C1E] hover:bg-slate-800 rounded-xl border border-rose-900/50 text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-rose-400 flex items-center gap-2">
              <Siren className="w-6 h-6 text-rose-500 animate-pulse" />
              {t('emergency.title', 'Emergency Center')}
            </h1>
            <p className="text-xs text-rose-200/70 font-medium">
              {t('emergency.subtitle', 'High-priority urgent healthcare response & emergency dispatch')}
            </p>
          </div>
        </div>

        <span className="bento-tag bg-rose-950 text-rose-300 border border-rose-700/80 px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          108 Emergency Direct
        </span>
      </div>

      {/* VIEW 1: MAIN EMERGENCY CENTER LANDING */}
      {viewState === 'main' && (
        <div className="bento-card-emergency p-6 sm:p-8 space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl font-black text-white">
              {t('emergency.dangerQuestion', 'Are you or someone near you in immediate danger?')}
            </h2>
            <p className="text-sm text-rose-200/80 font-medium leading-relaxed">
              {t('emergency.dangerDesc', 'For severe chest pain, loss of consciousness, uncontrolled bleeding, severe trauma, or acute breathing difficulty.')}
            </p>
          </div>

          {/* Stacked Large Easy-Tap Buttons */}
          <div className="space-y-3 pt-2">
            {/* 1. Danger Button (Red) */}
            <button
              onClick={() => setViewState('confirm')}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black text-sm py-4 px-6 rounded-xl shadow-xl shadow-rose-600/30 flex items-center justify-center gap-3 cursor-pointer transition transform active:scale-98"
            >
              <ShieldAlert className="w-5 h-5 text-white" />
              <span>{t('emergency.requestAssistance', 'Request Emergency Assistance')}</span>
            </button>

            {/* 2. Secondary: Find Nearest Emergency Facility */}
            <button
              onClick={() => navigate('/facilities')}
              className="w-full bg-[#131C1E] hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>{t('emergency.findFacility', 'Find Nearest Emergency Facility')}</span>
            </button>

            {/* 3. Secondary: Request Transport */}
            <button
              onClick={() => setViewState('confirm')}
              className="w-full bg-[#131C1E] hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <Truck className="w-4 h-4 text-amber-400" />
              <span>{t('emergency.requestTransport', 'Request Transport (Ambulance / 108)')}</span>
            </button>

            {/* 4. Secondary: Contact Health Worker */}
            <button
              onClick={() => setShowContactModal(true)}
              className="w-full bg-[#131C1E] hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>{t('emergency.contactWorker', 'Contact Health Worker')}</span>
            </button>

            {/* 5. Outline: I'm Safe — Return */}
            <button
              onClick={() => navigate('/home')}
              className="w-full border border-slate-700 hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
            >
              {t('emergency.imSafe', "I'm Safe — Return to Home")}
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: CONFIRMATION STEP */}
      {viewState === 'confirm' && (
        <div className="bento-card p-6 sm:p-8 space-y-6 max-w-lg mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-white">{t('emergency.confirmTitle', 'Confirm Emergency Dispatch')}</h2>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {t('emergency.confirmDesc', 'This will notify the nearest Emergency ER Desk and dispatch 108 Emergency Ambulance transport.')}
            </p>
          </div>

          <div className="p-4 bg-amber-950/40 border border-amber-700/60 rounded-xl text-left text-xs text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Simulated Prototype Flow</span>
            </div>
            <p className="text-[11px] text-amber-300/80">
              {t('emergency.confirmNotice', 'No actual real 108 ambulance will be dispatched.')}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleConfirmRequest}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-rose-600/30 cursor-pointer"
            >
              {t('emergency.confirmButton', 'Confirm & Request Dispatch')}
            </button>

            <button
              onClick={() => setViewState('main')}
              className="w-full bg-slate-800 text-slate-300 text-xs font-bold py-2.5 rounded-xl cursor-pointer"
            >
              {t('emergency.cancelButton', 'Cancel Request')}
            </button>
          </div>
        </div>
      )}

      {/* VIEW 3: SIMULATED TRANSPORT TRACKING */}
      {viewState === 'tracking' && (
        <div className="bento-card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="bento-tag bg-rose-950 text-rose-300 border border-rose-800 px-2.5 py-0.5 rounded text-[10px] font-bold">
                Prototype / Simulated Data
              </span>
              <h2 className="text-lg font-extrabold text-white mt-1">{t('emergency.trackingTitle', '108 Emergency Transport Active')}</h2>
            </div>
            <span className="text-xs font-mono text-teal-400 font-bold bg-teal-950 px-2.5 py-1 rounded border border-teal-800">
              {t('emergency.etaLabel', 'ETA: 12 Mins')}
            </span>
          </div>

          {/* Status Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-teal-950/40 border border-teal-500/50 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-teal-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>{t('emergency.requestReceived', 'Request Received')}</span>
              </div>
              <p className="text-[10px] text-slate-400">ER Dispatcher Acknowledged</p>
            </div>

            <div className="p-3.5 bg-teal-950/40 border border-teal-500/50 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-teal-300">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>{t('emergency.transportAssigned', 'Transport Assigned')}</span>
              </div>
              <p className="text-[10px] text-slate-400">Ambulance KA-11-G-0108</p>
            </div>

            <div className="p-3.5 bg-rose-950/40 border border-rose-500/50 rounded-xl text-xs space-y-1 animate-pulse">
              <div className="flex items-center gap-1.5 font-bold text-rose-300">
                <Clock className="w-4 h-4 text-rose-400" />
                <span>{t('emergency.vehicleEnRoute', 'Vehicle En Route')}</span>
              </div>
              <p className="text-[10px] text-slate-300">Driver: Shivanna (+91 98000 10808)</p>
            </div>
          </div>

          <div className="p-4 bg-[#0B0F0E] rounded-xl border border-slate-800 space-y-2 text-xs">
            <p className="font-bold text-slate-200">Destination Hospital:</p>
            <p className="text-teal-300 font-bold">Mandya Institute of Medical Sciences (MIMS)</p>
            <p className="text-slate-400 text-[11px]">Bengaluru-Mysuru Highway, Mandya • ICU Bed #4 Reserved</p>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setViewState('main')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
            >
              Back to Emergency Options
            </button>
            <button
              onClick={() => navigate('/home')}
              className="bg-teal-600 hover:bg-teal-500 text-slate-950 font-extrabold text-xs py-2.5 px-4 rounded-xl cursor-pointer"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Health Worker Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131C1E] border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">Emergency Health Worker Contacts</h3>
              <button onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#0B0F0E] rounded-xl border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-500 uppercase font-bold">108 Emergency Helpline</p>
                <p className="font-mono text-sm text-rose-400 font-extrabold">108 (Toll Free)</p>
              </div>
              <div className="p-3 bg-[#0B0F0E] rounded-xl border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-500 uppercase font-bold">On-Duty PHC Medical Officer</p>
                <p className="font-mono text-sm text-teal-300 font-bold">+91-8232-252044 (Dr. Kumar)</p>
              </div>
              <div className="p-3 bg-[#0B0F0E] rounded-xl border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-500 uppercase font-bold">Local ASHA Worker</p>
                <p className="font-mono text-sm text-teal-300 font-bold">+91-94808-11223 (Savitha)</p>
              </div>
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
    </div>
  );
};
