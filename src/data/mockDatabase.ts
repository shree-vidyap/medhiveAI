import { Facility, GovernmentScheme, MobileClinic, Patient, QueueItem, Referral, TransportRequest } from '../types';

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac-001',
    name: 'Mandya Institute of Medical Sciences (MIMS)',
    type: 'Medical College',
    district: 'Mandya',
    address: 'Bengaluru-Mysuru Highway, Mandya',
    distanceKm: 7.2,
    travelTimeMins: 18,
    phone: '+91-8232-220055',
    operatingStatus: 'OPEN',
    beds: { total: 450, available: 38 },
    icuBeds: { total: 40, available: 5 },
    emergencyAvailable: true,
    specialists: ['Cardiology', 'Neurology', 'Pulmonology', 'Pediatrics', 'General Surgery', 'Orthopedics', 'OB-GYN'],
    diagnostics: { xray: true, ct: true, mri: true, lab: true, ultrasound: true }
  },
  {
    id: 'fac-002',
    name: 'Mandya District General Hospital',
    type: 'District Hospital',
    district: 'Mandya',
    address: 'Near Bus Stand, Mandya Town',
    distanceKm: 5.4,
    travelTimeMins: 14,
    phone: '+91-8232-221122',
    operatingStatus: 'OPEN',
    beds: { total: 200, available: 19 },
    icuBeds: { total: 15, available: 2 },
    emergencyAvailable: true,
    specialists: ['General Medicine', 'Pediatrics', 'General Surgery', 'OB-GYN', 'Orthopedics'],
    diagnostics: { xray: true, ct: true, mri: false, lab: true, ultrasound: true }
  },
  {
    id: 'fac-003',
    name: 'Maddur Community Health Centre (CHC)',
    type: 'CHC',
    district: 'Mandya',
    address: 'Main Road, Maddur',
    distanceKm: 12.8,
    travelTimeMins: 25,
    phone: '+91-8232-234100',
    operatingStatus: 'OPEN',
    beds: { total: 50, available: 12 },
    icuBeds: { total: 2, available: 0 },
    emergencyAvailable: true,
    specialists: ['General Medicine', 'Pediatrics', 'OB-GYN'],
    diagnostics: { xray: true, ct: false, mri: false, lab: true, ultrasound: true }
  },
  {
    id: 'fac-004',
    name: 'Srirangapatna Primary Health Centre (PHC)',
    type: 'PHC',
    district: 'Mandya',
    address: 'Fort Area, Srirangapatna',
    distanceKm: 18.5,
    travelTimeMins: 32,
    phone: '+91-8232-252044',
    operatingStatus: 'OPEN',
    beds: { total: 12, available: 6 },
    icuBeds: { total: 0, available: 0 },
    emergencyAvailable: false,
    specialists: ['General Medicine'],
    diagnostics: { xray: false, ct: false, mri: false, lab: true, ultrasound: false }
  },
  {
    id: 'fac-005',
    name: 'Mysore Medical College & Research Hospital (KR Hospital)',
    type: 'Medical College',
    district: 'Mysuru',
    address: 'Irwin Road, Mysuru',
    distanceKm: 42.0,
    travelTimeMins: 55,
    phone: '+91-821-2520018',
    operatingStatus: 'OPEN',
    beds: { total: 1050, available: 82 },
    icuBeds: { total: 80, available: 12 },
    emergencyAvailable: true,
    specialists: ['Cardiology', 'Neurology', 'Nephrology', 'Pulmonology', 'Oncology', 'Pediatrics', 'Gastroenterology'],
    diagnostics: { xray: true, ct: true, mri: true, lab: true, ultrasound: true }
  },
  {
    id: 'fac-006',
    name: 'Ramanagara District Hospital',
    type: 'District Hospital',
    district: 'Ramanagara',
    address: 'BM Road, Ramanagara',
    distanceKm: 34.0,
    travelTimeMins: 45,
    phone: '+91-80-27271234',
    operatingStatus: 'OPEN',
    beds: { total: 150, available: 22 },
    icuBeds: { total: 10, available: 3 },
    emergencyAvailable: true,
    specialists: ['General Medicine', 'Pediatrics', 'Orthopedics', 'OB-GYN'],
    diagnostics: { xray: true, ct: true, mri: false, lab: true, ultrasound: true }
  }
];

