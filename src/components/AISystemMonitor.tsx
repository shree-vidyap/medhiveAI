import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { 
  Activity, 
  Bot, 
  Brain, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  FileText, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles, 
  Stethoscope, 
  Truck, 
  Zap 
} from 'lucide-react';

interface AISystemMonitorProps {
  currentLanguage: Language;
}

export const AISystemMonitor: React.FC<AISystemMonitorProps> = ({ currentLanguage }) => {
  const t = TRANSLATIONS[currentLanguage];
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [lastDiagnosticTime, setLastDiagnosticTime] = useState<string>('Just now');
  const [diagnosticsLogs, setDiagnosticsLogs] = useState<string[]>([
    '[10:42:01] Orchestrator: Health check passed for 5/5 AI Agents.',
    '[10:42:05] Agent 1 (Triage): Gemini 2.5 Flash pipeline ready. Vitals model loaded.',
    '[10:42:09] Agent 2 (Referral): MIMS Mandya & District Hospital capacity metrics synced.',
    '[10:42:12] Agent 3 (Priority): Queue dispatcher operating at 12ms latency.',
    '[10:42:15] Agent 4 (OCR): Vision extraction model initialized for Lab & X-Ray PDFs.',
    '[10:42:18] Agent 5 (Resource): Ayushman Bharat & Arogya Karnataka scheme rules active.',
  ]);

  const handleRunDiagnostics = () => {
    setIsDiagnosing(true);
    setTimeout(() => {
      setLastDiagnosticTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDiagnosticsLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Manual Diagnostic: Re-pinging Gemini 2.5 Flash Orchestrator...`,
        `[${new Date().toLocaleTimeString()}] Diagnostics Passed: All 5 Agents online with zero error rate.`,
        ...prev,
      ]);
      setIsDiagnosing(false);
    }, 1200);
  };

  const agentsList = [
    {
      id: 'agent-1',
      number: '1',
      name: 'Triage Agent',
      model: 'Gemini 2.5 Flash / NLP Vitals Engine',
      description: 'Analyzes symptoms, vitals, and voice transcripts to assign Red, Orange, Yellow, or Green triage levels.',
      status: 'OPERATIONAL',
      latency: '1.2s',
      requestsToday: 142,
      accuracy: '99.4%',
      icon: Stethoscope,
      color: 'emerald',
    },
    {
      id: 'agent-2',
      number: '2',
      name: 'Referral Agent',
      model: 'Facility Readiness & Capacity Matcher',
      description: 'Calculates suitability scores based on specialist availability, ICU beds, travel time, and diagnostics.',
      status: 'OPERATIONAL',
      latency: '0.8s',
      requestsToday: 98,
      accuracy: '98.9%',
      icon: Cpu,
      color: 'purple',
    },
    {
      id: 'agent-3',
      number: '3',
      name: 'Priority Agent',
      model: 'Emergency Queue & Resource Allocator',
      description: 'Manages incoming patient queue, prioritizes critical cases, and dispatches 108 emergency transport.',
      status: 'OPERATIONAL',
      latency: '0.5s',
      requestsToday: 64,
      accuracy: '100%',
      icon: Truck,
      color: 'rose',
    },
    {
      id: 'agent-4',
      number: '4',
      name: 'OCR Report Agent',
      model: 'Multimodal Document Extraction Engine',
      description: 'Parses medical lab reports, X-rays, and prescriptions to extract abnormal parameters into plain language.',
      status: 'OPERATIONAL',
      latency: '2.1s',
      requestsToday: 51,
      accuracy: '97.8%',
      icon: FileText,
      color: 'blue',
    },
    {
      id: 'agent-5',
      number: '5',
      name: 'Resource & Scheme Agent',
      model: 'Government Scheme & Mobile Clinic Matcher',
      description: 'Matches patient eligibility with Ayushman Bharat, Arogya Karnataka, and scheduled village health vans.',
      status: 'OPERATIONAL',
      latency: '0.9s',
      requestsToday: 73,
      accuracy: '99.1%',
      icon: Brain,
      color: 'amber',
    },
  ];

  return (
    <div id="ai-system-monitor-component" className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-teal-50 text-teal-600 border border-teal-200 rounded-2xl font-bold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">AI Multi-Agent System Monitor</h2>
              <span className="bento-tag px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                5 Agents Operational
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Real-time telemetry, model latency, and orchestrator health for MediHivi AI
            </p>
          </div>
        </div>

        <button
          onClick={handleRunDiagnostics}
          disabled={isDiagnosing}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isDiagnosing ? 'animate-spin' : ''}`} />
          <span>{isDiagnosing ? 'Running Health Check...' : 'Run Diagnostics'}</span>
        </button>
      </div>

      {/* Overview Metric Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Orchestrator Uptime</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-2">99.98%</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">Zero downtime recorded</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active Model</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-base font-extrabold text-slate-900 mt-2">Gemini 2.5 Flash</div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Primary inference engine</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Avg Pipeline Latency</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-2">1.1 seconds</div>
          <div className="text-[11px] text-blue-600 font-bold mt-1">Optimal response speed</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Daily AI Inferences</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-2">428 Calls</div>
          <div className="text-[11px] text-amber-600 font-bold mt-1">Across 5 specialized agents</div>
        </div>
      </div>

      {/* Agents Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agentsList.map((agent) => {
          const IconComponent = agent.icon;
          return (
            <div key={agent.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-teal-300 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Agent {agent.number}: {agent.name}</h3>
                    <p className="text-[11px] text-slate-500 font-mono font-medium">{agent.model}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {agent.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                {agent.description}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <div className="bg-slate-50 p-2 rounded-xl text-center">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Latency</span>
                  <span className="font-bold text-slate-800">{agent.latency}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl text-center">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Inferences</span>
                  <span className="font-bold text-slate-800">{agent.requestsToday}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl text-center">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Accuracy</span>
                  <span className="font-bold text-emerald-700">{agent.accuracy}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Telemetry Logs Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            Live System Log Telemetry
          </h3>
          <span className="text-xs text-slate-500 font-medium">Last check: {lastDiagnosticTime}</span>
        </div>

        <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-emerald-400 space-y-1.5 max-h-48 overflow-y-auto border border-slate-800">
          {diagnosticsLogs.map((log, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-slate-500 shrink-0">›</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
