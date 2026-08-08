import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { TriageLevel, TriageResult } from '../types';
import { startSpeechToText, stopSpeechToText, speakText, stopSpeaking } from '../utils/speech';
import { 
  Stethoscope, 
  CheckSquare, 
  Square, 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  Building2, 
  Send, 
  MessageSquare, 
  ArrowLeft, 
  RotateCcw,
  CheckCircle2,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';

const COMMON_SYMPTOMS = [
  'Chest discomfort or tightness',
  'Difficulty breathing or shortness of breath',
  'High fever (> 101°F)',
  'Severe abdominal / stomach pain',
  'Sudden weakness or facial numbness',
  'Severe headache or dizziness',
  'Persistent cough or cold',
  'Joint pain or body ache',
  'Nausea, vomiting or diarrhea',
  'History of High Blood Pressure or Diabetes',
];

export const SymptomCheckerPage: React.FC = () => {
  const navigate = useNavigate();
  const { facilities, addReport, user } = useApp();
  const { t, i18n } = useTranslation();

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [loadingText, setLoadingText] = useState('Analyzing symptoms...');
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);

  // Voice State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      stopSpeechToText();
      stopSpeaking();
    };
  }, []);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopSpeechToText();
      setIsListening(false);
    } else {
      setVoiceError(null);
      setIsListening(true);
      const activeLang = i18n.language || 'en';

      startSpeechToText(
        activeLang,
        (text, _isFinal) => {
          setAdditionalNotes((prev) => (prev ? `${prev} ${text}` : text));
        },
        (error) => {
          setVoiceError(error);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else if (triageResult) {
      setIsSpeaking(true);
      const activeLang = i18n.language || 'en';
      const textToSpeak = `${triageResult.title}. ${triageResult.reasoning}. Recommended next step: ${triageResult.recommendedAction}`;
      speakText(textToSpeak, activeLang, () => setIsSpeaking(false));
    }
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0 && !additionalNotes.trim()) return;

    if (isListening) {
      stopSpeechToText();
      setIsListening(false);
    }

    setStep('loading');
    setLoadingText(t('symptoms.analyzing', 'Analyzing symptoms...'));

    setTimeout(() => {
      setLoadingText(t('symptoms.processing', 'Processing health information & vitals...'));
      setTimeout(() => {
        setLoadingText(t('symptoms.generating', 'Generating clinical assessment...'));
        setTimeout(() => {
          // Generate realistic mock triage level based on selected symptoms
          let level: TriageLevel = 'GREEN';
          let title = t('symptoms.routineUrgency', 'ROUTINE - Self Care & Monitoring');
          let action = 'Visit your local Primary Health Centre (PHC) for routine outpatient checkup and medication.';
          let reasoning = 'Reported symptoms are mild to moderate and do not indicate immediate life-threatening distress.';

          const isHighEmergency = selectedSymptoms.some(
            (s) =>
              s.includes('Chest discomfort') ||
              s.includes('Difficulty breathing') ||
              s.includes('Sudden weakness')
          ) || additionalNotes.toLowerCase().includes('chest') || additionalNotes.toLowerCase().includes('breath');

          const isUrgent = selectedSymptoms.some(
            (s) => s.includes('High fever') || s.includes('Severe abdominal') || s.includes('Severe headache')
          );

          const isPriority = selectedSymptoms.some(
            (s) => s.includes('Nausea') || s.includes('Joint pain') || s.includes('History of High')
          );

          if (isHighEmergency) {
            level = 'RED';
            title = t('symptoms.highUrgency', 'HIGH URGENCY - Emergency Care Needed');
            reasoning = 'Acute chest tightness or respiratory distress requires immediate tertiary emergency cardiac/ICU care.';
            action = 'Tap "Start Emergency Assistance" immediately to dispatch emergency transport or call 108 hotline.';
          } else if (isUrgent) {
            level = 'ORANGE';
            title = t('symptoms.urgentUrgency', 'URGENT - Seek Prompt Medical Care');
            reasoning = 'High fever or severe organ discomfort indicates potential infection or acute inflammatory state.';
            action = 'Proceed to the nearest District Hospital or Community Health Centre (CHC) within 2-4 hours.';
          } else if (isPriority) {
            level = 'YELLOW';
            title = t('symptoms.priorityUrgency', 'PRIORITY - Schedule PHC Visit');
            reasoning = 'Persistent systemic symptoms require medical evaluation and laboratory blood work.';
            action = 'Schedule a same-day or next-day consultation at your nearest PHC.';
          }

          const result: TriageResult = {
            level,
            title,
            confidence: 92,
            reasoning,
            keyFactors: selectedSymptoms.length > 0 ? selectedSymptoms : ['Reported general malaise'],
            recommendedAction: action,
            timestamp: new Date().toISOString(),
            symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : [additionalNotes || 'General symptoms'],
          };

          setTriageResult(result);
          setStep('result');

          // Save into reports state
          addReport({
            title: `Symptom Assessment (${level})`,
            source: 'Assessment',
            patientName: user.name,
            symptoms: selectedSymptoms,
            triage: result,
            summary: `${title}: ${action}`,
          });
        }, 600);
      }, 600);
    }, 600);
  };

  const getLevelBadge = (level: TriageLevel) => {
    switch (level) {
      case 'RED':
        return (
          <span className="bg-rose-950 text-rose-300 border border-rose-700/80 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            🔴 {t('symptoms.highUrgency', 'HIGH URGENCY')}
          </span>
        );
      case 'ORANGE':
        return (
          <span className="bg-amber-950 text-amber-300 border border-amber-700/80 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            🟠 {t('symptoms.urgentUrgency', 'URGENT')}
          </span>
        );
      case 'YELLOW':
        return (
          <span className="bg-yellow-950 text-yellow-300 border border-yellow-700/80 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            🟡 {t('symptoms.priorityUrgency', 'PRIORITY')}
          </span>
        );
      case 'GREEN':
      default:
        return (
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-700/80 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            🟢 {t('symptoms.routineUrgency', 'ROUTINE')}
          </span>
        );
    }
  };

  const recommendedFacility = facilities[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/home')}
            className="p-2 bg-[#131C1E] hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-400" />
              {t('symptoms.title', 'AI Symptom Assessment')}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {t('symptoms.subTitle', 'Select symptoms or describe how you feel via text or voice.')}
            </p>
          </div>
        </div>

        {step === 'result' && (
          <button
            onClick={() => {
              setStep('input');
              setSelectedSymptoms([]);
              setAdditionalNotes('');
              setTriageResult(null);
            }}
            className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 bg-[#131C1E] px-3 py-1.5 rounded-xl border border-slate-800 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Check</span>
          </button>
        )}
      </div>

      {/* STEP 1: INPUT FORM */}
      {step === 'input' && (
        <div className="bento-card p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              1. {t('symptoms.commonSymptoms', 'Common Symptoms Checklist')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMMON_SYMPTOMS.map((symptom) => {
                const checked = selectedSymptoms.includes(symptom);
                return (
                  <div
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                      checked
                        ? 'bg-teal-950/60 border-teal-500/80 text-teal-200 font-semibold shadow-xs'
                        : 'bg-[#0B0F0E] border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-teal-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span className="text-xs">{symptom}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                2. {t('symptoms.freeTextLabel', 'Describe Additional Details')}
              </label>

              {/* Real Web Speech Voice Button */}
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                  isListening
                    ? 'bg-rose-950/80 text-rose-300 border-rose-600 animate-pulse'
                    : 'bg-[#131C1E] text-teal-300 border-teal-500/40 hover:bg-teal-950/40'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-3.5 h-3.5 text-rose-400" />
                    <span>{t('symptoms.listening', 'Listening...')}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-teal-400" />
                    <span>🎙️ {t('symptoms.voiceButton', 'Voice Input')}</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder={t('symptoms.freeTextPlaceholder', 'Describe duration, severity, or specific symptoms (or tap voice button)...')}
              rows={3}
              className="w-full bg-[#0B0F0E] border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/80 transition"
            />

            {voiceError && (
              <p className="text-[11px] text-amber-400 font-medium">{voiceError}</p>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={selectedSymptoms.length === 0 && !additionalNotes.trim()}
            className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-slate-950 font-extrabold text-sm py-3.5 rounded-xl shadow-lg shadow-teal-600/20 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Activity className="w-4 h-4" />
            <span>{t('symptoms.analyzeButton', 'Analyze Symptoms')}</span>
          </button>
        </div>
      )}

      {/* STEP 2: LOADING SEQUENCE */}
      {step === 'loading' && (
        <div className="bento-card p-12 text-center space-y-6 max-w-md mx-auto my-8">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 border-t-teal-400 animate-spin" />
            <Activity className="w-6 h-6 text-teal-400" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-extrabold text-white animate-pulse">
              {loadingText}
            </p>
            <p className="text-xs text-slate-400 font-medium">
              Medihivi AI is evaluating symptom severity against clinical guidelines...
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: RESULT SCREEN */}
      {step === 'result' && triageResult && (
        <div className="space-y-6">
          {/* Main Result Box */}
          <div className="bento-card p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {t('symptoms.resultTitle', 'AI Health Triage Result')}
                </p>
                <h2 className="text-2xl font-extrabold text-white">
                  {triageResult.title}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {getLevelBadge(triageResult.level)}

                {/* Read Aloud TTS Button */}
                <button
                  onClick={handleReadAloud}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 transition cursor-pointer ${
                    isSpeaking
                      ? 'bg-amber-950 text-amber-300 border-amber-600 animate-pulse'
                      : 'bg-[#131C1E] text-teal-300 border-teal-500/40 hover:bg-slate-800'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t('symptoms.stopReadAloud', 'Stop Audio 🔇')}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                      <span>{t('symptoms.readAloud', 'Read Result Aloud 🔊')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Key Concerns */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{t('symptoms.keyConcerns', 'Key Concerns & Observations')}</span>
              </h3>
              <ul className="space-y-1.5 bg-[#0B0F0E] p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
                {triageResult.keyFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Next Step */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>{t('symptoms.recommendedNextStep', 'Recommended Next Step')}</span>
              </h3>
              <div className="bg-teal-950/40 border border-teal-500/30 p-4 rounded-xl text-xs text-teal-200 leading-relaxed font-medium">
                {triageResult.recommendedAction}
              </div>
            </div>

            {/* Recommended Facility Mini Card */}
            {recommendedFacility && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {t('symptoms.recommendedFacility', 'Recommended Facility')}
                </h3>
                <div className="bg-[#0B0F0E] border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-extrabold text-white">
                        {recommendedFacility.name}
                      </h4>
                      <span className="bento-tag bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[9px]">
                        {recommendedFacility.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {recommendedFacility.distanceKm} km away • {recommendedFacility.travelTimeMins} mins travel time
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/facilities/${recommendedFacility.id}`)}
                    className="text-xs font-bold text-teal-400 hover:underline shrink-0"
                  >
                    Details →
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons with Proper Hierarchy */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-3">
              {triageResult.level === 'RED' && (
                <button
                  onClick={() => navigate('/emergency')}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4 text-white" />
                  <span>{t('symptoms.startEmergency', 'Start Emergency Assistance')}</span>
                </button>
              )}

              <button
                onClick={() => navigate(`/facilities/${recommendedFacility.id}`)}
                className="bg-[#131C1E] hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-2 cursor-pointer transition"
              >
                <Building2 className="w-4 h-4 text-teal-400" />
                <span>{t('symptoms.viewFacility', 'View Facility')}</span>
              </button>

              <button
                onClick={() => navigate('/referrals/new')}
                className="bg-[#131C1E] hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-2 cursor-pointer transition"
              >
                <Send className="w-4 h-4 text-teal-400" />
                <span>{t('symptoms.startReferral', 'Start Referral')}</span>
              </button>

              <button
                onClick={() => navigate('/assistant')}
                className="text-slate-400 hover:text-teal-300 font-bold text-xs px-3 py-3 rounded-xl flex items-center gap-1.5 transition cursor-pointer ml-auto"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('symptoms.askAssistant', 'Ask Medihivi Assistant')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
