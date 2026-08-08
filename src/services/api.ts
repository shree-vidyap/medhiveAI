import { Facility, GovernmentScheme, MobileClinic, Patient, QueueItem, Referral, TransportRequest, TriageResult } from '../types';
import { isOnline, offlineFallbackTriage, saveOfflinePatient, saveOfflineQueueItem, saveOfflineReferral } from './offlineSync';

export async function registerPatient(patientData: Omit<Patient, 'id' | 'createdAt'>): Promise<Patient> {
  if (!isOnline()) {
    const offlinePatient: Patient = {
      id: `RC-2026-OFFLINE-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      isOfflineCreated: true,
      ...patientData,
    };
    saveOfflinePatient(offlinePatient);
    return offlinePatient;
  }

  const res = await fetch('/api/v1/patients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData),
  });
  if (!res.ok) throw new Error('Failed to register patient');
  return res.json();
}

export async function fetchPatients(): Promise<Patient[]> {
  try {
    const res = await fetch('/api/v1/patients');
    if (!res.ok) throw new Error('Failed to fetch patients');
    return res.json();
  } catch (err) {
    return [];
  }
}

export async function predictTriage(payload: {
  symptomsText: string;
  vitals?: any;
  patientAge?: number;
  gender?: string;
  patientId?: string;
  patientName?: string;
}): Promise<{ triage: TriageResult; referral?: any; queueItem?: QueueItem }> {
  if (!isOnline()) {
    const fallbackTriage = offlineFallbackTriage(payload.symptomsText, payload.vitals);
    const offlineItem: QueueItem = {
      id: `q-offline-${Date.now()}`,
      patientId: payload.patientId || 'RC-2026-GUEST',
      patientName: payload.patientName || 'Patient',
      age: payload.patientAge || 40,
      gender: payload.gender || 'unknown',
      symptoms: [payload.symptomsText],
      triageLevel: fallbackTriage.level,
      waitingTimeMins: 0,
      priorityScore: fallbackTriage.level === 'RED' ? 95 : 40,
      status: 'WAITING',
      registeredAt: new Date().toISOString(),
    };
    saveOfflineQueueItem(offlineItem);

    return {
      triage: fallbackTriage,
      queueItem: offlineItem,
    };
  }

  const res = await fetch('/api/v1/triage/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Triage service error');
  return res.json();
}

export async function processReport(fileData: string, fileType: string) {
  const res = await fetch('/api/v1/triage/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileData, fileType }),
  });
  if (!res.ok) throw new Error('Report processing failed');
  return res.json();
}

export async function fetchFacilities(): Promise<Facility[]> {
  const res = await fetch('/api/v1/facilities/nearby');
  if (!res.ok) throw new Error('Failed to fetch facilities');
  return res.json();
}

export async function updateFacilityCapacity(id: string, updates: Partial<Facility>): Promise<Facility> {
  const res = await fetch(`/api/v1/facilities/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update facility');
  return res.json();
}

export async function fetchQueue(): Promise<QueueItem[]> {
  const res = await fetch('/api/v1/queue');
  if (!res.ok) throw new Error('Failed to fetch queue');
  return res.json();
}

export async function updateQueueStatus(id: string, updates: Partial<QueueItem>): Promise<QueueItem> {
  const res = await fetch(`/api/v1/queue/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update queue item');
  return res.json();
}

export async function fetchReferrals(): Promise<Referral[]> {
  const res = await fetch('/api/v1/referrals');
  if (!res.ok) throw new Error('Failed to fetch referrals');
  return res.json();
}

export async function createReferral(payload: Omit<Referral, 'id' | 'createdAt' | 'updatedAt' | 'history'>): Promise<Referral> {
  if (!isOnline()) {
    const offlineRef: Referral = {
      id: `REF-2026-OFFLINE-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'SENT',
      history: [{ status: 'SENT', timestamp: new Date().toISOString(), note: 'Saved offline' }],
      ...payload,
    };
    saveOfflineReferral(offlineRef);
    return offlineRef;
  }

  const res = await fetch('/api/v1/referrals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create referral');
  return res.json();
}

export async function patchReferralStatus(id: string, status: string, note?: string): Promise<Referral> {
  const res = await fetch(`/api/v1/referrals/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, note }),
  });
  if (!res.ok) throw new Error('Failed to update referral status');
  return res.json();
}

export async function fetchSchemes(): Promise<GovernmentScheme[]> {
  const res = await fetch('/api/v1/schemes');
  if (!res.ok) throw new Error('Failed to fetch schemes');
  return res.json();
}

export async function checkSchemeEligibility(profile: any): Promise<GovernmentScheme[]> {
  const res = await fetch('/api/v1/schemes/check-eligibility', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error('Failed to check eligibility');
  return res.json();
}

export async function fetchMobileClinics(): Promise<MobileClinic[]> {
  const res = await fetch('/api/v1/mobile-clinics/nearby');
  if (!res.ok) throw new Error('Failed to fetch mobile clinics');
  return res.json();
}

export async function fetchTransports(): Promise<TransportRequest[]> {
  const res = await fetch('/api/v1/transport');
  if (!res.ok) throw new Error('Failed to fetch transport requests');
  return res.json();
}

export async function requestTransport(payload: any): Promise<TransportRequest> {
  const res = await fetch('/api/v1/transport/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to request transport');
  return res.json();
}

export async function sendChatMessage(message: string, history: any[], language: string) {
  const res = await fetch('/api/v1/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, language }),
  });
  if (!res.ok) throw new Error('Chat service error');
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch('/api/v1/dashboard/analytics');
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}
