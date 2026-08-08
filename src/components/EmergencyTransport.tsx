import React, { useState, useEffect } from 'react';
import { Language, TransportRequest } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { fetchTransports, requestTransport } from '../services/api';
import { 
  AlertOctagon, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PhoneCall, 
  RefreshCw, 
  ShieldAlert, 
  ShieldCheck, 
  Truck, 
  X 
} from 'lucide-react';

interface EmergencyTransportProps {
  currentLanguage: Language;
  onReturnHome?: () => void;
  onViewFacilities?: () => void;
}

export const EmergencyTransport: React.FC<EmergencyTransportProps> = ({ 
  currentLanguage,
  onReturnHome,
  onViewFacilities,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  const [transports, setTransports] = useState<TransportRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [patientName, setPatientName] = useState<string>('Basavaraju M');
  const [pickupLocation, setPickupLocation] = useState<string>('Srirangapatna PHC, Fort Area');
  const [destination, setDestination] = useState<string>('Mandya Institute of Medical Sciences (MIMS)');
  const [vehicleType, setVehicleType] = useState<'108 Emergency' | 'Ambulance - ICU' | 'PHC Transport'>('108 Emergency');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showDispatchModal, setShowDispatchModal] = useState<boolean>(false);
  const [selectedTransportForCancel, setSelectedTransportForCancel] = useState<string | null>(null);

  useEffect(() => {
    loadTransports();
  }, []);

  const loadTransports = async () => {
    setLoading(true);
    try {
      const data = await fetchTransports();
      setTransports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newTransport = await requestTransport({
        patientName,
        pickupLocation,
        destinationFacility: destination,
        vehicleType,
      });
      setTransports((prev) => [newTransport, ...prev]);
      setShowDispatchModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelRequest = (id: string) => {
    setTransports((prev) => prev.filter((t) => t.id !== id));
    setSelectedTransportForCancel(null);
  };

  return (
    <div id="emergency-center-wrapper" className="space-y-6">
      {/* Top Dedicated Emergency Center Banner */}
      <div className="bg-rose-600 rounded-3xl p-6 text-white shadow-xl shadow-rose-600/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl shrink-0 border border-white/20">
            <ShieldAlert className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white text-rose-700 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                Emergency Priority
              </span>
              <span className="text-rose-100 text-xs font-semibold">Mandya 108 Command Center</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">MediHivi Emergency Center</h2>
            <p className="text-xs text-rose-100 mt-1 max-w-xl">
              Are you or someone near you in immediate medical danger? Access priority 108 dispatch, ICU transport, and emergency hospital acceptance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto shrink-0">
          <button
            onClick={() => setShowDispatchModal(true)}
            className="flex-1 md:flex-initial bg-white hover:bg-rose-50 text-rose-700 font-extrabold text-xs px-5 py-3 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4 text-rose-600" />
            <span>Request 108 Ambulance</span>
          </button>
          
          {onReturnHome && (
            <button
              onClick={onReturnHome}
              className="bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs px-4 py-3 rounded-2xl border border-rose-500 transition cursor-pointer"
            >
              I'm Safe — Return
            </button>
          )}
        </div>
      </div>

      {/* Emergency Actions Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setShowDispatchModal(true)}
          className="bg-white hover:border-rose-300 border border-slate-200 p-4 rounded-2xl shadow-sm text-left group transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold mb-2">
            <Truck className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">Request Transport</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">108 / ICU Ambulance</p>
        </button>

        <button
          onClick={() => onViewFacilities && onViewFacilities()}
          className="bg-white hover:border-teal-300 border border-slate-200 p-4 rounded-2xl shadow-sm text-left group transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center font-bold mb-2">
            <MapPin className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-600 transition">Nearest ICU Facility</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">MIMS Mandya / District</p>
        </button>

        <a
          href="tel:108"
          className="bg-white hover:border-emerald-300 border border-slate-200 p-4 rounded-2xl shadow-sm text-left group transition cursor-pointer block"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold mb-2">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition">Call 108 Emergency</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">Toll-Free Hotline</p>
        </a>

        <button
          onClick={loadTransports}
          className="bg-white hover:border-purple-300 border border-slate-200 p-4 rounded-2xl shadow-sm text-left group transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center font-bold mb-2">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </div>
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition">Sync Status</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">Live Tracking</p>
        </button>
      </div>

      {/* Active Transport Dispatches Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-rose-600" />
            Active Emergency Transport Dispatches ({transports.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">Updates live every 10s</span>
        </div>

        {transports.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-700">No active emergency transport requests</p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Need immediate transport? Click "Request 108 Ambulance" above to dispatch a vehicle.
            </p>
          </div>
        ) : (
          transports.map((trp) => (
            <div key={trp.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 hover:border-rose-200 transition">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 font-bold flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md">
                        {trp.vehicleType}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">ID: {trp.id}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-1">Vehicle: {trp.vehicleNumber}</h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                    <span>ETA: ~{trp.etaMins} mins</span>
                  </span>

                  <button
                    onClick={() => setSelectedTransportForCancel(trp.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Cancel Transport Request"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Steps Indicator */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Transport Progress</div>
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                  <div className="bg-emerald-50 text-emerald-700 font-bold p-2 rounded-xl border border-emerald-200">
                    ✓ Received
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 font-bold p-2 rounded-xl border border-emerald-200">
                    ✓ Assigned
                  </div>
                  <div className="bg-teal-600 text-white font-bold p-2 rounded-xl shadow-sm animate-pulse">
                    ● En Route
                  </div>
                  <div className="bg-slate-100 text-slate-400 font-medium p-2 rounded-xl">
                    ○ Arrived
                  </div>
                  <div className="bg-slate-100 text-slate-400 font-medium p-2 rounded-xl">
                    ○ Completed
                  </div>
                </div>
              </div>

              {/* Detail Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Patient Name:</span>
                  <span className="font-bold text-slate-900">{trp.patientName}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Pickup Location:</span>
                  <span className="font-bold text-slate-900">{trp.pickupLocation}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Destination Hospital:</span>
                  <span className="font-bold text-teal-700">{trp.destinationFacility}</span>
                </div>
              </div>

              {/* Footer Driver Contact */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-teal-50/70 border border-teal-200/80 p-3.5 rounded-xl text-xs text-teal-900 font-medium">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-teal-600" />
                  <span>Emergency Ambulance Driver: <strong className="text-teal-950 font-bold">{trp.driverPhone}</strong></span>
                </div>

                <a
                  href={`tel:${trp.driverPhone}`}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center justify-center gap-1 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Driver Now</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dispatch Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Dispatch 108 Emergency Transport</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Mandya District Emergency Command</p>
                </div>
              </div>
              <button
                onClick={() => setShowDispatchModal(false)}
                className="p-1 hover:bg-slate-100 text-slate-400 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Type</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500 cursor-pointer"
                >
                  <option value="108 Emergency">108 Standard Emergency Ambulance</option>
                  <option value="Ambulance - ICU">Advanced Life Support (ICU Ventilator Ambulance)</option>
                  <option value="PHC Transport">PHC Patient Transport Van</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Village / PHC Address</label>
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Destination Referral Hospital</label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Truck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Confirming Dispatch...' : 'Confirm Emergency Dispatch'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {selectedTransportForCancel && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Cancel Emergency Transport Request?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to cancel this emergency dispatch? If the patient is safe or transport is no longer needed, confirm below.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedTransportForCancel(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Keep Request Active
              </button>
              <button
                onClick={() => handleCancelRequest(selectedTransportForCancel)}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
