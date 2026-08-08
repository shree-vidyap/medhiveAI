import React, { useState } from 'react';
import { Language, Patient } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { registerPatient } from '../services/api';
import { 
  CheckCircle2, 
  CreditCard, 
  Download, 
  Heart, 
  Phone, 
  Printer, 
  QrCode, 
  ShieldCheck, 
  Sparkles, 
  User, 
  UserCheck, 
  UserPlus 
} from 'lucide-react';

interface PatientRegistrationViewProps {
  currentLanguage: Language;
  onPatientRegistered?: (patient: Patient) => void;
  onStartSymptomCheck?: () => void;
}

export const PatientRegistrationView: React.FC<PatientRegistrationViewProps> = ({
  currentLanguage,
  onPatientRegistered,
  onStartSymptomCheck,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  // Default registered patient state or new registration state
  const [registeredPatient, setRegisteredPatient] = useState<Patient | null>({
    id: 'PAT-901',
    name: 'Basavaraju M',
    age: 64,
    gender: 'male',
    phone: '+91-98450-77123',
    village: 'Gejjalagere',
    district: 'Mandya',
    preferredLanguage: currentLanguage,
    emergencyContact: 'Suresh Gowda (Son) +91-98450-99887',
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    allergies: ['Penicillin'],
    currentMedications: ['Amlodipine 5mg', 'Metformin 500mg'],
    createdAt: new Date().toISOString(),
  });

  const [showForm, setShowForm] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<number>(35);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');
  const [phone, setPhone] = useState<string>('');
  const [village, setVillage] = useState<string>('Srirangapatna');
  const [district, setDistrict] = useState<string>('Mandya');
  const [emergencyContact, setEmergencyContact] = useState<string>('');
  const [medicalHistoryText, setMedicalHistoryText] = useState<string>('');
  const [allergiesText, setAllergiesText] = useState<string>('');
  const [medicationsText, setMedicationsText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
        preferredLanguage: currentLanguage,
        emergencyContact,
        medicalHistory: medicalHistoryText ? medicalHistoryText.split(',').map((s) => s.trim()) : [],
        allergies: allergiesText ? allergiesText.split(',').map((s) => s.trim()) : [],
        currentMedications: medicationsText ? medicationsText.split(',').map((s) => s.trim()) : [],
      });

      setRegisteredPatient(created);
      if (onPatientRegistered) onPatientRegistered(created);

      setSuccessMessage('Patient registration successful! Digital Health ID card generated below.');
      setShowForm(false);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div id="patient-registration-view" className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center font-bold">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Patient Portal & Health Registration</h2>
              <span className="bg-teal-100 border border-teal-200 text-teal-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                Patient Self-Service
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Register yourself or a family member to generate an instant Digital Health ID Card and access AI Triage services.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-teal-600/20 transition cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Patient</span>
            </button>
          )}
          {showForm && (
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-200 transition cursor-pointer"
            >
              View Registered Profile
            </button>
          )}
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs flex items-center gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      {/* REGISTRATION FORM SECTION */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md space-y-5 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-600" />
              Fill Patient Registration Details
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">* Required Fields</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Basavaraju M / Shanthamma K"
                className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Age (Years) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none transition"
                >
                  <option value="female" className="bg-white">Female</option>
                  <option value="male" className="bg-white">Male</option>
                  <option value="other" className="bg-white">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Mobile Phone Number *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91-98450-XXXXX"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Emergency Contact & Relation</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="e.g. Ramesh Gowda (Son) +91-98450-88112"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Village / Town</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">Medical History (comma separated)</label>
              <input
                type="text"
                value={medicalHistoryText}
                onChange={(e) => setMedicalHistoryText(e.target.value)}
                placeholder="e.g. Hypertension, Diabetes, Asthma"
                className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 mb-1 font-bold">Known Drug Allergies</label>
                <input
                  type="text"
                  value={allergiesText}
                  onChange={(e) => setAllergiesText(e.target.value)}
                  placeholder="e.g. Penicillin, Sulfa drugs"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Current Medications</label>
                <input
                  type="text"
                  value={medicationsText}
                  onChange={(e) => setMedicationsText(e.target.value)}
                  placeholder="e.g. Metformin 500mg, Amlodipine 5mg"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 font-medium focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-3 rounded-xl border border-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-md shadow-teal-600/20 transition cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isSubmitting ? 'Registering Patient...' : 'Complete Patient Registration'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REGISTERED PATIENT DIGITAL HEALTH CARD VIEW */}
      {registeredPatient && !showForm && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* DIGITAL HEALTH CARD (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border border-teal-700/50 rounded-3xl p-6 shadow-xl relative overflow-hidden print:bg-white print:text-black text-white">
              {/* Background watermark badge */}
              <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                <CreditCard className="w-64 h-64 text-teal-300" />
              </div>

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-teal-800/40 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500 text-white flex items-center justify-center font-black text-lg shadow-sm">
                    MH
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-tight">MediHivi Digital Health ID</h3>
                    <p className="text-[11px] text-teal-200 font-medium">National Health Authority • Universal Patient Record</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-teal-200 bg-teal-900/60 border border-teal-700/60 px-2.5 py-1 rounded-lg">
                    ABHA / ID: {registeredPatient.id}
                  </span>
                </div>
              </div>

              {/* Card Content Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Patient Information */}
                <div className="sm:col-span-2 space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-300 block">Patient Name</span>
                    <span className="text-lg font-black text-white">{registeredPatient.name}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-slate-200">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-teal-300/80 block">Age / Gender</span>
                      <span className="font-bold text-white capitalize">{registeredPatient.age} Yrs / {registeredPatient.gender}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-teal-300/80 block">Mobile Contact</span>
                      <span className="font-bold text-white">{registeredPatient.phone}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-teal-300/80 block">Village & District</span>
                      <span className="font-bold text-white">{registeredPatient.village}, {registeredPatient.district}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-teal-300/80 block">Emergency Hotline</span>
                      <span className="font-bold text-rose-300">{registeredPatient.emergencyContact || '+91-108 Ambulance'}</span>
                    </div>
                  </div>

                  {/* Medical Badges */}
                  <div className="pt-2 space-y-1.5">
                    {registeredPatient.medicalHistory && registeredPatient.medicalHistory.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-teal-300/80 mr-1">Conditions:</span>
                        {registeredPatient.medicalHistory.map((cond, idx) => (
                          <span key={idx} className="bg-amber-500/20 border border-amber-400/40 text-amber-200 text-[10px] px-2 py-0.5 rounded-md font-bold">
                            {cond}
                          </span>
                        ))}
                      </div>
                    )}

                    {registeredPatient.allergies && registeredPatient.allergies.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-teal-300/80 mr-1">Allergies:</span>
                        {registeredPatient.allergies.map((all, idx) => (
                          <span key={idx} className="bg-rose-500/20 border border-rose-400/40 text-rose-200 text-[10px] px-2 py-0.5 rounded-md font-bold">
                            {all}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="flex flex-col items-center justify-center bg-slate-950/80 border border-teal-900/60 rounded-2xl p-4 text-center space-y-2">
                  <div className="p-2 bg-white rounded-xl shadow-md">
                    <QrCode className="w-20 h-20 text-slate-900" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-teal-200">Scan at PHC / ER Desk</span>
                  <span className="text-[9px] text-slate-400 font-medium">Verified MediHivi Card</span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t border-teal-800/40 flex items-center justify-between text-xs print:hidden">
                <span className="text-slate-300 text-[11px] flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Patient Profile • Mandya PHC District</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrintCard}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold px-3.5 py-2 rounded-xl border border-white/20 flex items-center gap-1.5 text-xs transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-teal-300" />
                    <span>Print Health Card</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: QUICK PATIENT ACTIONS */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Patient Self-Service Actions
              </h3>

              <div className="space-y-2.5 text-xs">
                {onStartSymptomCheck && (
                  <button
                    type="button"
                    onClick={onStartSymptomCheck}
                    className="w-full bg-slate-50 hover:bg-teal-50/50 border border-slate-200 hover:border-teal-300 p-3.5 rounded-2xl text-left transition flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <strong className="text-slate-900 block group-hover:text-teal-700 transition font-bold">Check Symptoms Now</strong>
                      <span className="text-slate-500 text-[11px] font-medium">Multi-lingual AI triage screening</span>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  </button>
                )}

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-left space-y-1">
                  <strong className="text-slate-900 block font-bold">Emergency Helpline</strong>
                  <p className="text-slate-500 text-[11px] font-medium">Free 24/7 Karnataka Ambulance Service</p>
                  <a
                    href="tel:108"
                    className="mt-2 inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call 108 Ambulance</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