export const INITIAL_SCHEMES: GovernmentScheme[] = [
  {
    id: 'scheme-01',
    name: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
    kannadaName: 'ಆಯುಷ್ಮಾನ್ ಭಾರತ್ - ಪಿಎಂ-ಜೆಎವೈ',
    hindiName: 'आयुष्मान भारत - पीएम-जय',
    description: 'Provides health coverage of up to ₹5 Lakhs per family per year for secondary and tertiary care hospitalization to over 12 crore poor and vulnerable families.',
    targetBeneficiaries: 'Low-income households, BPL card holders, SECC 2011 identified families.',
    benefits: [
      'Up to ₹5,00,000 annual health cover per family',
      'Cashless and paperless access to healthcare services',
      'Covers pre-existing conditions from Day 1',
      'Over 1,900 medical procedures covered'
    ],
    eligibilityCriteria: [
      'Household identified under BPL / SECC database',
      'Valid Ration Card (BPL / Antyodaya)',
      'Aadhaar Card linked mobile number'
    ],
    requiredDocuments: [
      'Aadhaar Card',
      'BPL Ration Card / Household ID',
      'Active Mobile Number'
    ],
    howToApply: 'Visit the nearest Ayushman Mitra at any impaneled government or private hospital, or check online on pmjay.gov.in using your Aadhaar/Ration card.',
    officialSourceUrl: 'https://pmjay.gov.in',
    lastVerifiedDate: '2026-08-01'
  },
  {
    id: 'scheme-02',
    name: 'Arogya Karnataka Scheme (AB-ArK)',
    kannadaName: 'ಆರೋಗ್ಯ ಕರ್ನಾಟಕ ಯೋಜನೆ',
    hindiName: 'आरोग्य कर्नाटक योजना',
    description: 'Karnataka State universal health coverage scheme integrated with PM-JAY providing financial assistance for simple, complex, and emergency procedures.',
    targetBeneficiaries: 'All residents of Karnataka (Eligible Category - BPL gets free coverage up to ₹5 Lakhs; General Category gets 30% co-payment support).',
    benefits: [
      'Free secondary and tertiary care for BPL card holders',
      'Covers up to ₹1.5 Lakhs to ₹5 Lakhs per year',
      'Includes emergency transport assistance',
      'Covers major surgical and ICU treatments'
    ],
    eligibilityCriteria: [
      'Resident of Karnataka State',
      'Possess valid Karnataka Ration Card (BPL or APL)'
    ],
    requiredDocuments: [
      'Aadhaar Card of patient',
      'Karnataka BPL/APL Ration Card',
      'Referral slip from government PHC/CHC'
    ],
    howToApply: 'Obtain referral from nearest Government PHC/CHC, then present card at impaneled referral hospital.',
    officialSourceUrl: 'https://arogya.karnataka.gov.in',
    lastVerifiedDate: '2026-08-01'
  },
  {
    id: 'scheme-03',
    name: 'Pradhan Mantri Bharatiya Janaushadhi Pariyojana (PMBJP)',
    kannadaName: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಭಾರತೀಯ ಜನೌಷಧಿ ಪರಿಯೋಜನೆ',
    hindiName: 'प्रधानमंत्री भारतीय जनऔषधि परियोजना',
    description: 'Provides high-quality generic medicines at affordable prices (50% to 90% cheaper than branded drugs) through dedicated Jan Aushadhi Kendras.',
    targetBeneficiaries: 'All citizens seeking quality generic medicines.',
    benefits: [
      '50% - 90% discount on 2,000+ quality generic medicines',
      'Covers chronic conditions (Diabetes, Hypertension, Heart disease)',
      'High standard WHO-GMP quality tested'
    ],
    eligibilityCriteria: [
      'Open to all citizens without income bar',
      'Valid prescription required for scheduled drugs'
    ],
    requiredDocuments: [
      'Doctor Prescription'
    ],
    howToApply: 'Visit any Jan Aushadhi Kendra with your doctor prescription.',
    officialSourceUrl: 'https://janaushadhi.gov.in',
    lastVerifiedDate: '2026-08-01'
  },
  {
    id: 'scheme-04',
    name: 'Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)',
    kannadaName: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಸುರಕ್ಷಿತ ಮಾತೃತ್ವ ಅಭಿಯಾನ',
    hindiName: 'प्रधानमंत्री सुरक्षित मातृत्व अभियान',
    description: 'Ensures free, comprehensive, and quality antenatal care (ANC) for pregnant women on the 9th day of every month in government healthcare facilities.',
    targetBeneficiaries: 'Pregnant women in their 2nd and 3rd trimesters.',
    benefits: [
      'Free blood, urine, ultrasound, and specialist checkups',
      'Free iron & folic acid supplementation',
      'Early identification of high-risk pregnancies'
    ],
    eligibilityCriteria: [
      'All pregnant women registered at PHC/CHC'
    ],
    requiredDocuments: [
      'Mother and Child Protection (MCP) Card / RCH ID',
      'Aadhaar Card'
    ],
    howToApply: 'Visit any government PHC/CHC on the 9th of any month.',
    officialSourceUrl: 'https://pmsma.nhp.gov.in',
    lastVerifiedDate: '2026-08-01'
  }
];

