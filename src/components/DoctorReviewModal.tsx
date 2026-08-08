import React, { useState } from 'react';
import { CarePlan, DoctorReview, PatientCase, TriageLevel } from '../types';
import { 
  Activity, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileCheck2, 
  HeartHandshake, 
  ShieldCheck, 
  Stethoscope, 
  UserCheck, 
  X 
} from 'lucide-react';

interface DoctorReviewModalProps {
  patientCase: PatientCase;
  onSaveReview: (review: DoctorReview, carePlan: CarePlan) => void;
  onClose: () => void;
}

export const DoctorReviewModal: React.FC<DoctorReviewModalProps> = ({
  patientCase,
  onSaveReview,
  onClose,
}) => {
  const [doctorName, setDoctorName] = useState<string>('Dr. Kumar (PHC Medical Officer)');
  const [confirmedTriage, setConfirmedTriage] = useState<TriageLevel>(
    patientCase.triageResult?.level || 'YELLOW'
  );
  const [specialist, setSpecialist] = useState<string>(
    patientCase.triageResult?.recommendedSpecialist || 'General Medicine'
  );
  const [clinicalNotes, setClinicalNotes] = useState<string>(
    patientCase.doctorReview?.clinicalNotes ||
      `Patient presenting with ${patientCase.symptomsText || 'reported symptoms'}. AI decision support evaluated level as ${patientCase.triageResult?.level || 'YELLOW'}. Vitals monitored. Vital signs stable.`
  );

  // Care Plan state
  const [careInstructions, setCareInstructions] = useState<string>(
    patientCase.carePlan?.instructions.join('\n') ||
      '1. Continue prescribed medications as directed.\n2. Monitor oxygen saturation and blood pressure twice daily.\n3. Adequate hydration and bed rest.\n4. Proceed to recommended healthcare facility if symptoms worsen.'
  );
  const [diagnosticTests, setDiagnosticTests] = useState<string>(
    patientCase.carePlan?.diagnosticTests.join(', ') || '12-Lead ECG, Complete Blood Count (CBC), Blood Sugar'
  );
  const [followUpDays, setFollowUpDays] = useState<number>(3);
  const [referralNeeded, setReferralNeeded] = useState<boolean>(
    patientCase.triageResult?.level === 'RED' || patientCase.triageResult?.level === 'ORANGE'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const review: DoctorReview = {
      reviewedBy: doctorName,
      confirmedTriageLevel: confirmedTriage,
      clinicalNotes,
      recommendedSpecialist: specialist,
      diagnosticOrders: diagnosticTests.split(',').map((s) => s.trim()).filter(Boolean),
      reviewedAt: new Date().toISOString(),
    };

    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + followUpDays);

    const carePlan: CarePlan = {
      summary: `Clinical Care Plan for ${patientCase.patientName}`,
      instructions: careInstructions.split('\n').map((s) => s.trim()).filter(Boolean),
      diagnosticTests: diagnosticTests.split(',').map((s) => s.trim()).filter(Boolean),
      followUpDate: followUpDate.toISOString().split('T')[0],
      referralRecommended: referralNeeded,
      createdAt: new Date().toISOString(),
    };

    onSaveReview(review, carePlan);
  };

  return (
    <div id="doctor-review-modal" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0d0d0e] border border-[#22222a] rounded-3xl max-w-3xl w-full p-6 space-y-6 text-white shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1f1f23] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#7c3aed]/20 text-purple-300 border border-[#7c3aed]/30">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bento-tag px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
                  Professional Medical Review
                </span>
                <span className="text-xs text-neutral-400 font-mono">Case: {patientCase.id}</span>
              </div>
              <h2 className="text-lg font-extrabold text-white tracking-tight mt-0.5">
                Healthcare Professional Assessment & Care Plan
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#1f1f25] rounded-xl text-neutral-400 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Case Summary Box */}
        <div className="bg-[#141416] p-4 rounded-2xl border border-[#22222a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="bento-tag text-purple-300 text-[10px] flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> AI Decision Support Summary
            </span>
            <span className="text-xs font-semibold text-neutral-400">
              Patient: <strong className="text-white">{patientCase.patientName}</strong> ({patientCase.age} yrs / {patientCase.gender})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#0a0a0c] p-3 rounded-xl border border-[#1f1f23]">
              <span className="text-neutral-500 text-[10px] block uppercase font-mono">Reported Symptoms</span>
              <p className="text-neutral-200 font-medium mt-1">{patientCase.symptomsText || 'No text reported'}</p>
            </div>

            <div className="bg-[#0a0a0c] p-3 rounded-xl border border-[#1f1f23]">
              <span className="text-neutral-500 text-[10px] block uppercase font-mono">AI Triage Classification</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`font-bold px-2.5 py-0.5 rounded text-xs ${
                  patientCase.triageResult?.level === 'RED' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                  patientCase.triageResult?.level === 'ORANGE' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' :
                  patientCase.triageResult?.level === 'YELLOW' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {patientCase.triageResult?.level || 'YELLOW'}
                </span>
                <span className="text-neutral-300 font-medium">{patientCase.triageResult?.title}</span>
              </div>
            </div>
          </div>

          {patientCase.reportExtraction && (
            <div className="bg-[#0a0a0c] p-3 rounded-xl border border-[#1f1f23] text-xs">
              <span className="text-blue-400 font-semibold text-[10px] uppercase block">Scanned Medical Report Findings</span>
              <p className="text-neutral-300 mt-0.5">{patientCase.reportExtraction.summary}</p>
            </div>
          )}
        </div>

        {/* Doctor Review Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block bento-tag text-neutral-400 mb-1">Doctor / Medical Officer</label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full bg-[#141416] border border-[#22222a] rounded-xl px-3 py-2 text-xs text-white focus:border-[#7c3aed] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block bento-tag text-neutral-400 mb-1">Confirmed Urgency Rating</label>
              <select
                value={confirmedTriage}
                onChange={(e) => setConfirmedTriage(e.target.value as TriageLevel)}
                className="w-full bg-[#141416] border border-[#22222a] rounded-xl px-3 py-2 text-xs text-white focus:border-[#7c3aed] focus:outline-none cursor-pointer"
              >
                <option value="RED">RED — Emergency</option>
                <option value="ORANGE">ORANGE — Urgent</option>
                <option value="YELLOW">YELLOW — Priority</option>
                <option value="GREEN">GREEN — Routine</option>
              </select>
            </div>

            <div>
              <label className="block bento-tag text-neutral-400 mb-1">Recommended Specialist</label>
              <select
                value={specialist}
                onChange={(e) => setSpecialist(e.target.value)}
                className="w-full bg-[#141416] border border-[#22222a] rounded-xl px-3 py-2 text-xs text-white focus:border-[#7c3aed] focus:outline-none cursor-pointer"
              >
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="OB-GYN">Obstetrics & Gynecology (OB-GYN)</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Pulmonology">Pulmonology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Neurology">Neurology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="ENT">ENT Specialist</option>
                <option value="Ophthalmology">Ophthalmology</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block bento-tag text-neutral-400 mb-1">Doctor Clinical Assessment Notes</label>
            <textarea
              rows={2}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full bg-[#141416] border border-[#22222a] rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:border-[#7c3aed] focus:outline-none"
              placeholder="Clinical evaluation observations..."
            />
          </div>

          {/* Care Plan Section */}
          <div className="bg-[#141416] p-4 rounded-2xl border border-[#22222a] space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <HeartHandshake className="w-4 h-4" />
              <span>Healthcare Professional Care Plan Formulation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block bento-tag text-neutral-400 mb-1">Care & Monitoring Instructions (1 per line)</label>
                <textarea
                  rows={4}
                  value={careInstructions}
                  onChange={(e) => setCareInstructions(e.target.value)}
                  className="w-full bg-[#0a0a0c] border border-[#1f1f23] rounded-xl p-3 text-xs text-white focus:border-[#7c3aed] focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block bento-tag text-neutral-400 mb-1">Diagnostic Tests / Lab Orders</label>
                  <input
                    type="text"
                    value={diagnosticTests}
                    onChange={(e) => setDiagnosticTests(e.target.value)}
                    placeholder="e.g. 12-Lead ECG, Blood Sugar, CBC"
                    className="w-full bg-[#0a0a0c] border border-[#1f1f23] rounded-xl px-3 py-2 text-xs text-white focus:border-[#7c3aed] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block bento-tag text-neutral-400 mb-1">Follow-Up Review Schedule</label>
                  <div className="flex items-center gap-2">
                    <select
                      value={followUpDays}
                      onChange={(e) => setFollowUpDays(Number(e.target.value))}
                      className="bg-[#0a0a0c] border border-[#1f1f23] rounded-xl px-3 py-2 text-xs text-white focus:border-[#7c3aed] focus:outline-none cursor-pointer"
                    >
                      <option value={1}>1 Day (Tomorrow)</option>
                      <option value={3}>3 Days</option>
                      <option value={7}>1 Week</option>
                      <option value={14}>2 Weeks</option>
                      <option value={30}>1 Month</option>
                    </select>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-300" />
                      Follow-up date calculated
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="referralCheck"
                    checked={referralNeeded}
                    onChange={(e) => setReferralNeeded(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                  />
                  <label htmlFor="referralCheck" className="text-xs font-semibold text-neutral-200 cursor-pointer">
                    Recommend Hospital Referral to Higher Center
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-[#141416] hover:bg-[#1a1a20] text-neutral-300 font-semibold px-4 py-3 rounded-2xl text-xs border border-[#22222a] transition cursor-pointer"
            >
              Cancel / Close
            </button>

            <button
              type="submit"
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-lg shadow-purple-900/50 flex items-center gap-2 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-purple-200" />
              <span>Save Care Plan & Proceed to Hospital Referral</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
