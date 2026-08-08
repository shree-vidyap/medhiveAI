import React, { useState, useEffect } from 'react';
import { GovernmentScheme, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { fetchSchemes, checkSchemeEligibility } from '../services/api';
import { 
  CheckCircle2, 
  ExternalLink, 
  FileCheck, 
  HelpCircle, 
  Info, 
  Landmark, 
  ShieldCheck, 
  Sparkles, 
  UserCheck 
} from 'lucide-react';

interface GovernmentSchemesProps {
  currentLanguage: Language;
}

export const GovernmentSchemes: React.FC<GovernmentSchemesProps> = ({ currentLanguage }) => {
  const t = TRANSLATIONS[currentLanguage];

  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Eligibility Checker state
  const [hasBplCard, setHasBplCard] = useState<boolean>(true);
  const [state, setState] = useState<string>('Karnataka');
  const [isPregnant, setIsPregnant] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    setLoading(true);
    try {
      const data = await fetchSchemes();
      setSchemes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunEligibility = async () => {
    setIsChecking(true);
    try {
      const evaluated = await checkSchemeEligibility({
        hasBplCard,
        state,
        isPregnant,
      });
      setSchemes(evaluated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div id="government-schemes-component" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t.govSchemes}</h2>
            <p className="text-xs text-slate-400">Agent 5: Healthcare Assistance & Official Scheme Eligibility Agent</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/60 border border-amber-800 px-3 py-1.5 rounded-xl">
          <Info className="w-4 h-4 shrink-0" />
          <span>Information should be verified with the official government portal.</span>
        </div>
      </div>

      {/* Interactive Eligibility Checker Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Quick Scheme Eligibility Checker
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Possess BPL / Antyodaya Ration Card?</span>
            <input
              type="checkbox"
              checked={hasBplCard}
              onChange={(e) => setHasBplCard(e.target.checked)}
              className="w-4 h-4 text-emerald-500 rounded cursor-pointer"
            />
          </div>

          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">State of Residence</span>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="bg-slate-900 text-xs font-bold text-white p-1 rounded border border-slate-700"
            >
              <option value="Karnataka">Karnataka</option>
              <option value="Other">Other Indian State</option>
            </select>
          </div>

          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Pregnant Woman (Matritva)?</span>
            <input
              type="checkbox"
              checked={isPregnant}
              onChange={(e) => setIsPregnant(e.target.checked)}
              className="w-4 h-4 text-emerald-500 rounded cursor-pointer"
            />
          </div>
        </div>

        <button
          onClick={handleRunEligibility}
          disabled={isChecking}
          className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
        >
          <span>{isChecking ? 'Checking Eligibility...' : 'Evaluate My Scheme Eligibility'}</span>
        </button>
      </div>

      {/* Schemes List */}
      <div className="space-y-4">
        {schemes.map((scheme) => {
          const nameToDisplay =
            currentLanguage === 'kn' && scheme.kannadaName
              ? scheme.kannadaName
              : currentLanguage === 'hi' && scheme.hindiName
              ? scheme.hindiName
              : scheme.name;

          return (
            <div key={scheme.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">{nameToDisplay}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{scheme.description}</p>
                </div>

                {scheme.userEligibilityStatus && (
                  <div className="shrink-0">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-lg ${
                        scheme.userEligibilityStatus === 'ELIGIBLE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {scheme.userEligibilityStatus === 'ELIGIBLE' ? '✓ ELIGIBLE' : 'NEEDS VERIFICATION'}
                    </span>
                  </div>
                )}
              </div>

              {/* Key Benefits Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Scheme Benefits:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {scheme.benefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60 text-xs text-slate-200 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Documents */}
              <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  <span>Required Documents: <strong>{scheme.requiredDocuments.join(', ')}</strong></span>
                </div>

                <a
                  href={scheme.officialSourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1 shrink-0"
                >
                  <span>{t.officialSource}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
