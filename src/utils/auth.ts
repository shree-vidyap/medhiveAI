import { UserRole } from '../types';

export interface UserProfile {
  id: string;
  name: string;
  emailOrPhone: string;
  role: UserRole;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  district?: string;
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  termsAccepted: boolean;
  onboardingCompleted?: boolean;
}

const STORAGE_KEY_TOKEN = 'medihivi_auth_token';
const STORAGE_KEY_USER = 'medihivi_auth_user';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_TOKEN);
  } catch (e) {
    return null;
  }
}

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function saveAuthSession(token: string, user: UserProfile) {
  try {
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save auth session:', e);
  }
}

export function clearAuthSession() {
  try {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
  } catch (e) {
    console.error('Failed to clear auth session:', e);
  }
}

export function getInitialUser(): UserProfile {
  const stored = getStoredUser();
  if (stored) return stored;

  return {
    id: 'usr-default-101',
    name: 'Basavaraju M',
    emailOrPhone: 'basavaraju@medihivi.org',
    role: 'PATIENT',
    dob: '1962-04-12',
    gender: 'male',
    district: 'Mandya',
    bloodGroup: 'O+',
    allergies: ['Penicillin'],
    chronicConditions: ['Hypertension'],
    currentMedications: ['Amlodipine 5mg'],
    emergencyContactName: 'Shivanna M (Son)',
    emergencyContactPhone: '+91 98450 12345',
    address: 'Tubinakere Village, Mandya Taluk',
    termsAccepted: true,
    onboardingCompleted: true,
  };
}
