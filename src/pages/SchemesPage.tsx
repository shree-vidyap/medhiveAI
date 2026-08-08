import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { 
  Landmark, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Filter, 
  Info 
} from 'lucide-react';

export const SchemesPage: React.FC = () => {
  const { schemes } = useApp();
  const { t } = useTranslation();

  // Question Flow State
  const [bplCategory, setBplCategory] = useState<'ALL' | 'BPL' | 'APL'>('ALL');
  const [genderCategory, setGenderCategory] = useState<'ALL' | 'FEMALE' | 'GENERAL'>('ALL');

  const filteredSchemes = schemes.filter((scheme) => {
    if (bplCategory === 'BPL' && !scheme.targetBeneficiaries.toLowerCase().includes('bpl') && !scheme.description.toLowerCase().includes('poor')) {
      return false;
    }
    if (genderCategory === 'FEMALE' && !scheme.name.toLowerCase().includes('matritva') && !scheme.description.toLowerCase().includes('pregnant')) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1 border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Landmark className="w-6 h-6 text-amber-400" />
          {t('schemes.title', 'Healthcare Schemes')}
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          {t('schemes.subtitle', 'Explore government insurance schemes, cashless care eligibility, and benefits')}
        </p>
      </div>

      {/* QUESTION FLOW FILTER BOX */}
      <div className="bento-card p-5 space-y-4">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Filter className="w-4 h-4 text-teal-400" />
          <span>{t('schemes.checkEligibility', 'Check Your Eligibility (2 Quick Questions)')}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Q1: Ration Card / Income Status */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400">1. Ration Card / Income Category</label>
            <div className="flex gap-2 text-xs">
              {[
                { id: 'ALL', label: 'All Categories' },
                { id: 'BPL', label: 'BPL Card / Low Income' },
                { id: 'APL', label: 'APL Card' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setBplCategory(opt.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer border ${
                    bplCategory === opt.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-[#0B0F0E] text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q2: Specific Healthcare Need */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400">2. Special Beneficiary Group</label>
            <div className="flex gap-2 text-xs">
              {[
                { id: 'ALL', label: 'General / All' },
                { id: 'FEMALE', label: 'Maternal Care (Pregnant)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setGenderCategory(opt.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer border ${
                    genderCategory === opt.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-[#0B0F0E] text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SCHEME CARDS LIST */}
      <div className="space-y-6">
        {filteredSchemes.map((scheme) => (
          <div key={scheme.id} className="bento-card p-6 space-y-5 hover:border-amber-500/40 transition">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white">{scheme.name}</h3>
                {scheme.kannadaName && (
                  <p className="text-xs text-amber-300 font-medium mt-0.5">{scheme.kannadaName}</p>
                )}
              </div>
              <span className="bento-tag bg-amber-950 text-amber-300 border border-amber-800 px-2.5 py-1 rounded text-[10px] shrink-0 self-start sm:self-auto">
                Government Scheme
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {scheme.description}
            </p>

            {/* Benefits & Requirements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Key Benefits */}
              <div className="bg-[#0B0F0E] p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">{t('schemes.benefits', 'Benefits')}</h4>
                <ul className="space-y-1.5 text-slate-300 font-medium">
                  {scheme.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Documents */}
              <div className="bg-[#0B0F0E] p-4 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-teal-400 uppercase text-[10px] tracking-wider">{t('schemes.documents', 'Required Documents')}</h4>
                <ul className="space-y-1.5 text-slate-300 font-medium">
                  {scheme.requiredDocuments.map((doc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FileText className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* How to Apply */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1">
              <span className="font-bold text-slate-200">{t('schemes.howToApply', 'How to Apply')}: </span>
              <span className="text-slate-400">{scheme.howToApply}</span>
            </div>

            {/* Official Source Note */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-slate-600" />
                For official details, always verify at the source portal.
              </span>
              <a
                href={scheme.officialSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
