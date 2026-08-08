import React, { useState, useEffect } from 'react';
import { Facility, Language, Referral, TriageLevel } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { fetchFacilities, createReferral } from '../services/api';
import { 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  Crosshair, 
  MapPin, 
  Phone, 
  Search, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  Stethoscope, 
  Truck, 
  X 
} from 'lucide-react';

interface FacilityFinderProps {
  currentLanguage: Language;
  selectedTriageLevel?: TriageLevel;
  symptomsList?: string[];
  onReferralCreated?: (referral: Referral) => void;
}

export const FacilityFinder: React.FC<FacilityFinderProps> = ({
  currentLanguage,
  selectedTriageLevel = 'YELLOW',
  symptomsList = [],
  onReferralCreated,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Referral Modal state
  const [targetFacility, setTargetFacility] = useState<Facility | null>(null);
  const [patientName, setPatientName] = useState<string>('Basavaraju M');
  const [patientAge, setPatientAge] = useState<number>(64);
  const [requiredSpecialty, setRequiredSpecialty] = useState<string>('Cardiology');
  const [referralReason, setReferralReason] = useState<string>('Acute chest pain with SpO2 88% requiring cardiology specialist evaluation');
  const [isSubmittingReferral, setIsSubmittingReferral] = useState<boolean>(false);

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    setLoading(true);
    try {
      const data = await fetchFacilities();

      // Compute Suitability Scores dynamically
      const scored = data.map((fac) => {
        let specMatch = 70;
        let emergMatch = fac.emergencyAvailable ? 100 : 30;
        let bedScore = Math.min(100, Math.round((fac.beds.available / Math.max(1, fac.beds.total)) * 300));
        let diagScore = (Object.values(fac.diagnostics).filter(Boolean).length / 5) * 100;
        let distScore = Math.max(20, 100 - fac.distanceKm * 2);

        if (fac.specialists.includes(requiredSpecialty)) specMatch = 100;

        const overall = Math.round(specMatch * 0.35 + emergMatch * 0.25 + bedScore * 0.15 + diagScore * 0.15 + distScore * 0.10);

        return {
          ...fac,
          suitabilityScore: Math.min(99, Math.max(40, overall)),
          suitabilityBreakdown: {
            specialistMatch: Math.round(specMatch),
            emergencyMatch: Math.round(emergMatch),
            bedAvailability: Math.round(bedScore),
            diagnosticMatch: Math.round(diagScore),
            distanceScore: Math.round(distScore),
          },
        };
      });

      scored.sort((a, b) => (b.suitabilityScore || 0) - (a.suitabilityScore || 0));
      setFacilities(scored);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = facilities.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.specialists.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'ALL' || f.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleCreateReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetFacility) return;

    setIsSubmittingReferral(true);
    try {
      const newRef = await createReferral({
        patientId: `RC-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        patientName,
        age: patientAge,
        gender: 'male',
        triageLevel: selectedTriageLevel as TriageLevel,
        referringFacility: 'Srirangapatna PHC',
        targetFacilityId: targetFacility.id,
        targetFacilityName: targetFacility.name,
        requiredSpecialty,
        reason: referralReason,
        status: 'SENT',
      });

      if (onReferralCreated) onReferralCreated(newRef);
      setTargetFacility(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReferral(false);
    }
  };

  return (
    <div id="facility-finder-component" className="space-y-6">
      {/* Header */}
      <div className="bento-card p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-[#7c3aed]/20 text-purple-300 border border-[#7c3aed]/30 rounded-2xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">{t.findFacility}</h2>
              <p className="bento-tag text-neutral-500 mt-0.5">Agent 2: Smart Referral Agent & Capacity Intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#141416] p-1 rounded-xl border border-[#22222a]">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'list'
                    ? 'bg-[#7c3aed] text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                List View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                  viewMode === 'map'
                    ? 'bg-[#7c3aed] text-white shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Map View</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-[#141416] px-3.5 py-1.5 rounded-xl border border-[#22222a] text-xs text-neutral-300">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="font-medium">District: Mandya, KA</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hospital name, specialty (Cardiology, ICU)..."
              className="w-full bg-[#141416] border border-[#22222a] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:border-[#7c3aed] focus:outline-none transition"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#141416] border border-[#22222a] rounded-xl px-3.5 py-2 text-sm text-white focus:border-[#7c3aed] focus:outline-none cursor-pointer transition"
          >
            <option value="ALL" className="bg-[#141416]">All Facility Types</option>
            <option value="Medical College" className="bg-[#141416]">Medical Colleges</option>
            <option value="District Hospital" className="bg-[#141416]">District Hospitals</option>
            <option value="CHC" className="bg-[#141416]">Community Health Centres (CHC)</option>
            <option value="PHC" className="bg-[#141416]">Primary Health Centres (PHC)</option>
          </select>
        </div>
      </div>

      {/* Map View or List View */}
      {viewMode === 'map' ? (
        <div className="bento-card p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              Mandya District Healthcare Referral Network Map
            </h3>
            <span className="bento-tag px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live GIS Network
            </span>
          </div>

          <div className="relative w-full h-80 bg-[#0a0a0c] border border-[#22222a] rounded-2xl overflow-hidden flex items-center justify-center p-4">
            <svg className="w-full h-full text-neutral-700" viewBox="0 0 600 300" fill="none">
              {/* Road Network Lines */}
              <path d="M 80 220 Q 200 180 320 120 T 520 80" stroke="#22222a" strokeWidth="4" strokeDasharray="6 6" />
              <path d="M 80 220 Q 150 120 320 120 T 480 200" stroke="#1f1f23" strokeWidth="3" />

              {/* Direction Route highlighted to Top Recommendation */}
              <path d="M 80 220 Q 200 180 320 120" stroke="#7c3aed" strokeWidth="3" className="animate-pulse" />

              {/* Patient Location Pin */}
              <g transform="translate(80, 220)">
                <circle r="12" fill="#7c3aed" fillOpacity="0.3" className="animate-ping" />
                <circle r="8" fill="#7c3aed" />
                <text x="0" y="-14" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Srirangapatna PHC (You)</text>
              </g>

              {/* Recommended Hospital 1 (MIMS Mandya) */}
              <g transform="translate(320, 120)" className="cursor-pointer">
                <circle r="14" fill="#10b981" fillOpacity="0.2" />
                <circle r="8" fill="#10b981" />
                <text x="0" y="-16" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="bold">MIMS Hospital Mandya (98% Match)</text>
                <text x="0" y="22" textAnchor="middle" fill="#a3a3a3" fontSize="8">18 km • 25 mins • 6 ICU Beds</text>
              </g>

              {/* Hospital 2 (District Hospital) */}
              <g transform="translate(480, 80)" className="cursor-pointer">
                <circle r="6" fill="#f59e0b" />
                <text x="0" y="-12" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="bold">District Hospital (88%)</text>
              </g>

              {/* Hospital 3 (Maddur CHC) */}
              <g transform="translate(480, 200)" className="cursor-pointer">
                <circle r="6" fill="#a855f7" />
                <text x="0" y="-12" textAnchor="middle" fill="#a855f7" fontSize="9" fontWeight="bold">Maddur CHC (74%)</text>
              </g>
            </svg>

            <div className="absolute bottom-3 left-3 bg-[#141416]/90 border border-[#22222a] p-2.5 rounded-xl backdrop-blur-md text-[10px] space-y-1">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]" />
                <span>Patient Origin (Srirangapatna PHC)</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Top Recommendation: MIMS Mandya (98% Match)</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Facilities Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((facility) => (
            <div
              key={facility.id}
              className="bento-card p-5 shadow-xl flex flex-col justify-between space-y-4"
            >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="bento-tag px-2 py-0.5 bg-[#141416] text-neutral-300 rounded-md border border-[#22222a]">
                    {facility.type}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1.5">{facility.name}</h3>
                  <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                    {facility.distanceKm} km away • approx. {facility.travelTimeMins} mins travel
                  </p>
                </div>

                {/* Suitability Score Badge */}
                {facility.suitabilityScore && (
                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center gap-1 bg-[#7c3aed]/10 border border-[#7c3aed]/30 text-purple-300 text-xs font-bold px-2.5 py-1 rounded-xl">
                      <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                      <span>{facility.suitabilityScore}% Match</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Beds & Emergency Badges */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#1f1f23] text-center text-xs">
                <div className="bg-[#141416] p-2 rounded-xl">
                  <span className="bento-tag text-[9px] text-neutral-400 block">General Beds</span>
                  <span className="font-bold text-white">{facility.beds.available} / {facility.beds.total}</span>
                </div>
                <div className="bg-[#141416] p-2 rounded-xl">
                  <span className="bento-tag text-[9px] text-neutral-400 block">ICU Beds</span>
                  <span className="font-bold text-amber-300">{facility.icuBeds.available} / {facility.icuBeds.total}</span>
                </div>
                <div className="bg-[#141416] p-2 rounded-xl">
                  <span className="bento-tag text-[9px] text-neutral-400 block">Emergency ER</span>
                  <span className={`font-bold ${facility.emergencyAvailable ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {facility.emergencyAvailable ? 'ACTIVE' : 'FULL'}
                  </span>
                </div>
              </div>

              {/* Why this facility? Explainability Card */}
              <div className="bg-[#141416] p-3 rounded-2xl border border-[#22222a] space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-purple-300 font-bold text-[11px] uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Why this facility was recommended:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-neutral-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Specialist Care: <strong>{facility.specialists[0] || 'General Physician'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>ICU Beds Available: <strong>{facility.icuBeds.available} beds</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Emergency Services: <strong>{facility.emergencyAvailable ? 'Active ER' : 'Limited'}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Travel Time: <strong>{facility.travelTimeMins} mins ({facility.distanceKm} km)</strong></span>
                  </div>
                </div>
              </div>

              {/* Specialists Tags */}
              <div className="flex flex-wrap gap-1.5">
                {facility.specialists.map((spec, sIdx) => (
                  <span key={sIdx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Referral Trigger */}
            <button
              onClick={() => {
                setTargetFacility(facility);
                if (facility.specialists.length) setRequiredSpecialty(facility.specialists[0]);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4 text-white" />
              <span>Generate Smart Referral to This Hospital</span>
            </button>
          </div>
        ))}
      </div>
      )}

      {/* Referral Creation Modal */}
      {targetFacility && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-5 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                Create Smart Referral
              </h3>
              <button onClick={() => setTargetFacility(null)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReferralSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Destination Facility</label>
                <input
                  type="text"
                  disabled
                  value={targetFacility.name}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Age</label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Required Specialist</label>
                <select
                  value={requiredSpecialty}
                  onChange={(e) => setRequiredSpecialty(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {targetFacility.specialists.map((s, idx) => (
                    <option key={idx} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Clinical Referral Reason</label>
                <textarea
                  rows={3}
                  value={referralReason}
                  onChange={(e) => setReferralReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReferral}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4 text-white" />
                <span>{isSubmittingReferral ? 'Sending Referral...' : 'Confirm & Dispatch Referral'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