export const INITIAL_MOBILE_CLINICS: MobileClinic[] = [
  {
    id: 'mc-101',
    name: 'Sanjeevini Mobile Health Express - Mandya Rural',
    district: 'Mandya',
    village: 'Gejjalagere',
    nextVisitDate: '2026-08-10',
    visitTiming: '09:30 AM - 02:00 PM',
    servicesProvided: ['General Consultation', 'Blood Sugar & BP Screening', 'Maternal & Child Checkup', 'Free Generic Medicines Distribution'],
    doctorSpecialty: 'General Physician & Community Health',
    contactNumber: '+91-94808-12345',
    status: 'SCHEDULED'
  },
  {
    id: 'mc-102',
    name: 'National Health Mission Rural Mobile Clinic',
    district: 'Mandya',
    village: 'Kottathi',
    nextVisitDate: '2026-08-12',
    visitTiming: '10:00 AM - 03:00 PM',
    servicesProvided: ['Eye & Cataract Screening', 'Hb Testing', 'Child Immunization', 'Geriatric Health Checkup'],
    doctorSpecialty: 'Ophthalmology & General Medicine',
    contactNumber: '+91-94808-54321',
    status: 'SCHEDULED'
  },
  {
    id: 'mc-103',
    name: 'Arogya Vahini Mobile Diagnostic Unit',
    district: 'Ramanagara',
    village: 'Bidadi Rural',
    nextVisitDate: '2026-08-08',
    visitTiming: '09:00 AM - 01:00 PM',
    servicesProvided: ['ECG', 'Portable Ultrasound', 'Blood Profiling', 'Tele-Doctor Consultation'],
    doctorSpecialty: 'Tele-Specialist & Diagnostic Tech',
    contactNumber: '+91-94808-99887',
    status: 'ON_SITE'
  }
];

export const SAMPLE_PATIENTS: Patient[] = [
  {
    id: 'RC-2026-000101',
    name: 'Ramesh Gowda',
    age: 58,
    gender: 'male',
    phone: '+91-98450-11223',
    village: 'Gejjalagere',
    district: 'Mandya',
    preferredLanguage: 'kn',
    emergencyContact: '+91-98450-99887 (Son: Suresh)',
    medicalHistory: ['Hypertension (5 years)', 'Type 2 Diabetes'],
    allergies: ['Penicillin'],
    currentMedications: ['Amlodipine 5mg', 'Metformin 500mg'],
    createdAt: '2026-08-07T10:15:00Z'
  },
  {
    id: 'RC-2026-000102',
    name: 'Lakshmi Devi',
    age: 32,
    gender: 'female',
    phone: '+91-97412-33445',
    village: 'Maddur Rural',
    district: 'Mandya',
    preferredLanguage: 'kn',
    emergencyContact: '+91-97412-88776 (Husband: Venkatesh)',
    medicalHistory: ['Pregnancy - 28 weeks (High Risk - Anemia)'],
    allergies: [],
    currentMedications: ['Iron & Folic Acid Tablets'],
    createdAt: '2026-08-07T11:30:00Z'
  },
  {
    id: 'RC-2026-000103',
    name: 'Basavaraju M',
    age: 64,
    gender: 'male',
    phone: '+91-99001-55667',
    village: 'Srirangapatna',
    district: 'Mandya',
    preferredLanguage: 'kn',
    emergencyContact: '+91-99001-22334 (Daughter: Chaitra)',
    medicalHistory: ['Ischemic Heart Disease', 'COPD'],
    allergies: ['Sulfa drugs'],
    currentMedications: ['Aspirin 75mg', 'Atorvastatin 10mg'],
    createdAt: '2026-08-07T12:00:00Z'
  }
];

