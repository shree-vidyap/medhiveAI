import React, { useState } from 'react';
import { TriageResult } from '../types';
import { TriageBadge } from './TriageBadge';
import { ArrowLeft, Calendar, FileText, Stethoscope, ChevronRight, Download, Sparkles } from 'lucide-react';

export interface SavedReportRecord {
  id: string;
  timestamp: string;
  symptoms: string[];
  triage: TriageResult;
  patientName: string;
}

interface MyReportsViewProps {
  reports: SavedReportRecord[];
  onOpenPdfReport: (triage: TriageResult) => void;
  onBackToHome: () => void;
}

export const MyReportsView: React.FC<MyReportsViewProps> = ({
  reports,
  onOpenPdfReport,
  onBackToHome,
}) => {
  const [selectedReport, setSelectedReport] = useState<SavedReportRecord | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bento-card p-6 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBackToHome}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">My Health Reports & Assessments</h2>
            <p className="bento-tag text-slate-500 font-semibold mt-0.5">
              History of past AI symptom triage evaluations & lab scans
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {selectedReport ? (
        /* Detailed Report View */
        <div className="bento-card p-6 shadow-xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <button
              onClick={() => setSelectedReport(null)}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Reports List</span>
            </button>

            <button
              onClick={() => onOpenPdfReport(selectedReport.triage)}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 font-bold shadow-sm transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Report</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TriageBadge level={selectedReport.triage.level} size="lg" />
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{selectedReport.triage.title}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(selectedReport.timestamp).toLocaleString()}</span>
                  <span>• Patient: {selectedReport.patientName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reasoning & Key Factors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Plain-Language Explanation</h4>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">{selectedReport.triage.reasoning}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Key Clinical Concerns</h4>
              <ul className="space-y-1.5">
                {selectedReport.triage.keyFactors.map((factor, idx) => (
                  <li key={idx} className="text-xs text-slate-700 font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Next Step */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Recommended Next Action</h4>
            <p className="text-sm font-semibold text-emerald-950 mt-1">{selectedReport.triage.recommendedAction}</p>
          </div>
        </div>
      ) : (
        /* List of Reports */
        <div className="bento-card p-6 shadow-md space-y-4">
          {reports.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-600 font-medium">No saved health reports yet.</p>
              <p className="text-xs text-slate-400">Complete a symptom check or scan a medical report to save records here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => setSelectedReport(rec)}
                  className="bg-white border border-slate-200 hover:border-teal-300 p-4 rounded-2xl flex items-center justify-between gap-4 transition cursor-pointer group shadow-xs hover:shadow-md"
                >
                  <div className="flex items-center gap-3.5">
                    <TriageBadge level={rec.triage.level} size="sm" />
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-teal-700 transition">
                        {rec.triage.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(rec.timestamp).toLocaleDateString()}</span>
                        <span>• Symptoms: {rec.symptoms.join(', ') || 'Report Scan'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-teal-700 font-bold hidden sm:inline">View Report</span>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
