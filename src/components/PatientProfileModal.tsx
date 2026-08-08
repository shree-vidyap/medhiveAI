import React, { useState } from 'react';
import { UserProfile } from '../utils/auth';
import { Heart, Save, Shield, User, X } from 'lucide-react';

interface PatientProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: UserProfile) => void;
  isOnboardingMode?: boolean;
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
  isOnboardingMode = false,
}) => {
  const [bloodGroup, setBloodGroup] = useState(user.bloodGroup || 'O+');
  const [allergiesText, setAllergiesText] = useState((user.allergies || []).join(', '));
  const [chronicText, setChronicText] = useState((user.chronicConditions || []).join(', '));
  const [medicationsText, setMedicationsText] = useState((user.currentMedications || []).join(', '));
  const [emergencyName, setEmergencyName] = useState(user.emergencyContactName || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user.emergencyContactPhone || '');
  const [address, setAddress] = useState(user.address || '');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      bloodGroup,
      allergies: allergiesText ? allergiesText.split(',').map((s) => s.trim()).filter(Boolean) : [],
      chronicConditions: chronicText ? chronicText.split(',').map((s) => s.trim()).filter(Boolean) : [],
      currentMedications: medicationsText ? medicationsText.split(',').map((s) => s.trim()).filter(Boolean) : [],
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone,
      address,
      onboardingCompleted: true,
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-scale-up text-slate-800">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 bg-teal-50 border border-teal-200 text-teal-600 rounded-2xl flex items-center justify-center font-bold shadow-xs">
            <Heart className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {isOnboardingMode ? 'Complete Patient Health Profile' : 'Edit Health Profile & Emergency Info'}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isOnboardingMode
                ? 'Provide key health details to assist doctors and triage AI during emergencies'
                : `Profile details for ${user.name}`}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none transition"
              >
                {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary District / Village</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Tubinakere, Mandya Taluk"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-teal-500 focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Known Allergies (comma separated)</label>
            <input
              type="text"
              value={allergiesText}
              onChange={(e) => setAllergiesText(e.target.value)}
              placeholder="e.g. Penicillin, Sulfa, Peanuts"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-teal-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Chronic Conditions (comma separated)</label>
            <input
              type="text"
              value={chronicText}
              onChange={(e) => setChronicText(e.target.value)}
              placeholder="e.g. Diabetes, Hypertension, Asthma"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-teal-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Medications</label>
            <input
              type="text"
              value={medicationsText}
              onChange={(e) => setMedicationsText(e.target.value)}
              placeholder="e.g. Amlodipine 5mg, Metformin 500mg"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-teal-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          {/* Emergency Contact */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4 text-rose-600" />
              <span>Emergency Contact Details</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Contact Name & Relation</label>
                <input
                  type="text"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="e.g. Shivanna M (Son)"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-teal-500 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Contact Phone Number</label>
                <input
                  type="text"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="e.g. +91 98450 12345"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-teal-500 focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            {isOnboardingMode && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-slate-500 hover:text-slate-800 text-xs font-bold transition cursor-pointer"
              >
                Skip for Now
              </button>
            )}
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs shadow-md shadow-teal-600/20 flex items-center gap-2 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Health Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
