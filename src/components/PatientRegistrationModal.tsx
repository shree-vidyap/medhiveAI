import React, { useState } from 'react';
import { Language, Patient } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { registerPatient } from '../services/api';
import { UserPlus, X } from 'lucide-react';

interface PatientRegistrationModalProps {
  currentLanguage: Language;
  onClose: () => void;
  onPatientRegistered: (patient: Patient) => void;
}

export const PatientRegistrationModal: React.FC<PatientRegistrationModalProps> = ({
  currentLanguage,
  onClose,
  onPatientRegistered,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<number>(35);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');
  const [phone, setPhone] = useState<string>('');
  const [village, setVillage] = useState<string>('Gejjalagere');
  const [district, setDistrict] = useState<string>('Mandya');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(currentLanguage);
  const [emergencyContact, setEmergencyContact] = useState<string>('');
  const [medicalHistoryText, setMedicalHistoryText] = useState<string>('');
  const [allergiesText, setAllergiesText] = useState<string>('');
  const [medicationsText, setMedicationsText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await registerPatient({
        name,
        age,
        gender,
        phone,
        village,
        district,
        preferredLanguage,
        emergencyContact,
        medicalHistory: medicalHistoryText ? medicalHistoryText.split(',').map((s) => s.trim()) : [],
        allergies: allergiesText ? allergiesText.split(',').map((s) => s.trim()) : [],
        currentMedications: medicationsText ? medicationsText.split(',').map((s) => s.trim()) : [],
      });

      onPatientRegistered(created);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="patient-registration-modal" className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0d0d0e] border border-[#22222a] rounded-3xl max-w-lg w-full p-6 space-y-5 text-white shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">{t.patientRegistration}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#1f1f25] rounded-xl text-neutral-400 transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 mb-1 font-semibold">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Gowda"
              className="w-full bg-[#141416] border border-[#22222a] focus:border-[#7c3aed] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 mb-1 font-semibold">{t.age} *</label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full bg-[#141416] border border-[#22222a] focus:border-[#7c3aed] rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1 font-semibold">{t.gender}</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-[#141416] border border-[#22222a] focus:border-[#7c3aed] rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 mb-1 font-semibold">{t.phone} *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91-98450-XXXXX"
                className="w-full bg-[#141416] border border-[#22222a] focus:border-[#7c3aed] rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1 font-semibold">{t.village} / Village</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full bg-[#141416] border border-[#22222a] focus:border-[#7c3aed] rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 mb-1 font-semibold">Emergency Contact Person & Phone</label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="e.g. Suresh Gowda (+91-98450-99887)"
              className="w-full bg-[#141416] border border-[#22222a] focus:border-[#7c3aed] rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-neutral-300 mb-1 font-semibold">Existing Medical History (comma separated)</label>
            <input
              type="text"
              value={medicalHistoryText}
              onChange={(e) => setMedicalHistoryText(e.target.value)}
              placeholder="e.g. Diabetes, Hypertension, Pregnancy 28 weeks"
              className="w-full bg-[#141416] border border-[#22222a] focus:border-[#7c3aed] rounded-xl px-3 py-2 text-xs text-white focus:outline-none transition"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#141416] hover:bg-[#1a1a20] text-neutral-300 font-semibold px-4 py-3 rounded-xl text-xs border border-[#22222a] transition cursor-pointer"
            >
              Cancel / Close
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering Patient...' : 'Complete Patient Registration'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
