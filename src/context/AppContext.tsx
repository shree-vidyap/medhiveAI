import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Facility, 
  Referral, 
  MedicalReportExtraction, 
  GovernmentScheme, 
  MobileClinic, 
  AppNotification, 
  ChatMessage,
  TriageResult
} from '../types';
import { INITIAL_FACILITIES, INITIAL_SCHEMES, INITIAL_MOBILE_CLINICS, SAMPLE_REFERRALS } from '../data/mockDatabase';

export interface UserProfileData {
  id: string;
  name: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  phone: string;
  emergencyContact: string;
  address: string;
  allergies: string[];
  chronicConditions: string[];
}

export interface ReportRecord {
  id: string;
  title: string;
  source: 'Assessment' | 'Scanned Report';
  timestamp: string;
  patientName: string;
  symptoms?: string[];
  triage?: TriageResult;
  extraction?: MedicalReportExtraction;
  summary: string;
}

interface AppContextType {
  user: UserProfileData;
  updateUserProfile: (data: Partial<UserProfileData>) => void;
  facilities: Facility[];
  referrals: Referral[];
  addReferral: (referral: Omit<Referral, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => Referral;
  updateReferralStatus: (id: string, status: Referral['status'], note?: string) => void;
  reports: ReportRecord[];
  addReport: (report: Omit<ReportRecord, 'id' | 'timestamp'>) => ReportRecord;
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  mobileClinics: (MobileClinic & { reminderSet?: boolean })[];
  toggleClinicReminder: (id: string) => void;
  schemes: GovernmentScheme[];
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => void;
  clearChat: () => void;
}

const DEFAULT_USER: UserProfileData = {
  id: 'USR-2026-9081',
  name: 'Basavaraju M',
  dob: '1962-04-12',
  gender: 'male',
  bloodGroup: 'O+',
  phone: '+91 99001 55667',
  emergencyContact: '+91 99001 22334 (Daughter: Chaitra)',
  address: 'House #42, Fort Area, Srirangapatna, Mandya - 571438',
  allergies: ['Sulfa drugs', 'Dust Mites'],
  chronicConditions: ['Hypertension', 'Ischemic Heart Disease'],
};

const DEFAULT_REPORTS: ReportRecord[] = [
  {
    id: 'REP-2026-001',
    title: 'Cardiac Symptom Assessment',
    source: 'Assessment',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    patientName: 'Basavaraju M',
    symptoms: ['Chest tightness', 'Shortness of breath', 'Sweating'],
    triage: {
      level: 'RED',
      title: 'Acute Ischemic Symptoms Assessment',
      confidence: 94,
      reasoning: 'Sudden onset chest discomfort with dyspnea requires immediate cardiac triage.',
      keyFactors: ['Chest pain radiating to left arm', 'SpO2 92%', 'Elevated BP 150/95'],
      recommendedAction: 'Immediate emergency transfer to Mandya District Hospital ICU.',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      symptoms: ['Chest tightness', 'Shortness of breath', 'Sweating'],
    },
    summary: 'High priority triage triggered for chest discomfort and breathlessness. Patient routed to MIMS Cardiology ER.',
  },
  {
    id: 'REP-2026-002',
    title: 'CBC & Diagnostic Lab Summary',
    source: 'Scanned Report',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    patientName: 'Basavaraju M',
    summary: 'Hemoglobin 11.2 g/dL, WBC 9,800 /mcL, Fasting Blood Glucose 142 mg/dL. Borderline elevated glucose noted.',
    extraction: {
      id: 'EXT-8821',
      fileName: 'Blood_Report_Aug2026.pdf',
      fileType: 'pdf',
      extractedText: 'COMPLETE BLOOD COUNT: Hb 11.2, WBC 9800, FBS 142 mg/dL.',
      reportType: 'Blood Test',
      keyFindings: ['Slightly low Hemoglobin (11.2 g/dL)', 'Elevated Fasting Glucose (142 mg/dL)'],
      abnormalValues: [
        { parameter: 'Fasting Blood Sugar', value: '142 mg/dL', referenceRange: '70-99 mg/dL', status: 'HIGH' },
        { parameter: 'Hemoglobin', value: '11.2 g/dL', referenceRange: '13.0-17.0 g/dL', status: 'LOW' },
      ],
      summary: 'Patient exhibits mild anemia and early diabetic fasting glucose levels.',
      triageImpact: 'Non-emergency, routine metabolic clinic follow-up advised.',
      uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  },
];

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOTIF-1',
    title: 'Referral Accepted by MIMS',
    message: 'Mandya Institute of Medical Sciences has accepted your emergency referral. Bed #4 in Cardiology Ward is reserved.',
    type: 'REFERRAL',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    read: false,
  },
  {
    id: 'NOTIF-2',
    title: 'Mobile Clinic Reminder',
    message: 'Sanjeevini Health Express visits Gejjalagere village on Aug 10 from 09:30 AM.',
    type: 'SYSTEM',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    read: false,
  },
  {
    id: 'NOTIF-3',
    title: 'Report Scanned Successfully',
    message: 'Your uploaded CBC blood test report has been extracted and saved to My Reports.',
    type: 'SYSTEM',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    read: true,
  },
];

