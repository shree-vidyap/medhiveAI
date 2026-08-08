import React, { useState, useEffect } from 'react';
import { Facility, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { fetchFacilities, updateFacilityCapacity } from '../services/api';
import { Building2, Check, RefreshCw, Save, ShieldAlert } from 'lucide-react';

interface HospitalAdminViewProps {
  currentLanguage: Language;
}

export const HospitalAdminView: React.FC<HospitalAdminViewProps> = ({ currentLanguage }) => {
  const t = TRANSLATIONS[currentLanguage];

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    setLoading(true);
    try {
      const data = await fetchFacilities();
      setFacilities(data);
      if (data.length > 0) setSelectedFacility(data[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCapacity = async () => {
    if (!selectedFacility) return;

    setIsSaving(true);
    try {
      const updated = await updateFacilityCapacity(selectedFacility.id, selectedFacility);
      setFacilities((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
      setSuccessMessage('Hospital capacity updated! Smart Referral agent will instantly reflect new availability.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="hospital-admin-component" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t.hospitalAdmin} — Real-Time Capacity Control</h2>
            <p className="text-xs text-slate-400">Update Beds, ICU, Diagnostics & Emergency Readiness</p>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-950/80 border border-emerald-800 p-3.5 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {selectedFacility && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Select Facility to Update:</label>
              <select
                value={selectedFacility.id}
                onChange={(e) => {
                  const found = facilities.find((f) => f.id === e.target.value);
                  if (found) setSelectedFacility(found);
                }}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none"
              >
                {facilities.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.district})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSaveCapacity}
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Updating Capacity...' : 'Publish Live Availability'}</span>
            </button>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* General & ICU Beds */}
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Bed Availability</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Available General Beds</label>
                  <input
                    type="number"
                    value={selectedFacility.beds.available}
                    onChange={(e) =>
                      setSelectedFacility({
                        ...selectedFacility,
                        beds: { ...selectedFacility.beds, available: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Total General Beds</label>
                  <input
                    type="number"
                    value={selectedFacility.beds.total}
                    onChange={(e) =>
                      setSelectedFacility({
                        ...selectedFacility,
                        beds: { ...selectedFacility.beds, total: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Available ICU Beds</label>
                  <input
                    type="number"
                    value={selectedFacility.icuBeds.available}
                    onChange={(e) =>
                      setSelectedFacility({
                        ...selectedFacility,
                        icuBeds: { ...selectedFacility.icuBeds, available: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-amber-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Total ICU Beds</label>
                  <input
                    type="number"
                    value={selectedFacility.icuBeds.total}
                    onChange={(e) =>
                      setSelectedFacility({
                        ...selectedFacility,
                        icuBeds: { ...selectedFacility.icuBeds, total: Number(e.target.value) },
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-sm text-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Emergency & Diagnostics */}
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Emergency & Diagnostics Status</h4>

              <div className="space-y-3 text-xs text-slate-200">
                <label className="flex items-center justify-between p-2 bg-slate-800 rounded-lg cursor-pointer">
                  <span>Emergency ER Operational?</span>
                  <input
                    type="checkbox"
                    checked={selectedFacility.emergencyAvailable}
                    onChange={(e) =>
                      setSelectedFacility({
                        ...selectedFacility,
                        emergencyAvailable: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-emerald-500 rounded"
                  />
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center justify-between p-2 bg-slate-800 rounded-lg cursor-pointer">
                    <span>X-Ray</span>
                    <input
                      type="checkbox"
                      checked={selectedFacility.diagnostics.xray}
                      onChange={(e) =>
                        setSelectedFacility({
                          ...selectedFacility,
                          diagnostics: { ...selectedFacility.diagnostics, xray: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-emerald-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 bg-slate-800 rounded-lg cursor-pointer">
                    <span>CT Scan</span>
                    <input
                      type="checkbox"
                      checked={selectedFacility.diagnostics.ct}
                      onChange={(e) =>
                        setSelectedFacility({
                          ...selectedFacility,
                          diagnostics: { ...selectedFacility.diagnostics, ct: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-emerald-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 bg-slate-800 rounded-lg cursor-pointer">
                    <span>MRI</span>
                    <input
                      type="checkbox"
                      checked={selectedFacility.diagnostics.mri}
                      onChange={(e) =>
                        setSelectedFacility({
                          ...selectedFacility,
                          diagnostics: { ...selectedFacility.diagnostics, mri: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-emerald-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 bg-slate-800 rounded-lg cursor-pointer">
                    <span>Lab Tests</span>
                    <input
                      type="checkbox"
                      checked={selectedFacility.diagnostics.lab}
                      onChange={(e) =>
                        setSelectedFacility({
                          ...selectedFacility,
                          diagnostics: { ...selectedFacility.diagnostics, lab: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-emerald-500 rounded"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
