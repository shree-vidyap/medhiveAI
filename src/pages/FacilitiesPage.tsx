import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { GoogleMapWrapper } from '../components/GoogleMapWrapper';
import { getCurrentPosition, calculateHaversineDistance, estimateTravelTimeMinutes, DEFAULT_RURAL_LOCATION } from '../utils/location';
import { 
  Building2, 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldAlert, 
  Send, 
  Map, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  XCircle,
  BedDouble,
  Navigation
} from 'lucide-react';

export const FacilitiesPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { facilities } = useApp();
  const { t } = useTranslation();

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>(DEFAULT_RURAL_LOCATION);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'denied'>('loading');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [showMapModal, setShowMapModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    getCurrentPosition()
      .then((coords) => {
        setUserLocation(coords);
        setLocationStatus('success');
      })
      .catch((_err) => {
        setLocationStatus('denied');
      });
  }, []);

  // Compute facilities with dynamic distances
  const computedFacilities = facilities.map((fac) => {
    const distanceKm = calculateHaversineDistance(userLocation, { lat: fac.lat, lng: fac.lng });
    const travelTimeMins = estimateTravelTimeMinutes(distanceKm);
    return {
      ...fac,
      distanceKm,
      travelTimeMins,
    };
  });

  // If ID is provided in route, show Facility Detail View
  if (id) {
    const facility = computedFacilities.find((f) => f.id === id) || computedFacilities[0];

    const services = [
      { name: '24/7 Emergency Casualty', available: facility.emergencyAvailable },
      { name: 'ICU / Critical Care Units', available: facility.icuBeds.total > 0 },
      { name: 'Diagnostic X-Ray', available: facility.diagnostics.xray },
      { name: 'CT Scan Facility', available: facility.diagnostics.ct },
      { name: 'MRI Scanning Unit', available: facility.diagnostics.mri },
      { name: 'Clinical Laboratory Services', available: facility.diagnostics.lab },
      { name: 'Ultrasound Screening', available: facility.diagnostics.ultrasound },
    ];

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Detail Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <button
            onClick={() => navigate('/facilities')}
            className="p-2 bg-[#131C1E] hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">{facility.name}</h1>
              <span className="bento-tag bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded text-[10px]">
                {facility.type}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{facility.address}</span>
            </p>
          </div>
        </div>

        {/* Embedded Map */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Navigation className="w-4 h-4 text-teal-400" />
            <span>Map & Directions</span>
          </h3>
          <GoogleMapWrapper
            center={{ lat: facility.lat, lng: facility.lng }}
            zoom={13}
            height="260px"
            markers={[
              {
                id: facility.id,
                title: facility.name,
                lat: facility.lat,
                lng: facility.lng,
                description: facility.address,
                isEmergency: facility.emergencyAvailable,
              },
            ]}
          />
        </div>

        {/* Readiness & Stats Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bento-card p-5 space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase">{t('facilities.readiness', 'Readiness')}</p>
            <p className="text-2xl font-black text-emerald-400">92% Ready</p>
            <p className="text-[11px] text-slate-500 font-medium">Beds & Specialists active</p>
          </div>
          <div className="bento-card p-5 space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase">{t('facilities.distance', 'Distance')}</p>
            <p className="text-2xl font-black text-white">{facility.distanceKm} km</p>
            <p className="text-[11px] text-slate-500 font-medium">{facility.travelTimeMins} mins travel time</p>
          </div>
          <div className="bento-card p-5 space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase">Available Beds</p>
            <p className="text-2xl font-black text-teal-400">
              {facility.beds.available} <span className="text-sm font-semibold text-slate-500">/ {facility.beds.total}</span>
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              ICU: {facility.icuBeds.available} available
            </p>
          </div>
        </div>

        {/* Services List */}
        <div className="bento-card p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            {t('facilities.servicesTitle', 'Services & Availability')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((svc) => (
              <div
                key={svc.name}
                className="p-3 bg-[#0B0F0E] rounded-xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <span className="text-slate-300 font-medium">{svc.name}</span>
                {svc.available ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800 text-[10px]">
                    <CheckCircle2 className="w-3 h-3" />
                    Available
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-500 font-medium bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[10px]">
                    <XCircle className="w-3 h-3" />
                    Unavailable
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Specialists Checklist */}
        <div className="bento-card p-6 space-y-3">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            On-Duty Specialists & Departments
          </h2>
          <div className="flex flex-wrap gap-2">
            {facility.specialists.map((spec) => (
              <span
                key={spec}
                className="bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1 rounded-xl text-xs font-semibold"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Why Recommended Checklist */}
        <div className="bento-card p-6 space-y-3 border border-teal-500/30">
          <h2 className="text-sm font-bold text-teal-300 uppercase tracking-wider">
            {t('facilities.whyRecommended', 'Why Recommended For You')}
          </h2>
          <ul className="space-y-2 text-xs text-slate-300 font-medium">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>Full emergency casualty capability with dedicated triage desk.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>Direct referral acceptance protocol with PHCs and CHCs.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>Connected to Ayushman Bharat (PM-JAY) and Arogya Karnataka cashless schemes.</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => navigate(`/referrals/new?facilityId=${facility.id}`)}
            className="bg-teal-600 hover:bg-teal-500 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-teal-600/20 cursor-pointer"
          >
            <Send className="w-4 h-4 text-slate-950" />
            <span>{t('facilities.startReferral', 'Start Referral')}</span>
          </button>

          <button
            onClick={() => setShowContactModal(true)}
            className="bg-[#131C1E] hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-2 cursor-pointer transition"
          >
            <Phone className="w-4 h-4 text-teal-400" />
            <span>Contact Facility</span>
          </button>
        </div>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#131C1E] border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-white text-base">Contact Facility</h3>
                <button onClick={() => setShowContactModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-[#0B0F0E] rounded-xl border border-slate-800 space-y-1">
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Emergency Casualty Desk</p>
                  <p className="font-mono text-sm text-teal-300 font-bold">{facility.phone}</p>
                </div>
                <div className="p-3 bg-[#0B0F0E] rounded-xl border border-slate-800 space-y-1">
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Address</p>
                  <p className="font-medium text-slate-200">{facility.address}</p>
                </div>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2.5 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Facility Directory List View (`/facilities`)
  const filteredFacilities = computedFacilities.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.specialists.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedTypeFilter === 'ALL') return matchesSearch;
    if (selectedTypeFilter === 'EMERGENCY') return matchesSearch && f.emergencyAvailable;
    return matchesSearch && f.type === selectedTypeFilter;
  });

  const markers = filteredFacilities.map((f) => ({
    id: f.id,
    title: f.name,
    lat: f.lat,
    lng: f.lng,
    description: `${f.distanceKm} km away • ${f.beds.available} beds free`,
    isEmergency: f.emergencyAvailable,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Building2 className="w-6 h-6 text-teal-400" />
          {t('facilities.title', 'Nearby Healthcare Facilities')}
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          {t('facilities.subtitle', 'Real-time facility readiness, bed availability, and specialist status')}
        </p>
      </div>

      {/* Map Overview Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold uppercase tracking-wider text-slate-300">
            Interactive Map
          </span>
          {locationStatus === 'denied' && (
            <span className="text-amber-400 text-[11px]">
              {t('facilities.locationDenied', 'Location permission unavailable — showing sample list')}
            </span>
          )}
        </div>
        <GoogleMapWrapper
          center={userLocation}
          zoom={11}
          height="300px"
          markers={markers}
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="bento-card p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('facilities.searchPlaceholder', 'Search by facility name, village, or district...')}
            className="w-full bg-[#0B0F0E] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/80 transition"
          />
        </div>

        {/* Type Filter Tabs */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: 'ALL', label: t('facilities.filterAll', 'All Facilities') },
            { id: 'EMERGENCY', label: '🚨 24/7 Emergency' },
            { id: 'Medical College', label: 'Medical College' },
            { id: 'District Hospital', label: 'District Hospital' },
            { id: 'CHC', label: 'CHC' },
            { id: 'PHC', label: 'PHC' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTypeFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer border ${
                selectedTypeFilter === tab.id
                  ? 'bg-teal-600/20 text-teal-300 border-teal-500/50'
                  : 'bg-[#0B0F0E] text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFacilities.map((fac) => (
          <div
            key={fac.id}
            className="bento-card p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/40 transition"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-sm text-white">{fac.name}</h3>
                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{fac.address}</span>
                  </p>
                </div>
                <span className="bento-tag bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[9px] shrink-0">
                  {fac.type}
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                {fac.emergencyAvailable && (
                  <span className="bg-rose-950/80 text-rose-300 border border-rose-800 px-2 py-0.5 rounded flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-rose-400" />
                    {t('facilities.emergencyBadge', '24/7 Emergency')}
                  </span>
                )}
                <span className="bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1">
                  <BedDouble className="w-3 h-3 text-teal-400" />
                  {fac.beds.available} Beds Free
                </span>
                <span className="bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {fac.distanceKm} km ({fac.travelTimeMins} mins)
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {fac.phone}
              </span>
              <button
                onClick={() => navigate(`/facilities/${fac.id}`)}
                className="text-xs font-bold text-teal-400 hover:text-teal-300 transition cursor-pointer"
              >
                {t('facilities.viewFacility', 'View Facility')} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
