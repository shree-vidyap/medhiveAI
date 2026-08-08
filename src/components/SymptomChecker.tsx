import React, { useState } from 'react';
import { Language, PatientVitals, TriageResult } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { TriageBadge } from './TriageBadge';
import { PatientWorkflowTracker, WorkflowStep } from './PatientWorkflowTracker';
import { predictTriage } from '../services/api';
import { 
  Activity, 
  AlertOctagon, 
  ArrowRight, 
  CheckCircle, 
  ChevronRight, 
  FileText, 
  FlaskConical, 
  Heart, 
  HeartHandshake, 
  Hospital, 
  Mic, 
  MicOff, 
  ShieldAlert, 
  Sparkles, 
  Stethoscope, 
  Thermometer, 
  Truck, 
  User, 
  UserCheck 
} from 'lucide-react';

interface SymptomCheckerProps {
  currentLanguage: Language;
  onTriageComplete: (result: { triage: TriageResult; referral?: any }) => void;
  onRequestEmergencyTransport: (referralId?: string) => void;
  onOpenPdfReport: (triage: TriageResult) => void;
  onRequestDoctorReview?: () => void;
  onNavigateToFacilityFinder?: () => void;
  onNavigateToStep?: (step: WorkflowStep) => void;
  activeCaseId?: string;
  patientName?: string;
}

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({
  currentLanguage,
  onTriageComplete,
  onRequestEmergencyTransport,
  onOpenPdfReport,
  onRequestDoctorReview,
  onNavigateToFacilityFinder,
  onNavigateToStep,
  activeCaseId = 'CASE-2026-8812',
  patientName = 'Patient Case',
}) => {
  const t = TRANSLATIONS[currentLanguage];

  const [symptomsText, setSymptomsText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [triageOutput, setTriageOutput] = useState<{ triage: TriageResult; referral?: any } | null>(null);

  // Patient vitals state
  const [vitals, setVitals] = useState<PatientVitals>({
    heartRate: undefined,
    bloodPressureSys: undefined,
    bloodPressureDia: undefined,
    spo2: undefined,
    temperature: undefined,
  });
  const [patientAge, setPatientAge] = useState<number>(45);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female');

  // Quick symptom chips
  const quickSymptoms = [
    { labelEn: 'Chest Pain', labelKn: 'ಎದೆ ನೋವು', labelHi: 'सीने में दर्द' },
    { labelEn: 'Difficulty Breathing', labelKn: 'ಉಸಿರಾಟದ ತೊಂದರೆ', labelHi: 'सांस लेने में तकलीफ' },
    { labelEn: 'High Fever in Pregnancy', labelKn: 'ಗರ್ಭಿಣಿ ಜ್ವರ', labelHi: 'गर्भावस्था में तेज बुखार' },
    { labelEn: 'Severe Headache & Dizziness', labelKn: 'ತಲೆನೋವು ಮತ್ತು ತಲೆತಿರುಗುವಿಕೆ', labelHi: 'तेज सिरदर्द और चक्कर' },
    { labelEn: 'Persistent Cough & Cold', labelKn: 'ಕೆಮ್ಮು ಮತ್ತು ಶೀತ', labelHi: 'लगातार खांसी और जुकाम' },
    { labelEn: 'Joint & Body Pain', labelKn: 'ಮೈ ಕೈ ನೋವು', labelHi: 'शरीर और जोड़ों में दर्द' },
  ];

  const handleAddSymptomChip = (chipText: string) => {
    setSymptomsText((prev) => (prev ? `${prev}, ${chipText}` : chipText));
  };

  // Speech Recognition Handling
  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser mode. Simulating voice input...');
      setSymptomsText((prev) =>
        prev
          ? `${prev}, Nanage usiraadakke kashta agta ide mattu ede novu ide`
          : 'Nanage usiraadakke kashta agta ide mattu ede novu ide (I am having chest pain and difficulty breathing)'
      );
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const langMap: Record<Language, string> = {
        kn: 'kn-IN',
        en: 'en-IN',
        hi: 'hi-IN',
      };
      recognition.lang = langMap[currentLanguage] || 'en-IN';

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSymptomsText((prev) => (prev ? `${prev}. ${transcript}` : transcript));
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsRecording(false);
    }
  };

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');

  const handleSubmitTriage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomsText.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    setLoadingStep('Analyzing reported symptoms & vitals...');

    try {
      setTimeout(() => setLoadingStep('Calling AI Triage Agent for urgency categorization...'), 600);

      const response = await predictTriage({
        symptomsText,
        vitals: {
          heartRate: vitals.heartRate,
          bpSys: vitals.bloodPressureSys,
          bpDia: vitals.bloodPressureDia,
          spo2: vitals.spo2,
          temp: vitals.temperature,
        },
        patientAge,
        gender,
      });

      setTriageOutput(response);
      onTriageComplete(response);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error?.message || 'Failed to complete AI triage assessment. Please check connection and try again.'
      );
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div id="symptom-checker-component" className="space-y-6">
      {/* Patient Progress Tracker */}
      <PatientWorkflowTracker
        currentStep={triageOutput ? 'ai-assessment' : 'symptoms'}
        onStepClick={onNavigateToStep}
        caseId={activeCaseId}
        patientName={patientName}
      />

      {/* Header Card */}
      <div className="bento-card p-6 shadow-md">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="p-3 bg-teal-50 text-teal-600 border border-teal-200 rounded-2xl">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{t.checkSymptoms}</h2>
            <p className="bento-tag text-slate-500 font-semibold mt-0.5">Agent 1: AI Triage Agent with Multi-Lingual NLP & Vitals Analysis</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5 font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{t.emergencyDisclaimer}</span>
        </div>
      </div>

      {/* Input Form */}
      <div className="bento-card p-6 shadow-md space-y-6">
        <form onSubmit={handleSubmitTriage} className="space-y-5">
          {/* Patient Profile / Vitals Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block bento-tag text-slate-500 font-bold mb-1.5">{t.age}</label>
              <div className="relative">
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:border-teal-500 focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block bento-tag text-slate-500 font-bold mb-1.5">{t.gender}</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:border-teal-500 focus:bg-white focus:outline-none transition"
              >
                <option value="female" className="bg-white">Female</option>
                <option value="male" className="bg-white">Male</option>
                <option value="other" className="bg-white">Other</option>
              </select>
            </div>

            <div>
              <label className="block bento-tag text-slate-500 font-bold mb-1.5 flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500" /> {t.spo2}
              </label>
              <input
                type="number"
                placeholder="e.g. 96"
                value={vitals.spo2 || ''}
                onChange={(e) => setVitals({ ...vitals, spo2: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:border-teal-500 focus:bg-white focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block bento-tag text-slate-500 font-bold mb-1.5 flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-amber-500" /> {t.temp}
              </label>
              <input
                type="number"
                placeholder="e.g. 98.6"
                value={vitals.temperature || ''}
                onChange={(e) => setVitals({ ...vitals, temperature: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 font-medium focus:border-teal-500 focus:bg-white focus:outline-none transition"
              />
            </div>
          </div>

          {/* Quick Symptoms Chips */}
          <div>
            <span className="block bento-tag text-slate-500 font-bold mb-2">Quick Symptoms:</span>
            <div className="flex flex-wrap gap-2">
              {quickSymptoms.map((chip, idx) => {
                const text =
                  currentLanguage === 'kn' ? chip.labelKn : currentLanguage === 'hi' ? chip.labelHi : chip.labelEn;
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleAddSymptomChip(text)}
                    className="text-xs bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200/80 font-bold transition cursor-pointer"
                  >
                    + {text}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Symptoms Input Text Box & Voice Mic */}
          <div className="relative">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Describe Patient Symptoms (Kannada / English / Hindi):
            </label>
            <div className="relative">
              <textarea
                rows={4}
                value={symptomsText}
                onChange={(e) => setSymptomsText(e.target.value)}
                placeholder="e.g. Severe chest pain, shortness of breath and sweating..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 placeholder-slate-400 font-medium focus:border-teal-500 focus:bg-white focus:outline-none transition"
              />
              {/* Mic Button Inside Textarea */}
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`absolute right-3.5 bottom-3.5 p-2.5 rounded-xl transition flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecording ? t.stopListening : t.speakSymptoms}</span>
              </button>
            </div>
          </div>

          {/* Error Message with Retry */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shrink-0 cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading Indicator with step */}
          {loading && loadingStep && (
            <div className="bg-teal-50 border border-teal-200 text-teal-800 rounded-2xl p-3.5 text-xs font-bold flex items-center gap-2 animate-pulse">
              <Activity className="w-4 h-4 text-teal-600 animate-spin" />
              <span>{loadingStep}</span>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading || !symptomsText.trim()}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-2xl shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Activity className="w-5 h-5 animate-spin text-white" />
            ) : (
              <Sparkles className="w-5 h-5 text-teal-200" />
            )}
            <span>{loading ? 'AI Triage Agent Analyzing...' : 'Evaluate Symptoms (Run AI Triage)'}</span>
          </button>
        </form>
      </div>

      {/* Triage Output Card */}
      {triageOutput && (
        <div className="bento-card p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <TriageBadge level={triageOutput.triage.level} size="lg" />
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{triageOutput.triage.title}</h3>
                <p className="bento-tag text-slate-500 font-semibold mt-0.5">
                  AI Confidence: <span className="text-teal-600 font-bold">{triageOutput.triage.confidence}%</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenPdfReport(triageOutput.triage)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5 font-bold transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>{t.downloadPdf}</span>
            </button>
          </div>

          {/* Reasoning & Key Factors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{t.explainableReasoning}</h4>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">{triageOutput.triage.reasoning}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{t.keyFactors}</h4>
              <ul className="space-y-1.5">
                {triageOutput.triage.keyFactors.map((factor, idx) => (
                  <li key={idx} className="text-xs text-slate-700 font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Action */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-800 uppercase">{t.recommendedAction}</h4>
              <p className="text-sm font-semibold text-emerald-950 mt-1">{triageOutput.triage.recommendedAction}</p>
            </div>
          </div>

          {/* Recommended Specialist Section */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Recommended Specialist Type
                </h4>
              </div>
              <span className="bento-tag px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200 font-bold">
                {symptomsText.toLowerCase().includes('chest') || symptomsText.toLowerCase().includes('heart')
                  ? 'Cardiology Specialist'
                  : symptomsText.toLowerCase().includes('fever') && gender === 'female'
                  ? 'Obstetrics & Gynecology (OB-GYN)'
                  : patientAge <= 12
                  ? 'Pediatrician'
                  : 'General Physician & Internal Medicine'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              For professional clinical evaluation based on reported symptoms and vitals.
            </p>
          </div>

          {/* Condition-Based Suggested Lab Tests */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-teal-700">
              <FlaskConical className="w-4 h-4 text-teal-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Suggested Diagnostic Lab Tests & Investigations
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {symptomsText.toLowerCase().includes('chest') || symptomsText.toLowerCase().includes('heart') || symptomsText.toLowerCase().includes('arm') ? (
                <>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2 shadow-xs">
                    <CheckCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">12-Lead ECG</strong>
                      <span className="text-slate-500 text-[11px] font-medium">Acute ischemia / infarction check</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2 shadow-xs">
                    <CheckCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Troponin-I Biomarker</strong>
                      <span className="text-slate-500 text-[11px] font-medium">Myocardial injury marker</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2 shadow-xs">
                    <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Lipid Profile & Glucose</strong>
                      <span className="text-slate-500 text-[11px] font-medium">Cardiovascular risk evaluation</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2 shadow-xs">
                    <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Chest X-Ray PA View</strong>
                      <span className="text-slate-500 text-[11px] font-medium">Cardiomegaly & congestion evaluation</span>
                    </div>
                  </div>
                </>
              ) : symptomsText.toLowerCase().includes('fever') || symptomsText.toLowerCase().includes('chills') ? (
                <>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2 shadow-xs">
                    <CheckCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">CBC with ESR & CRP</strong>
                      <span className="text-slate-500 text-[11px] font-medium">Infection severity & leucocytosis</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2 shadow-xs">
                    <CheckCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Dengue NS1 & Malaria Rapid</strong>
                      <span className="text-slate-500 text-[11px] font-medium">Endemic fever screening</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2 shadow-xs">
                    <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Complete Blood Count (CBC)</strong>
                      <span className="text-slate-500 text-[11px] font-medium">Baseline blood panel</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2 shadow-xs">
                    <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Fasting Blood Sugar & HbA1c</strong>
                      <span className="text-slate-500 text-[11px] font-medium">Metabolic screening</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Emergency Red Action Bar */}
          {triageOutput.triage.level === 'RED' && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse shadow-sm">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-rose-950">{t.emergencyAlert}</h4>
                  <p className="text-xs text-rose-800 font-medium">Requires immediate dispatch and bed reservation at nearest ICU facility.</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onRequestEmergencyTransport()}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition"
                >
                  <Truck className="w-4 h-4 text-white" />
                  <span>{t.requestTransport}</span>
                </button>
              </div>
            </div>
          )}

          {/* Smart Referral Recommendation Preview */}
          {triageOutput.referral?.recommendedFacility && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="bento-tag text-slate-500 font-bold uppercase">Agent 2 Smart Referral Recommendation</span>
                <span className="text-xs font-bold px-2.5 py-0.5 bg-teal-100 text-teal-800 rounded-full border border-teal-200">
                  Suitability: {triageOutput.referral.recommendedFacility.suitabilityScore}% Match
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{triageOutput.referral.recommendedFacility.name}</h4>
              <p className="text-xs text-slate-600 font-medium">
                {triageOutput.referral.recommendedFacility.distanceKm} km away • {triageOutput.referral.recommendedFacility.travelTimeMins} mins travel time
              </p>
            </div>
          )}

          {/* Recommended Next Action Continuous Workflow Navigation Bar */}
          <div className="bg-teal-50/50 p-4 rounded-2xl border border-teal-200/80 space-y-3">
            <h4 className="text-xs font-extrabold text-teal-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Recommended Next Action (Continue Patient Journey)
            </h4>

            <div className="flex flex-col sm:flex-row gap-3">
              {onRequestDoctorReview && (
                <button
                  type="button"
                  onClick={onRequestDoctorReview}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md shadow-teal-600/20 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Request Doctor Review & Care Plan</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </button>
              )}

              {onNavigateToFacilityFinder && (
                <button
                  type="button"
                  onClick={onNavigateToFacilityFinder}
                  className="flex-1 bg-white hover:bg-slate-50 text-slate-800 font-bold py-3 px-4 rounded-xl text-xs border border-slate-200 flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
                >
                  <Hospital className="w-4 h-4 text-teal-600" />
                  <span>Find Hospital & Create Referral</span>
                  <ArrowRight className="w-4 h-4 ml-auto text-slate-400" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
