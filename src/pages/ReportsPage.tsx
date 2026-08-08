import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';
import { MedicalReportExtraction } from '../types';
import { 
  FileText, 
  Upload, 
  Plus, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  FolderArchive, 
  Stethoscope, 
  FileUp, 
  Clock 
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { reports, addReport, user } = useApp();
  const { t } = useTranslation();

  const isScanRoute = window.location.pathname.endsWith('/scan');

  // Scan Flow State
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [scanStep, setScanStep] = useState<'upload' | 'processing' | 'result'>('upload');
  const [processStatus, setProcessStatus] = useState('Uploading document...');
  const [mockExtraction, setMockExtraction] = useState<MedicalReportExtraction | null>(null);

  // Handle Scan File Drop or Select
  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileSelected(file);
      runSimulatedScan(file.name);
    }
  };

  const runSimulatedScan = (fileName: string) => {
    setScanStep('processing');
    setProcessStatus('Uploading medical document...');

    setTimeout(() => {
      setProcessStatus('Reading document layout & text...');
      setTimeout(() => {
        setProcessStatus('Extracting lab parameters & vitals...');
        setTimeout(() => {
          setProcessStatus('Generating plain-language medical summary...');
          setTimeout(() => {
            const ext: MedicalReportExtraction = {
              id: `EXT-${Math.floor(1000 + Math.random() * 9000)}`,
              fileName,
              fileType: fileName.endsWith('.pdf') ? 'pdf' : 'image',
              extractedText: 'LABORATORY REPORT: Fasting Blood Glucose 142 mg/dL (High). HbA1c 7.1%. Total Cholesterol 210 mg/dL.',
              reportType: 'Blood Test',
              keyFindings: [
                'Fasting Blood Sugar elevated at 142 mg/dL (Normal: 70-99 mg/dL)',
                'HbA1c levels indicate diabetic glycemic range (7.1%)',
                'Mild elevation in serum cholesterol noted (210 mg/dL)',
              ],
              abnormalValues: [
                { parameter: 'Fasting Blood Sugar', value: '142 mg/dL', referenceRange: '70-99 mg/dL', status: 'HIGH' },
                { parameter: 'HbA1c', value: '7.1 %', referenceRange: '4.0-5.6 %', status: 'HIGH' },
              ],
              summary: 'Laboratory analysis shows elevated glycemic markers consistent with Type 2 Diabetes mellitus. Clinical correlation & dietary management advised.',
              triageImpact: 'Priority consultation with Primary Care Medical Officer recommended.',
              uploadedAt: new Date().toISOString(),
            };

            setMockExtraction(ext);
            setScanStep('result');
          }, 600);
        }, 600);
      }, 600);
    }, 600);
  };

  const handleSaveScannedReport = () => {
    if (!mockExtraction) return;

    addReport({
      title: `OCR Report: ${mockExtraction.reportType}`,
      source: 'Scanned Report',
      patientName: user.name,
      summary: mockExtraction.summary,
      extraction: mockExtraction,
    });

    navigate('/reports');
  };

  // 1. SCAN REPORT FLOW VIEW (`/reports/scan`)
  if (isScanRoute) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <button
            onClick={() => navigate('/reports')}
            className="p-2 bg-[#131C1E] hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              <FileUp className="w-5 h-5 text-teal-400" />
              {t('reports.scanTitle', 'OCR Medical Report Scanning')}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Upload blood reports, prescriptions, or discharge summaries for AI extraction
            </p>
          </div>
        </div>

        {/* STEP 1: UPLOAD ZONE */}
        {scanStep === 'upload' && (
          <div className="bento-card p-8 text-center space-y-6">
            <div className="border-2 border-dashed border-slate-700 hover:border-teal-500/80 rounded-2xl p-10 bg-[#0B0F0E] transition space-y-4 cursor-pointer relative">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileDrop}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/30 flex items-center justify-center mx-auto">
                <Upload className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-extrabold text-white">
                  {t('reports.uploadText', 'Drop medical file or click to browse')}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {t('reports.supportsText', 'Supports PDF, JPG, PNG up to 15MB')}
                </p>
              </div>
            </div>

            <div className="text-left bg-[#0B0F0E] p-4 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <p className="font-bold text-slate-300">💡 Quick Demo Option:</p>
              <p>Click the zone above to select any sample image/file or test document.</p>
            </div>
          </div>
        )}

        {/* STEP 2: PROCESSING SEQUENCE */}
        {scanStep === 'processing' && (
          <div className="bento-card p-12 text-center space-y-6 max-w-md mx-auto my-8">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-teal-500/20 border-t-teal-400 animate-spin" />
              <FileText className="w-6 h-6 text-teal-400" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-extrabold text-white animate-pulse">
                {processStatus}
              </p>
              <p className="text-xs text-slate-400 font-medium">
                Parsing clinical parameters and reference ranges...
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: RESULT VIEW */}
        {scanStep === 'result' && mockExtraction && (
          <div className="bento-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="bento-tag bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded text-[10px]">
                  {mockExtraction.reportType}
                </span>
                <h2 className="text-lg font-extrabold text-white mt-1">Extracted Report Summary</h2>
              </div>
              <p className="text-xs text-slate-400 font-mono">{mockExtraction.fileName}</p>
            </div>

            {/* Key Findings */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Key Findings</h3>
              <ul className="space-y-1.5 bg-[#0B0F0E] p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
                {mockExtraction.keyFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Abnormal Values Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Out-of-Range Parameters</h3>
              <div className="space-y-2">
                {mockExtraction.abnormalValues.map((ab, idx) => (
                  <div key={idx} className="p-3 bg-rose-950/20 border border-rose-800/50 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{ab.parameter}</p>
                      <p className="text-[10px] text-slate-400">Ref Range: {ab.referenceRange}</p>
                    </div>
                    <span className="font-black text-rose-400 bg-rose-950 px-2.5 py-1 rounded border border-rose-700 text-[10px]">
                      {ab.value} ({ab.status})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plain Language Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Plain-Language Summary</h3>
              <div className="bg-teal-950/40 border border-teal-500/30 p-4 rounded-xl text-xs text-teal-200 leading-relaxed font-medium">
                {mockExtraction.summary}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-3">
              <button
                onClick={handleSaveScannedReport}
                className="bg-teal-600 hover:bg-teal-500 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg shadow-teal-600/20 flex items-center gap-2 cursor-pointer"
              >
                <FolderArchive className="w-4 h-4 text-slate-950" />
                <span>Save to My Reports</span>
              </button>

              <button
                onClick={() => navigate('/symptom-checker')}
                className="bg-[#131C1E] hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-3 rounded-xl flex items-center gap-2 cursor-pointer transition"
              >
                <Stethoscope className="w-4 h-4 text-teal-400" />
                <span>Proceed to Symptom Triage</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. REPORT DETAIL VIEW (`/reports/:id`)
  if (id) {
    const report = reports.find((r) => r.id === id) || reports[0];

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <button
            onClick={() => navigate('/reports')}
            className="p-2 bg-[#131C1E] hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-white">{report.title}</h1>
              <span className="bento-tag bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded text-[10px]">
                {report.source}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Patient: {report.patientName} • Recorded on {new Date(report.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="bento-card p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Report Summary</h2>
            <div className="bg-[#0B0F0E] p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-medium">
              {report.summary}
            </div>
          </div>

          {report.triage && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Triage Level & Action</h2>
              <div className="p-4 bg-teal-950/40 border border-teal-500/30 rounded-xl text-xs space-y-1">
                <p className="font-extrabold text-teal-300">{report.triage.title}</p>
                <p className="text-slate-300">{report.triage.recommendedAction}</p>
              </div>
            </div>
          )}

          {report.extraction && (
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Extracted Lab Parameters</h2>
              <div className="space-y-2">
                {report.extraction.abnormalValues.map((ab, idx) => (
                  <div key={idx} className="p-3 bg-[#0B0F0E] border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{ab.parameter}</span>
                    <span className="font-mono text-teal-400 font-bold">{ab.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. REPORTS LIST VIEW (`/reports`)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FolderArchive className="w-6 h-6 text-teal-400" />
            {t('reports.title', 'My Health Reports')}
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {t('reports.subtitle', 'View past symptom evaluations and OCR scanned medical diagnostic records')}
          </p>
        </div>
        <button
          onClick={() => navigate('/reports/scan')}
          className="bg-teal-600 hover:bg-teal-500 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-teal-600/20 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>{t('reports.scanNew', 'Scan New Report')}</span>
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="bento-card p-5 flex flex-col justify-between space-y-4 hover:border-teal-500/40 transition"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-sm text-white">{rep.title}</h3>
                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{new Date(rep.timestamp).toLocaleDateString()}</span>
                  </p>
                </div>
                <span className="bento-tag bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded text-[9px]">
                  {rep.source}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-medium line-clamp-2">
                {rep.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end">
              <button
                onClick={() => navigate(`/reports/${rep.id}`)}
                className="text-xs font-bold text-teal-400 hover:text-teal-300 transition cursor-pointer"
              >
                {t('reports.viewReport', 'View Report')} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
