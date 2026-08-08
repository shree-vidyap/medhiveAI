import React from 'react';
import { TriageResult } from '../types';
import { Activity, CheckCircle2, Download, FileText, FlaskConical, Printer, ShieldCheck, X } from 'lucide-react';

interface PDFReportGeneratorProps {
  triageResult: TriageResult;
  patientName?: string;
  patientId?: string;
  patientAge?: number;
  gender?: string;
  onClose: () => void;
}

export const PDFReportGenerator: React.FC<PDFReportGeneratorProps> = ({
  triageResult,
  patientName = 'Basavaraju M',
  patientId = 'MH-2026-000103',
  patientAge = 64,
  gender = 'Male',
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const textContent = `
============================================================
MEDIHIVI AI - CLINICAL PATIENT ASSESSMENT & TRIAGE REPORT
============================================================
Report ID: ${triageResult.patientId || 'MH-RPT-2026'}
Date: ${new Date().toLocaleString()}

PATIENT PROFILE:
Name: ${patientName}
Patient ID: ${patientId}
Age / Gender: ${patientAge} yrs / ${gender}
District: Mandya, Karnataka

AI TRIAGE ASSESSMENT:
Level: ${triageResult.level} - ${triageResult.title}
Confidence Score: ${triageResult.confidence}%

CLINICAL REASONING:
${triageResult.reasoning}

KEY FACTOR ANALYSIS:
${triageResult.keyFactors.map((f) => `- ${f}`).join('\n')}

RECOMMENDED CLINICAL ACTION:
${triageResult.recommendedAction}

SUGGESTED DIAGNOSTIC LAB TESTS & INVESTIGATIONS:
${getSuggestedLabTests(triageResult).map((test) => `- [ ] ${test.name}: ${test.reason}`).join('\n')}

DISCLAIMER:
MediHivi AI is a clinical decision-support tool designed for healthcare workers.
It does not replace professional doctor diagnosis or prescription.
============================================================
`;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MediHivi_Report_${patientName.replace(/\s+/g, '_')}_${patientId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to determine condition-specific lab tests
  function getSuggestedLabTests(triage: TriageResult) {
    const text = (triage.title + ' ' + triage.reasoning + ' ' + triage.keyFactors.join(' ')).toLowerCase();
    const tests: { name: string; reason: string; urgent?: boolean }[] = [];

    if (text.includes('chest') || text.includes('heart') || text.includes('cardiac') || text.includes('arm')) {
      tests.push(
        { name: '12-Lead ECG (Electrocardiogram)', reason: 'Immediate evaluation for acute coronary syndrome / ischemia', urgent: true },
        { name: 'Serum Troponin-I / Trop-T', reason: 'Cardiac biomarker for myocardial infarction screening', urgent: true },
        { name: 'Lipid Profile & Fasting Blood Sugar', reason: 'Cardiovascular risk stratification' },
        { name: 'Chest X-Ray (PA View)', reason: 'Assess cardiomegaly, pulmonary congestion, or aortic pathology' }
      );
    } else if (text.includes('fever') || text.includes('infection') || text.includes('chills') || text.includes('sweat')) {
      tests.push(
        { name: 'Complete Blood Count (CBC) with ESR/CRP', reason: 'Assess leukocytosis, infection severity, and systemic inflammation', urgent: true },
        { name: 'Dengue NS1 Antigen & Malaria Smear', reason: 'Rule out endemic vector-borne febrile illnesses', urgent: true },
        { name: 'Blood Culture & Urinalysis', reason: 'Identify infectious etiology for targeted antimicrobial therapy' }
      );
    } else if (text.includes('breath') || text.includes('respiratory') || text.includes('cough') || text.includes('asthma')) {
      tests.push(
        { name: 'SpO2 Continuous Pulse Oximetry & ABG', reason: 'Evaluate hypoxemia and acid-base blood gas status', urgent: true },
        { name: 'Chest X-Ray (PA View)', reason: 'Rule out pneumonia, pleural effusion, or pneumothorax', urgent: true },
        { name: 'Sputum Microscopy & GeneXpert (TB)', reason: 'Screen for pulmonary bacterial infection or Tuberculosis' }
      );
    } else {
      tests.push(
        { name: 'Complete Blood Count (CBC)', reason: 'Baseline cellular indices and infection evaluation' },
        { name: 'Fasting Blood Glucose (FBG) & HbA1c', reason: 'Metabolic evaluation' },
        { name: 'Renal Function Test (Urea/Creatinine)', reason: 'Kidney function and hydration status' }
      );
    }

    return tests;
  }

  const labTests = getSuggestedLabTests(triageResult);

  return (
    <div id="pdf-report-modal" className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0d0d0e] border border-[#22222a] rounded-3xl max-w-2xl w-full p-6 space-y-6 text-white shadow-2xl my-8 print:bg-white print:text-black print:p-0 print:m-0 print:border-none">
        {/* Actions Bar (Hidden during printing) */}
        <div className="flex items-center justify-between border-b border-[#1f1f23] pb-4 print:hidden">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
            <FileText className="w-5 h-5 text-purple-400" />
            <span>MediHivi Patient Assessment Report</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="bg-[#141416] hover:bg-[#1f1f25] text-purple-300 font-bold text-xs px-3.5 py-2 rounded-xl border border-[#22222a] flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span>Download Report</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-900/40 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-[#1f1f25] rounded-xl text-neutral-400 transition cursor-pointer"
              title="Close Report"
            >
              <X className="w-5 h-5 text-neutral-300" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="bg-[#0a0a0c] p-6 rounded-2xl border border-[#22222a] space-y-6 print:bg-white print:text-slate-900 print:border-none">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1f1f23] print:border-slate-300 pb-4">
            <div>
              <h1 className="text-xl font-black text-white print:text-slate-900">MediHivi AI Platform</h1>
              <p className="text-xs text-neutral-400 print:text-slate-600">Multi-Agent Clinical Triage & Smart Referral Assessment</p>
            </div>
            <div className="text-right text-xs text-neutral-400 print:text-slate-600">
              <p className="font-bold text-purple-300 print:text-purple-700">Report ID: {triageResult.patientId || 'MH-RPT-2026'}</p>
              <p>{new Date().toLocaleString()}</p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#141416] p-4 rounded-xl border border-[#22222a] print:bg-slate-100 text-xs">
            <div>
              <span className="text-neutral-400 print:text-slate-600 block text-[10px] uppercase">Patient Name</span>
              <span className="font-bold text-white print:text-slate-900 text-sm">{patientName}</span>
            </div>
            <div>
              <span className="text-neutral-400 print:text-slate-600 block text-[10px] uppercase">Patient ID</span>
              <span className="font-bold text-white print:text-slate-900">{patientId}</span>
            </div>
            <div>
              <span className="text-neutral-400 print:text-slate-600 block text-[10px] uppercase">Age / Gender</span>
              <span className="font-bold text-white print:text-slate-900">{patientAge} yrs / {gender}</span>
            </div>
            <div>
              <span className="text-neutral-400 print:text-slate-600 block text-[10px] uppercase">District / Center</span>
              <span className="font-bold text-white print:text-slate-900">Mandya / PHC</span>
            </div>
          </div>

          {/* Triage Urgency Result */}
          <div className="bg-[#141416] p-4 rounded-xl border border-[#22222a] print:bg-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">AI Triage Classification</span>
              <h2 className="text-lg font-black text-rose-400 print:text-rose-700">{triageResult.level} — {triageResult.title}</h2>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-purple-300 print:text-purple-700">Confidence: {triageResult.confidence}%</span>
            </div>
          </div>

          {/* Reasoning & Key Factors */}
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="font-bold uppercase text-neutral-400 print:text-slate-600 mb-1">Clinical AI Reasoning:</h3>
              <p className="p-3 bg-[#141416] rounded-xl border border-[#22222a] print:bg-slate-100 text-neutral-200 print:text-slate-800 leading-relaxed">
                {triageResult.reasoning}
              </p>
            </div>

            <div>
              <h3 className="font-bold uppercase text-neutral-400 print:text-slate-600 mb-1">Key Urgency Factors:</h3>
              <ul className="list-disc list-inside p-3 bg-[#141416] rounded-xl border border-[#22222a] print:bg-slate-100 text-neutral-200 print:text-slate-800 space-y-1">
                {triageResult.keyFactors.map((f, idx) => (
                  <li key={idx}>{f}</li>
                ))}
              </ul>
            </div>

            {/* Condition-Based Suggested Diagnostic Lab Tests */}
            <div>
              <h3 className="font-bold uppercase text-purple-300 print:text-purple-700 mb-1 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-purple-400" />
                Suggested Diagnostic Lab Tests & Investigations
              </h3>
              <div className="p-3 bg-[#141416] rounded-xl border border-[#22222a] print:bg-slate-100 space-y-2">
                {labTests.map((test, idx) => (
                  <div key={idx} className="flex items-start gap-2 border-b border-[#1f1f23] print:border-slate-200 pb-2 last:border-none last:pb-0">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${test.urgent ? 'text-rose-400' : 'text-purple-400'}`} />
                    <div>
                      <span className="font-bold text-white print:text-slate-900 block">{test.name} {test.urgent && <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded border border-rose-500/30 ml-1">Urgent</span>}</span>
                      <span className="text-neutral-400 print:text-slate-600 text-[11px]">{test.reason}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold uppercase text-neutral-400 print:text-slate-600 mb-1">Recommended Action:</h3>
              <p className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl text-purple-200 print:bg-purple-50 print:text-purple-900 font-bold">
                {triageResult.recommendedAction}
              </p>
            </div>
          </div>

          {/* Mandatory Disclaimer Footer */}
          <div className="border-t border-[#1f1f23] print:border-slate-300 pt-4 text-[10px] text-neutral-400 print:text-slate-600 space-y-1">
            <p className="font-semibold">
              Medical Safety Disclaimer: MediHivi AI is a clinical decision-support prototype tool. It does NOT replace professional doctor diagnosis or prescription.
            </p>
            <p>Generated by MediHivi AI Healthcare Platform • Mandya, Karnataka</p>
          </div>
        </div>

        {/* Footer Actions (Close Button) */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1f1f23] print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-[#141416] hover:bg-[#1f1f25] text-neutral-300 font-bold py-3 rounded-2xl text-xs border border-[#22222a] transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <X className="w-4 h-4 text-neutral-400" />
            <span>Close Assessment Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

