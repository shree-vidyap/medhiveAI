import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Save, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Heart, 
  AlertTriangle 
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useApp();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: user.name,
    dob: user.dob,
    gender: user.gender,
    bloodGroup: user.bloodGroup,
    phone: user.phone,
    emergencyContact: user.emergencyContact,
    address: user.address,
    allergiesStr: user.allergies.join(', '),
    conditionsStr: user.chronicConditions.join(', '),
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: formData.name,
      dob: formData.dob,
      gender: formData.gender as any,
      bloodGroup: formData.bloodGroup,
      phone: formData.phone,
      emergencyContact: formData.emergencyContact,
      address: formData.address,
      allergies: formData.allergiesStr.split(',').map((s) => s.trim()).filter(Boolean),
      chronicConditions: formData.conditionsStr.split(',').map((s) => s.trim()).filter(Boolean),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 space-y-1">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <User className="w-6 h-6 text-teal-400" />
          {t('profile.title', 'Patient Medical Profile')}
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          {t('profile.subtitle', 'Manage personal details, blood group, emergency contact, and chronic medical history')}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/80 rounded-xl text-xs text-emerald-200 font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Patient profile updated successfully and synced locally!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bento-card p-6 sm:p-8 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full bg-[#0B0F0E] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500/80 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase">Date of Birth</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              required
              className="w-full bg-[#0B0F0E] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500/80 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              className="w-full bg-[#0B0F0E] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500/80 transition"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase">Blood Group</label>
            <input
              type="text"
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              placeholder="e.g. O+, A+, B-"
              className="w-full bg-[#0B0F0E] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500/80 transition"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="w-full bg-[#0B0F0E] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500/80 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-rose-400 uppercase">Emergency Contact</label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              required
              className="w-full bg-[#0B0F0E] border border-rose-900/50 rounded-xl p-3 text-xs text-rose-200 focus:outline-none focus:border-rose-500 transition"
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-400 uppercase">Residential Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full bg-[#0B0F0E] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500/80 transition"
          />
        </div>

        {/* Medical History */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-amber-400 uppercase">Known Allergies (Comma separated)</label>
            <input
              type="text"
              value={formData.allergiesStr}
              onChange={(e) => setFormData({ ...formData, allergiesStr: e.target.value })}
              placeholder="e.g. Penicillin, Sulfa drugs"
              className="w-full bg-[#0B0F0E] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500/80 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-teal-400 uppercase">Chronic Medical Conditions</label>
            <input
              type="text"
              value={formData.conditionsStr}
              onChange={(e) => setFormData({ ...formData, conditionsStr: e.target.value })}
              placeholder="e.g. Hypertension, Diabetes"
              className="w-full bg-[#0B0F0E] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-teal-500/80 transition"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-500 text-slate-950 font-extrabold text-xs py-3.5 rounded-xl shadow-lg shadow-teal-600/20 transition cursor-pointer flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4 text-slate-950" />
          <span>{t('profile.save', 'Save Changes')}</span>
        </button>
      </form>
    </div>
  );
};
