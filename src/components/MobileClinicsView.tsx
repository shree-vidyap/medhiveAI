import React, { useState, useEffect } from 'react';
import { Language, MobileClinic } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { fetchMobileClinics } from '../services/api';
import { Calendar, Clock, MapPin, Phone, Stethoscope, Truck } from 'lucide-react';

interface MobileClinicsViewProps {
  currentLanguage: Language;
}

export const MobileClinicsView: React.FC<MobileClinicsViewProps> = ({ currentLanguage }) => {
  const t = TRANSLATIONS[currentLanguage];

  const [clinics, setClinics] = useState<MobileClinic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadClinics();
  }, []);

  const loadClinics = async () => {
    setLoading(true);
    try {
      const data = await fetchMobileClinics();
      setClinics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="mobile-clinics-component" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t.mobileClinics}</h2>
            <p className="text-xs text-slate-400">Scheduled Sanjeevini & NHM Rural Healthcare Vans in Nearby Villages</p>
          </div>
        </div>
      </div>

      {/* Clinics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clinics.map((clinic) => (
          <div key={clinic.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-teal-500/20 text-teal-400 rounded-md">
                  {clinic.district} District
                </span>
                <h3 className="text-base font-bold text-white mt-1">{clinic.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  Visiting Village: <strong className="text-white">{clinic.village}</strong>
                </p>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
                {clinic.status}
              </span>
            </div>

            {/* Visit Schedule */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div className="bg-slate-800/60 p-2.5 rounded-xl flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Next Visit Date</span>
                  <span className="font-bold text-white">{clinic.nextVisitDate}</span>
                </div>
              </div>

              <div className="bg-slate-800/60 p-2.5 rounded-xl flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Timing</span>
                  <span className="font-bold text-white">{clinic.visitTiming}</span>
                </div>
              </div>
            </div>

            {/* Services Offered */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase block mb-1.5">Services Provided:</span>
              <div className="flex flex-wrap gap-1.5">
                {clinic.servicesProvided.map((service, sIdx) => (
                  <span key={sIdx} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                    • {service}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 p-3 rounded-xl flex items-center justify-between text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-400" />
                <span>Specialist: <strong className="text-white">{clinic.doctorSpecialty}</strong></span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{clinic.contactNumber}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
