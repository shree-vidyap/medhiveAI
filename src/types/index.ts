export type Language = 'en' | 'kn' | 'hi';

export type UserRole = 'PATIENT' | 'HEALTH_WORKER' | 'DOCTOR' | 'HOSPITAL_ADMIN' | 'SUPER_ADMIN';

export type TriageLevel = 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';

export interface PatientVitals {
  heartRate?: number; // bpm
  bloodPressureSys?: number; // mmHg
  bloodPressureDia?: number; // mmHg
  spo2?: number; // %
  temperature?: number; // °F
  respiratoryRate?: number;
}

export interface Patient {
  id: string; // e.g. RC-2026-000124
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  village: string;
  district: string;
  preferredLanguage: Language;
  emergencyContact: string;
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  createdAt: string;
  isOfflineCreated?: boolean;
}

export interface TriageResult {
  level: TriageLevel;
  title: string;
  confidence: number; // 0 - 100
  reasoning: string;
  keyFactors: string[];
  recommendedAction: string;
  timestamp: string;
  patientId?: string;
  symptoms: string[];
  isOfflineAssessment?: boolean;
}

export interface Facility {
  id: string;
  name: string;
  type: 'PHC' | 'CHC' | 'District Hospital' | 'Medical College' | 'Private Hospital' | 'Mobile Clinic';
  district: string;
  address: string;
  distanceKm: number;
  travelTimeMins: number;
  phone: string;
  operatingStatus: 'OPEN' | 'BUSY' | 'CRITICAL' | 'CLOSED';
  beds: {
    total: number;
    available: number;
  };
  icuBeds: {
    total: number;
    available: number;
  };
  emergencyAvailable: boolean;
  specialists: string[];
  diagnostics: {
    xray: boolean;
    ct: boolean;
    mri: boolean;
    lab: boolean;
    ultrasound: boolean;
  };
  suitabilityScore?: number; // 0 - 100
  suitabilityBreakdown?: {
    specialistMatch: number;
    emergencyMatch: number;
    bedAvailability: number;
    diagnosticMatch: number;
    distanceScore: number;
  };
}

export type ReferralStatus = 
  | 'SENT' 
  | 'ACCEPTED' 
  | 'REJECTED' 
  | 'IN_TRANSIT' 
  | 'ARRIVED' 
  | 'UNDER_CARE' 
  | 'COMPLETED';

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  triageLevel: TriageLevel;
  referringFacility: string;
  targetFacilityId: string;
  targetFacilityName: string;
  requiredSpecialty: string;
  reason: string;
  status: ReferralStatus;
  createdAt: string;
  updatedAt: string;
  history: {
    status: ReferralStatus;
    timestamp: string;
    note?: string;
  }[];
  transportRequested?: boolean;
}

export interface TransportRequest {
  id: string;
  referralId: string;
  patientName: string;
  pickupLocation: string;
  destinationFacility: string;
  vehicleType: 'Ambulance - Basic' | 'Ambulance - ICU' | 'PHC Transport' | '108 Emergency';
  status: 'REQUESTED' | 'ASSIGNED' | 'ON_THE_WAY' | 'ARRIVED' | 'COMPLETED';
  etaMins: number;
  driverPhone: string;
  vehicleNumber: string;
  requestedAt: string;
}

export interface QueueItem {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  symptoms: string[];
  triageLevel: TriageLevel;
  waitingTimeMins: number;
  priorityScore: number; // Higher is urgent
  assignedWorker?: string;
  status: 'WAITING' | 'IN_CONSULTATION' | 'REFERRED' | 'COMPLETED';
  registeredAt: string;
}

export interface MedicalReportExtraction {
  id: string;
  patientId?: string;
  fileName: string;
  fileType: string;
  extractedText: string;
  reportType: 'Blood Test' | 'X-Ray / Diagnostic' | 'Prescription' | 'Discharge Summary' | 'General Lab';
  keyFindings: string[];
  abnormalValues: { parameter: string; value: string; referenceRange: string; status: 'HIGH' | 'LOW' | 'CRITICAL' | 'NORMAL' }[];
  summary: string;
  triageImpact: string;
  uploadedAt: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  kannadaName?: string;
  hindiName?: string;
  description: string;
  targetBeneficiaries: string;
  benefits: string[];
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  howToApply: string;
  officialSourceUrl: string;
  lastVerifiedDate: string;
}

export interface MobileClinic {
  id: string;
  name: string;
  district: string;
  village: string;
  nextVisitDate: string;
  visitTiming: string;
  servicesProvided: string[];
  doctorSpecialty: string;
  contactNumber: string;
  status: 'SCHEDULED' | 'ON_SITE' | 'COMPLETED';
}

export interface DoctorReview {
  reviewedBy: string;
  confirmedTriageLevel: TriageLevel;
  clinicalNotes: string;
  recommendedSpecialist: string;
  diagnosticOrders: string[];
  reviewedAt: string;
}

export interface CarePlan {
  summary: string;
  instructions: string[];
  diagnosticTests: string[];
  followUpDate: string;
  referralRecommended: boolean;
  createdAt: string;
}

export interface PatientCase {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  isPregnant?: boolean;
  hasBplCard?: boolean;
  symptomsText: string;
  vitals?: PatientVitals;
  reportExtraction?: MedicalReportExtraction;
  triageResult?: TriageResult & { recommendedSpecialist?: string };
  doctorReview?: DoctorReview;
  carePlan?: CarePlan;
  selectedFacility?: Facility;
  referral?: Referral;
  transport?: TransportRequest;
  workflowStep: 'symptoms' | 'ai-assessment' | 'doctor-review' | 'care-plan' | 'referral' | 'facility' | 'transport' | 'schemes' | 'receipt';
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'EMERGENCY' | 'REFERRAL' | 'SYNC' | 'SYSTEM';
  timestamp: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  audioUrl?: string;
  timestamp: string;
  language?: Language;
}
