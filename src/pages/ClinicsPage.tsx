import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { MobileClinic } from '../types';
import { 
  Truck, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  Bell, 
  CheckCircle2, 
  X, 
  Stethoscope 
} from 'lucide-react';

export const ClinicsPage: React.FC = () => {
  const { mobileClinics, toggleClinicReminder } = useApp();
  const { t } = useTranslation();

  const [selectedClinic, setSelectedClinic] = useState<MobileClinic | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1 border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Truck className="w-6 h-6 text-emerald-400" />
          {t('clinics.title', 'Mobile Health Clinics')}
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          {t('clinics.subtitle', 'Track upcoming mobile health vans, diagnostic units, and medical outreach camps')}
        </p>
      </div>

      {/* Clinics Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mobileClinics.map((clinic) => (
          <div
            key={clinic.id}
            className="bento-card p-6 flex flex-col justify-between space-y-5 hover:border-emerald-500/40 transition"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-white">{clinic.name}</h3>
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Village: {clinic.village}, {clinic.district}</span>
                  </p>
                </div>
                <span className="bento-tag bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded text-[10px] shrink-0">
                  {clinic.status}
                </span>
              </div>

              {/* Timing & Doctor */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-[#0B0F0E] rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    {t('clinics.nextVisit', 'Next Visit')}
                  </span>
                  <p className="font-extrabold text-white">{clinic.nextVisitDate}</p>
                  <p className="text-[10px] text-slate-400">{clinic.visitTiming}</p>
                </div>

                <div className="p-3 bg-[#0B0F0E] rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                    <Stethoscope className="w-3 h-3 text-teal-400" />
                    On-Duty Specialist
                  </span>
                  <p className="font-bold text-teal-300 truncate">{clinic.doctorSpecialty}</p>
                </div>
              </div>

              {/* Services Provided */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Services Available:</span>
                <div className="flex flex-wrap gap-1.5">
                  {clinic.servicesProvided.map((svc, i) => (
                    <span
                      key={i}
                      className="bg-slate-900 text-slate-300 border border-slate-800 px-2.5 py-0.5 rounded text-[11px] font-medium"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => toggleClinicReminder(clinic.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer border ${
                  clinic.reminderSet
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                    : 'bg-[#0B0F0E] hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {clinic.reminderSet ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t('clinics.reminderSet', 'Reminder Active')}</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('clinics.setReminder', 'Set Reminder')}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedClinic(clinic)}
                className="text-xs font-bold text-teal-400 hover:text-teal-300 cursor-pointer"
              >
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedClinic && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131C1E] border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base">{selectedClinic.name}</h3>
              <button onClick={() => setSelectedClinic(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-[#0B0F0E] rounded-xl border border-slate-800 space-y-1">
                <p className="text-[10px] uppercase text-slate-500 font-bold">Location & Village</p>
                <p className="font-bold text-white">{selectedClinic.village}, {selectedClinic.district}</p>
              </div>

              <div className="p-3 bg-[#0B0F0E] rounded-xl border border-slate-800 space-y-1">
                <p className="text-[10px] uppercase text-slate-500 font-bold">Contact Helpline</p>
                <p className="font-mono text-sm text-teal-300 font-bold">{selectedClinic.contactNumber}</p>
              </div>

              <div className="p-3 bg-[#0B0F0E] rounded-xl border border-slate-800 space-y-1">
                <p className="text-[10px] uppercase text-slate-500 font-bold">Full Services Checklist</p>
                <ul className="space-y-1 font-medium">
                  {selectedClinic.servicesProvided.map((s, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setSelectedClinic(null)}
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
