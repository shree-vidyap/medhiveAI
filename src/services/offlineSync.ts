import { Patient, QueueItem, Referral, TriageResult } from '../types';

const OFFLINE_PATIENTS_KEY = 'ruralcare_offline_patients';
const OFFLINE_QUEUE_KEY = 'ruralcare_offline_queue';
const OFFLINE_REFERRALS_KEY = 'ruralcare_offline_referrals';

export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export function saveOfflinePatient(patient: Patient) {
  const existing: Patient[] = JSON.parse(localStorage.getItem(OFFLINE_PATIENTS_KEY) || '[]');
  existing.push(patient);
  localStorage.setItem(OFFLINE_PATIENTS_KEY, JSON.stringify(existing));
}

export function saveOfflineQueueItem(item: QueueItem) {
  const existing: QueueItem[] = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
  existing.push(item);
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(existing));
}

export function saveOfflineReferral(referral: Referral) {
  const existing: Referral[] = JSON.parse(localStorage.getItem(OFFLINE_REFERRALS_KEY) || '[]');
  existing.push(referral);
  localStorage.setItem(OFFLINE_REFERRALS_KEY, JSON.stringify(existing));
}

export function getOfflineData() {
  const offlinePatients: Patient[] = JSON.parse(localStorage.getItem(OFFLINE_PATIENTS_KEY) || '[]');
  const offlineQueue: QueueItem[] = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
  const offlineReferrals: Referral[] = JSON.parse(localStorage.getItem(OFFLINE_REFERRALS_KEY) || '[]');
  return { offlinePatients, offlineQueue, offlineReferrals };
}

export function clearOfflineData() {
  localStorage.removeItem(OFFLINE_PATIENTS_KEY);
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
  localStorage.removeItem(OFFLINE_REFERRALS_KEY);
}

export async function syncOfflineDataToServer(): Promise<number> {
  const data = getOfflineData();
  const total = data.offlinePatients.length + data.offlineQueue.length + data.offlineReferrals.length;

  if (total === 0) return 0;

  try {
    const res = await fetch('/api/v1/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      clearOfflineData();
      return total;
    }
  } catch (err) {
    console.error('Offline sync failed:', err);
  }
  return 0;
}

// Client-side rule-based fallback when offline
export function offlineFallbackTriage(symptomsText: string, vitals?: any): TriageResult {
  const lower = symptomsText.toLowerCase();
  let level: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' = 'GREEN';
  let title = 'Routine Assessment (Offline Mode)';
  let reasoning = 'Offline preliminary evaluation based on standard rural triage safety guidelines.';
  const keyFactors: string[] = [];
  let recommendedAction = 'Please visit nearest PHC when operating.';

  if (
    lower.includes('chest pain') ||
    lower.includes('breathing') ||
    lower.includes('unconscious') ||
    lower.includes('ede novu') ||
    lower.includes('usiraadakke') ||
    (vitals?.spo2 && vitals.spo2 < 90)
  ) {
    level = 'RED';
    title = 'RED — Immediate Emergency Care';
    reasoning = 'Offline Triage detected severe red-flag symptoms (Chest pain / Breathlessness / Low Oxygen).';
    keyFactors.push('Red flag respiratory/cardiac indicator');
    recommendedAction = 'Proceed immediately to District Hospital / Tertiary ER. Do not wait for sync.';
  } else if (
    lower.includes('fever') ||
    lower.includes('jwara') ||
    lower.includes('headache') ||
    lower.includes('bleeding') ||
    (vitals?.temp && vitals.temp > 102)
  ) {
    level = 'ORANGE';
    title = 'ORANGE — Urgent Assessment Needed';
    reasoning = 'High fever or severe symptom onset identified.';
    keyFactors.push('Urgent physiological parameter');
    recommendedAction = 'Visit local PHC / CHC today for doctor consultation.';
  } else if (lower.includes('cough') || lower.includes('pain') || lower.includes('vomiting')) {
    level = 'YELLOW';
    title = 'YELLOW — Priority Non-Emergency';
    reasoning = 'Moderate symptoms requiring routine medical review.';
    keyFactors.push('Moderate symptom presentation');
    recommendedAction = 'Schedule evaluation at PHC.';
  }

  return {
    level,
    title,
    confidence: 80,
    reasoning,
    keyFactors: keyFactors.length ? keyFactors : ['Self-reported symptom text'],
    recommendedAction,
    timestamp: new Date().toISOString(),
    symptoms: [symptomsText],
    isOfflineAssessment: true,
  };
}
