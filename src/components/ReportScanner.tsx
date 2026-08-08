import React, { useState } from 'react';
import { Language, MedicalReportExtraction } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { processReport } from '../services/api';
import { 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck, 
  FileSearch, 
  FileText, 
  Image as ImageIcon, 
  Loader2, 
  Upload, 
  X 
} from 'lucide-react';

interface ReportScannerProps {
  currentLanguage: Language;
  onTriageFromReport: (reportResult: any) => void;
}

export const ReportScanner: React.FC<ReportScannerProps> = ({ currentLanguage, onTriageFromReport }) => {
  const t = TRANSLATIONS[currentLanguage];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>('image/png');
  const [loading, setLoading] = useState<boolean>(false);
  const [extractionResult, setExtractionResult] = useState<MedicalReportExtraction | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileType(file.type || 'image/png');
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setExtractionResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRunOCR = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      const response = await processReport(selectedImage, fileType);
      setExtractionResult(response.extraction);
      if (onTriageFromReport) {
        onTriageFromReport(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Sample quick report templates for instant testing
  const loadSampleReport = (type: 'blood' | 'xray') => {
    if (type === 'blood') {
      setSelectedImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
      setFileType('image/png');
      setExtractionResult({
        id: `rep-${Date.now()}`,
        fileName: 'Sample_Blood_Profile.png',
        fileType: 'Blood Test',
        extractedText: 'Hemoglobin: 9.2 g/dL (Low), Fasting Glucose: 162 mg/dL (High), Platelets: 210,000 /uL',
        reportType: 'Blood Test',
        keyFindings: [
          'Moderate Anemia (Hb 9.2 g/dL)',
          'Elevated Fasting Blood Sugar (162 mg/dL)',
          'Platelet count within normal limits'
        ],
        abnormalValues: [
          { parameter: 'Hemoglobin (Hb)', value: '9.2 g/dL', referenceRange: '12.0 - 15.0', status: 'LOW' },
          { parameter: 'Fasting Blood Glucose', value: '162 mg/dL', referenceRange: '70 - 100', status: 'HIGH' }
        ],
        summary: 'Blood test indicates iron deficiency anemia along with uncontrolled blood sugar level.',
        triageImpact: 'Requires dietary counseling, iron supplementation, and diabetes physician review.',
        uploadedAt: new Date().toISOString()
      });
    } else {
      setSelectedImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
      setFileType('image/png');
      setExtractionResult({
        id: `rep-${Date.now()}`,
        fileName: 'Chest_XRay_Report.png',
        fileType: 'X-Ray / Diagnostic',
        extractedText: 'X-Ray Chest PA View: Infiltration in right lower lung zone. Cardiomegaly noted.',
        reportType: 'X-Ray / Diagnostic',
        keyFindings: [
          'Right lower lobe pulmonary infiltration suggestive of pneumonia',
          'Mild cardiomegaly (enlarged heart shadow)'
        ],
        abnormalValues: [
          { parameter: 'Lung Field', value: 'Right Lower Infiltrate', referenceRange: 'Clear', status: 'CRITICAL' }
        ],
        summary: 'Radiology findings indicate localized lung infection / pneumonia requiring antibiotic treatment and pulmonology follow-up.',
        triageImpact: 'Urgent ORANGE triage due to lower respiratory infection risk.',
        uploadedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div id="report-scanner-component" className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-2xl">
            <FileSearch className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{t.scanReport}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Agent 4: AI Medical Report OCR & Multimodal Document Extraction Engine
            </p>
          </div>
        </div>
      </div>

      {/* Main Upload Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl p-8 text-center bg-slate-50/50 transition cursor-pointer">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            id="report-file-input"
            className="hidden"
          />
          <label htmlFor="report-file-input" className="cursor-pointer flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{t.uploadReport}</p>
              <p className="text-xs text-slate-500 mt-1">Supports Blood Tests, Prescriptions, X-Rays, Discharge Summaries (PNG, JPG, PDF)</p>
            </div>
          </label>
        </div>

        {/* Quick Sample Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
          <span className="font-medium">Or test with pre-configured lab reports:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadSampleReport('blood')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl border border-slate-200 transition cursor-pointer"
            >
              Sample Blood Test
            </button>
            <button
              onClick={() => loadSampleReport('xray')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl border border-slate-200 transition cursor-pointer"
            >
              Sample X-Ray Report
            </button>
          </div>
        </div>

        {selectedImage && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between bg-teal-50/80 p-3.5 rounded-xl border border-teal-200">
              <div className="flex items-center gap-2 text-xs text-teal-900 font-medium">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Medical document loaded and ready for extraction</span>
              </div>
              <button
                onClick={handleRunOCR}
                disabled={loading}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
                <span>{loading ? 'Running Multimodal OCR...' : 'Run AI Report Scanner'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Extraction Output Card */}
      {extractionResult && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 animate-scale-up">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                {extractionResult.reportType}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">Medical Report Extraction Summary</h3>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <button
                type="button"
                onClick={() => {
                  setExtractionResult(null);
                  setSelectedImage(null);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1 transition cursor-pointer"
                title="Close report"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Plain Language Clinical Summary</h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">{extractionResult.summary}</p>
          </div>

          {/* Key Findings List */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Key Extracted Findings</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {extractionResult.keyFindings.map((finding, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-800 font-medium flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                  <span>{finding}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Abnormal Values Table */}
          {extractionResult.abnormalValues && extractionResult.abnormalValues.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Abnormal Lab Parameters</h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Parameter</th>
                      <th className="p-3">Extracted Value</th>
                      <th className="p-3">Reference Range</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {extractionResult.abnormalValues.map((v, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-900">{v.parameter}</td>
                        <td className="p-3 font-bold text-amber-700">{v.value}</td>
                        <td className="p-3 text-slate-500">{v.referenceRange}</td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              v.status === 'CRITICAL'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : v.status === 'HIGH' || v.status === 'LOW'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {v.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900">
            <span className="font-bold block">Triage Impact:</span>
            {extractionResult.triageImpact}
          </div>

          {/* Action Button */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-500 font-medium">
              Report extracted successfully. Proceed to clinical care plan.
            </div>
            <button
              onClick={() => onTriageFromReport && onTriageFromReport(extractionResult)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-sm cursor-pointer"
            >
              <span>Continue to AI Assessment</span>
              <FileCheck className="w-4 h-4 text-purple-200" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
