import React, { useState, useEffect } from 'react';
import { Language, QueueItem, TriageLevel } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { TriageBadge } from './TriageBadge';
import { fetchQueue, updateQueueStatus } from '../services/api';
import { 
  CheckCircle, 
  Clock, 
  Filter, 
  RefreshCw, 
  Search, 
  Send, 
  User, 
  UserCheck, 
  Users 
} from 'lucide-react';

interface PatientQueueViewProps {
  currentLanguage: Language;
}

export const PatientQueueView: React.FC<PatientQueueViewProps> = ({ currentLanguage }) => {
  const t = TRANSLATIONS[currentLanguage];

  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const data = await fetchQueue();
      setQueueItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'WAITING' | 'IN_CONSULTATION' | 'REFERRED' | 'COMPLETED') => {
    try {
      const updated = await updateQueueStatus(id, { status });
      setQueueItems((prev) => prev.map((q) => (q.id === id ? updated : q)));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = queueItems.filter((q) => filterLevel === 'ALL' || q.triageLevel === filterLevel);

  return (
    <div id="patient-queue-component" className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t.patientQueue}</h2>
            <p className="text-xs text-slate-400">Agent 3: Dynamic Patient Queue & Urgency Prioritization Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Triage Urgencies</option>
            <option value="RED">RED — Emergency</option>
            <option value="ORANGE">ORANGE — Urgent</option>
            <option value="YELLOW">YELLOW — Priority</option>
            <option value="GREEN">GREEN — Routine</option>
          </select>

          <button
            onClick={loadQueue}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Patient Details</th>
                <th className="p-3.5">Triage Level</th>
                <th className="p-3.5">Key Symptoms</th>
                <th className="p-3.5">Wait Time</th>
                <th className="p-3.5">Queue Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  {/* Rank */}
                  <td className="p-3.5 font-bold">
                    <span className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-white">
                      #{index + 1}
                    </span>
                  </td>

                  {/* Patient Name & Age */}
                  <td className="p-3.5">
                    <div className="font-bold text-white text-sm">{item.patientName}</div>
                    <div className="text-[11px] text-slate-400">ID: {item.patientId} • {item.age} yrs ({item.gender})</div>
                  </td>

                  {/* Triage Badge */}
                  <td className="p-3.5">
                    <TriageBadge level={item.triageLevel} size="sm" />
                  </td>

                  {/* Symptoms */}
                  <td className="p-3.5 max-w-xs truncate text-slate-300">
                    {item.symptoms.join(', ')}
                  </td>

                  {/* Wait Time */}
                  <td className="p-3.5">
                    <div className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.waitingTimeMins} mins</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-1 rounded-md font-bold text-[10px] ${
                        item.status === 'IN_CONSULTATION'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse'
                          : item.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right space-x-1">
                    {item.status === 'WAITING' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'IN_CONSULTATION')}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg"
                      >
                        Start Consultation
                      </button>
                    )}

                    {item.status === 'IN_CONSULTATION' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'COMPLETED')}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