const DEFAULT_CHAT: ChatMessage[] = [
  {
    id: 'MSG-1',
    sender: 'assistant',
    text: 'Hello Basavaraju! I am Medihivi Assistant. I can help you understand your symptoms, check referral status, find nearby hospitals, or navigate healthcare schemes. How can I assist you today?',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfileData>(() => {
    const saved = localStorage.getItem('medihivi_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [facilities] = useState<Facility[]>(INITIAL_FACILITIES);

  const [referrals, setReferrals] = useState<Referral[]>(() => {
    const saved = localStorage.getItem('medihivi_referrals');
    return saved ? JSON.parse(saved) : SAMPLE_REFERRALS;
  });

  const [reports, setReports] = useState<ReportRecord[]>(() => {
    const saved = localStorage.getItem('medihivi_reports_v2');
    return saved ? JSON.parse(saved) : DEFAULT_REPORTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('medihivi_notifs_v2');
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
  });

  const [mobileClinics, setMobileClinics] = useState<(MobileClinic & { reminderSet?: boolean })[]>(() => {
    return INITIAL_MOBILE_CLINICS.map((mc) => ({ ...mc, reminderSet: false }));
  });

  const [schemes] = useState<GovernmentScheme[]>(INITIAL_SCHEMES);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('medihivi_chat_messages');
    return saved ? JSON.parse(saved) : DEFAULT_CHAT;
  });

  useEffect(() => {
    localStorage.setItem('medihivi_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('medihivi_referrals', JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem('medihivi_reports_v2', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('medihivi_notifs_v2', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('medihivi_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const updateUserProfile = (data: Partial<UserProfileData>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  const addReferral = (data: Omit<Referral, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => {
    const newRef: Referral = {
      ...data,
      id: `REF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          status: data.status,
          timestamp: new Date().toISOString(),
          note: 'Referral submitted via Medihivi AI Portal',
        },
      ],
    };

    setReferrals((prev) => [newRef, ...prev]);

    // Push notification
    addNotification({
      title: 'New Referral Submitted',
      message: `Referral created for ${data.patientName} to ${data.targetFacilityName}.`,
      type: 'REFERRAL',
    });

    return newRef;
  };

  const updateReferralStatus = (id: string, status: Referral['status'], note?: string) => {
    setReferrals((prev) =>
      prev.map((ref) => {
        if (ref.id === id) {
          const updatedHistory = [
            ...ref.history,
            { status, timestamp: new Date().toISOString(), note: note || `Status updated to ${status}` },
          ];
          return {
            ...ref,
            status,
            updatedAt: new Date().toISOString(),
            history: updatedHistory,
          };
        }
        return ref;
      })
    );
  };

  const addReport = (data: Omit<ReportRecord, 'id' | 'timestamp'>) => {
    const newReport: ReportRecord = {
      ...data,
      id: `REP-2026-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
    };
    setReports((prev) => [newReport, ...prev]);

    addNotification({
      title: 'New Health Record Saved',
      message: `"${data.title}" has been saved to your My Reports gallery.`,
      type: 'SYSTEM',
    });

    return newReport;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newN: AppNotification = {
      ...notif,
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newN, ...prev]);
  };

  const toggleClinicReminder = (id: string) => {
    setMobileClinics((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextState = !c.reminderSet;
          if (nextState) {
            addNotification({
              title: 'Mobile Clinic Reminder Set',
              message: `You will be notified before ${c.name} visits ${c.village} on ${c.nextVisitDate}.`,
              type: 'SYSTEM',
            });
          }
          return { ...c, reminderSet: nextState };
        }
        return c;
      })
    );
  };

  const sendChatMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `MSG-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Generate smart canned assistant response
    setTimeout(() => {
      let botText = "I'm here to assist with your healthcare needs. You can ask about symptom checking, facility locations, or referral tracking.";
      const lower = text.toLowerCase();

      if (lower.includes('explain') || lower.includes('result') || lower.includes('symptom')) {
        botText = "Your symptom assessment categorizes urgency based on clinical key factors (e.g. chest discomfort, fever, blood pressure). If flagged RED or ORANGE, emergency or priority referral to a District Hospital is recommended immediately.";
      } else if (lower.includes('next') || lower.includes('do') || lower.includes('action')) {
        botText = "Depending on your assessment level: RED requires immediate 108 emergency transport; ORANGE requires urgent PHC/District Hospital visit; YELLOW/GREEN can be managed via outpatient consultation or home care.";
      } else if (lower.includes('facility') || lower.includes('hospital') || lower.includes('nearby')) {
        botText = `There are ${facilities.length} healthcare facilities registered nearby. Mandya Institute of Medical Sciences (MIMS) is 7.2 km away with emergency ICU beds available.`;
      } else if (lower.includes('referral') || lower.includes('track')) {
        botText = `You currently have ${referrals.length} referral records. The most recent referral (${referrals[0]?.id || 'REF-0089'}) is currently "${referrals[0]?.status || 'Active'}".`;
      } else if (lower.includes('scheme') || lower.includes('government') || lower.includes('pmjay')) {
        botText = "Medihivi AI supports Ayushman Bharat (PM-JAY) and Arogya Karnataka scheme eligibility verification. You can check required documents in the Government Schemes section.";
      }

      const botMsg: ChatMessage = {
        id: `MSG-${Date.now() + 1}`,
        sender: 'assistant',
        text: botText,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  const clearChat = () => {
    setChatMessages(DEFAULT_CHAT);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        updateUserProfile,
        facilities,
        referrals,
        addReferral,
        updateReferralStatus,
        reports,
        addReport,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        addNotification,
        mobileClinics,
        toggleClinicReminder,
        schemes,
        chatMessages,
        sendChatMessage,
        clearChat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