export const SAMPLE_QUEUE: QueueItem[] = [
  {
    id: 'q-001',
    patientId: 'RC-2026-000103',
    patientName: 'Basavaraju M',
    age: 64,
    gender: 'male',
    symptoms: ['Chest pain', 'Severe shortness of breath', 'Profuse sweating'],
    triageLevel: 'RED',
    waitingTimeMins: 4,
    priorityScore: 98,
    assignedWorker: 'Dr. Kumar (PHC Medical Officer)',
    status: 'IN_CONSULTATION',
    registeredAt: '2026-08-07T12:00:00Z'
  },
  {
    id: 'q-002',
    patientId: 'RC-2026-000102',
    patientName: 'Lakshmi Devi',
    age: 32,
    gender: 'female',
    symptoms: ['High fever 102°F', 'Severe headache', 'Dizziness in pregnancy'],
    triageLevel: 'ORANGE',
    waitingTimeMins: 16,
    priorityScore: 82,
    assignedWorker: 'ANM Rekha',
    status: 'WAITING',
    registeredAt: '2026-08-07T11:30:00Z'
  },
  {
    id: 'q-003',
    patientId: 'RC-2026-000101',
    patientName: 'Ramesh Gowda',
    age: 58,
    gender: 'male',
    symptoms: ['Mild joint pain', 'Routine diabetes blood sugar checkup'],
    triageLevel: 'GREEN',
    waitingTimeMins: 35,
    priorityScore: 35,
    assignedWorker: 'ASHA Worker Savitha',
    status: 'WAITING',
    registeredAt: '2026-08-07T10:15:00Z'
  }
];

export const SAMPLE_REFERRALS: Referral[] = [
  {
    id: 'REF-2026-0089',
    patientId: 'RC-2026-000103',
    patientName: 'Basavaraju M',
    age: 64,
    gender: 'male',
    triageLevel: 'RED',
    referringFacility: 'Srirangapatna PHC',
    targetFacilityId: 'fac-001',
    targetFacilityName: 'Mandya Institute of Medical Sciences (MIMS)',
    requiredSpecialty: 'Cardiology',
    reason: 'Acute Coronary Syndrome suspicion with SpO2 88% and crushing chest pain.',
    status: 'IN_TRANSIT',
    createdAt: '2026-08-07T12:08:00Z',
    updatedAt: '2026-08-07T12:15:00Z',
    history: [
      { status: 'SENT', timestamp: '2026-08-07T12:08:00Z', note: 'Emergency referral created by PHC Doctor' },
      { status: 'ACCEPTED', timestamp: '2026-08-07T12:11:00Z', note: 'MIMS Emergency ER Desk accepted. ICU Bed #4 reserved.' },
      { status: 'IN_TRANSIT', timestamp: '2026-08-07T12:15:00Z', note: '108 Ambulance dispatched and patient en route.' }
    ],
    transportRequested: true
  }
];

export const SAMPLE_TRANSPORTS: TransportRequest[] = [
  {
    id: 'TRP-108-9921',
    referralId: 'REF-2026-0089',
    patientName: 'Basavaraju M',
    pickupLocation: 'Srirangapatna PHC, Fort Area',
    destinationFacility: 'Mandya Institute of Medical Sciences (MIMS)',
    vehicleType: '108 Emergency',
    status: 'ON_THE_WAY',
    etaMins: 12,
    driverPhone: '+91-98000-10808 (Driver: Shivanna)',
    vehicleNumber: 'KA-11-G-0108',
    requestedAt: '2026-08-07T12:12:00Z'
  }
];
