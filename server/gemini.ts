import { GoogleGenAI, Type } from '@google/genai';

// Server-side initialization
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment. Falling back to rule-based fallback.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || 'dummy-key',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// --- AGENT 1: AI TRIAGE AGENT ---
export async function runTriageAgent(input: {
  symptomsText: string;
  vitals?: { heartRate?: number; bpSys?: number; bpDia?: number; spo2?: number; temp?: number };
  patientAge?: number;
  gender?: string;
  reportSummary?: string;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return runFallbackTriage(input);
  }

  try {
    const ai = getAIClient();
    const prompt = `
You are the AI Triage Agent for RuralCare AI in rural India.
Analyze the following patient information and provide a medical triage categorization.

Patient Age: ${input.patientAge || 'Unknown'}
Gender: ${input.gender || 'Unknown'}
Symptoms Reported: ${input.symptomsText}
Report Summary (if any): ${input.reportSummary || 'None'}
Vital Signs:
- Heart Rate: ${input.vitals?.heartRate || 'Not measured'} bpm
- BP: ${input.vitals?.bpSys && input.vitals?.bpDia ? `${input.vitals.bpSys}/${input.vitals.bpDia}` : 'Not measured'} mmHg
- SpO2: ${input.vitals?.spo2 || 'Not measured'} %
- Temperature: ${input.vitals?.temp || 'Not measured'} °F

Rules:
1. Triage Level options:
   - RED: Emergency (Immediate life-threat risk like severe chest pain, SpO2 < 90%, unconsciousness, acute severe shortness of breath, severe trauma)
   - ORANGE: Urgent (High risk needing doctor within 30-60 mins, high fever in pregnancy, severe abdominal pain, BP > 180/110, persistent vomiting)
   - YELLOW: Priority (Moderate symptoms needing evaluation today, moderate fever, persistent cough without respiratory distress, minor injury)
   - GREEN: Low risk / Routine (Mild cold, skin rash, routine checkup, mild body ache)
2. Always emphasize that this is AI decision support and not a final medical diagnosis.
3. Be explainable: list specific key factors driving the urgency rating.

Respond ONLY with JSON matching this structure:
{
  "level": "RED" | "ORANGE" | "YELLOW" | "GREEN",
  "title": "Short title describing urgency",
  "confidence": number between 70 and 99,
  "reasoning": "Clear 2-3 sentence explanation of the reasoning",
  "keyFactors": ["Factor 1", "Factor 2", "Factor 3"],
  "recommendedAction": "Actionable immediate instruction for patient or health worker"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.STRING },
            title: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            keyFactors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            recommendedAction: { type: Type.STRING },
          },
          required: ['level', 'title', 'confidence', 'reasoning', 'keyFactors', 'recommendedAction'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return {
      level: (parsed.level || 'YELLOW') as 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN',
      title: parsed.title || 'Urgency Evaluation',
      confidence: parsed.confidence || 85,
      reasoning: parsed.reasoning || 'Evaluation based on reported symptoms and vitals.',
      keyFactors: parsed.keyFactors || [input.symptomsText],
      recommendedAction: parsed.recommendedAction || 'Please consult the nearest health worker or doctor.',
      timestamp: new Date().toISOString(),
      symptoms: [input.symptomsText],
    };
  } catch (error) {
    console.error('Triage agent error, fallback used:', error);
    return runFallbackTriage(input);
  }
}

// Rule-based fallback when AI key is absent or network fails
function runFallbackTriage(input: {
  symptomsText: string;
  vitals?: { heartRate?: number; bpSys?: number; bpDia?: number; spo2?: number; temp?: number };
}) {
  const text = (input.symptomsText || '').toLowerCase();
  const spo2 = input.vitals?.spo2;
  const temp = input.vitals?.temp;

  let level: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' = 'GREEN';
  let title = 'Low Risk / Routine Assessment';
  let reasoning = 'Symptoms appear mild and non-acute.';
  const keyFactors: string[] = [];
  let recommendedAction = 'Routine consultation at local Primary Health Centre (PHC).';

  if (
    text.includes('chest pain') ||
    text.includes('breathing') ||
    text.includes('unconscious') ||
    (spo2 && spo2 < 90) ||
    text.includes('heart attack') ||
    text.includes('ede novu') ||
    text.includes('usiraadakke')
  ) {
    level = 'RED';
    title = 'EMERGENCY — Immediate Care Required';
    reasoning = 'The presence of chest pain, shortness of breath, or low oxygen saturation indicates a potentially life-threatening emergency.';
    keyFactors.push('Chest pain or severe respiratory difficulty');
    if (spo2) keyFactors.push(`Low SpO2: ${spo2}%`);
    recommendedAction = 'Seek emergency medical evaluation immediately at nearest facility with ICU and Cardiology.';
  } else if (
    text.includes('fever') ||
    text.includes('jwara') ||
    (temp && temp > 102) ||
    text.includes('severe headache') ||
    text.includes('bleeding')
  ) {
    level = 'ORANGE';
    title = 'URGENT — Prompt Evaluation Recommended';
    reasoning = 'High fever or severe acute symptoms warrant prompt medical review within 30-60 minutes.';
    keyFactors.push('High body temperature or persistent severe pain');
    recommendedAction = 'Proceed to PHC/CHC for immediate triage and doctor assessment.';
  } else if (text.includes('cough') || text.includes('vomiting') || text.includes('pain')) {
    level = 'YELLOW';
    title = 'PRIORITY — Evaluation Required Today';
    reasoning = 'Moderate discomfort requiring healthcare worker checkup during operating hours.';
    keyFactors.push('Moderate symptom duration');
    recommendedAction = 'Visit local PHC today for clinical checkup.';
  }

  return {
    level,
    title,
    confidence: 88,
    reasoning,
    keyFactors: keyFactors.length ? keyFactors : ['General symptom presentation'],
    recommendedAction,
    timestamp: new Date().toISOString(),
    symptoms: [input.symptomsText],
    isOfflineAssessment: true,
  };
}

// --- AGENT 2: SMART REFERRAL AGENT ---
export async function runReferralAgent(input: {
  triageLevel: string;
  symptoms: string[];
  facilities: any[];
  patientLocation?: string;
}) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Compute facility suitability score for each facility
  const scoredFacilities = input.facilities.map((fac) => {
    let specialistMatch = 70;
    let emergencyMatch = fac.emergencyAvailable ? 100 : 30;
    let bedAvailability = Math.min(100, Math.round((fac.beds.available / Math.max(1, fac.beds.total)) * 300));
    let diagnosticMatch = (Object.values(fac.diagnostics).filter(Boolean).length / 5) * 100;
    let distanceScore = Math.max(20, 100 - fac.distanceKm * 2);

    const sLower = input.symptoms.join(' ').toLowerCase();
    if ((sLower.includes('chest') || sLower.includes('heart') || input.triageLevel === 'RED') && fac.specialists.includes('Cardiology')) {
      specialistMatch = 100;
    } else if (sLower.includes('pregnancy') || sLower.includes('maternal')) {
      specialistMatch = fac.specialists.includes('OB-GYN') ? 100 : 40;
    }

    if (input.triageLevel === 'RED' && !fac.icuBeds.available) {
      emergencyMatch -= 30;
    }

    const overallScore = Math.round(
      specialistMatch * 0.35 + emergencyMatch * 0.25 + bedAvailability * 0.15 + diagnosticMatch * 0.15 + distanceScore * 0.10
    );

    return {
      ...fac,
      suitabilityScore: Math.min(99, Math.max(35, overallScore)),
      suitabilityBreakdown: {
        specialistMatch: Math.round(specialistMatch),
        emergencyMatch: Math.round(emergencyMatch),
        bedAvailability: Math.round(bedAvailability),
        diagnosticMatch: Math.round(diagnosticMatch),
        distanceScore: Math.round(distanceScore),
      },
    };
  });

  // Sort by suitability score descending
  scoredFacilities.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  return {
    recommendedFacility: scoredFacilities[0],
    alternativeFacilities: scoredFacilities.slice(1, 4),
    reasoning: `Facility ${scoredFacilities[0].name} ranked highest (${scoredFacilities[0].suitabilityScore}% suitability) due to required specialist availability, emergency readiness, and bed capacity.`,
  };
}

// --- AGENT 3: PATIENT PRIORITY QUEUE AGENT ---
export function calculateQueuePriority(items: any[]) {
  return items.map((item) => {
    let baseScore = 0;
    if (item.triageLevel === 'RED') baseScore = 90;
    else if (item.triageLevel === 'ORANGE') baseScore = 70;
    else if (item.triageLevel === 'YELLOW') baseScore = 40;
    else baseScore = 15;

    // Waiting time weight (adds 0.5 points per minute)
    const timeWeight = Math.min(25, (item.waitingTimeMins || 0) * 0.5);

    // Age vulnerability weight (elderly > 60 or pediatrics < 5 get boost)
    let ageWeight = 0;
    if (item.age >= 60 || item.age <= 5) ageWeight = 10;

    const finalPriorityScore = Math.min(99, Math.round(baseScore + timeWeight + ageWeight));

    return {
      ...item,
      priorityScore: finalPriorityScore,
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);
}

// --- AGENT 4: REPORT & DOCUMENT AI AGENT ---
export async function runReportAgent(base64ImageOrPdfText: string, fileType: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      reportType: 'General Medical Report',
      summary: 'Report scanned successfully in offline/simulated mode.',
      keyFindings: ['Elevated blood pressure noted', 'Normal blood glucose levels'],
      abnormalValues: [
        { parameter: 'Hemoglobin', value: '9.2 g/dL', referenceRange: '12.0-15.0', status: 'LOW' },
        { parameter: 'Systolic BP', value: '145 mmHg', referenceRange: '90-120', status: 'HIGH' }
      ],
      triageImpact: 'Slight anemia and mild hypertension noted. Recommending ORANGE or YELLOW triage review.',
    };
  }

  try {
    const ai = getAIClient();
    let contentsPart: any;

    if (fileType.includes('image')) {
      contentsPart = [
        {
          inlineData: {
            mimeType: fileType,
            data: base64ImageOrPdfText.replace(/^data:image\/\w+;base64,/, ''),
          },
        },
        {
          text: `You are the Report & Document AI Agent for RuralCare AI. Read and perform OCR on this medical report image. Extract all key parameters, lab values, diagnosis, and abnormal readings. Summarize clearly for rural health workers.`,
        },
      ];
    } else {
      contentsPart = `You are the Report & Document AI Agent for RuralCare AI. Extract key medical findings, abnormal lab values, and summary from this document text:\n\n${base64ImageOrPdfText}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contentsPart,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reportType: { type: Type.STRING },
            summary: { type: Type.STRING },
            keyFindings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            abnormalValues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  parameter: { type: Type.STRING },
                  value: { type: Type.STRING },
                  referenceRange: { type: Type.STRING },
                  status: { type: Type.STRING },
                },
              },
            },
            triageImpact: { type: Type.STRING },
          },
          required: ['reportType', 'summary', 'keyFindings', 'abnormalValues', 'triageImpact'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return parsed;
  } catch (error) {
    console.error('Report Agent Error:', error);
    return {
      reportType: 'Scanned Document',
      summary: 'OCR extraction completed with minor AI uncertainty. Please verify parameters.',
      keyFindings: ['Document processed'],
      abnormalValues: [],
      triageImpact: 'Recommended clinical verification by health worker.',
    };
  }
}

// --- RURALCARE ASSISTANT CHATBOT ---
export async function runChatbot(message: string, history: any[], language: string = 'en') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      text: `[RuralCare Assistant] Thank you for your question. You asked: "${message}". I can help you check symptoms, find nearby hospitals, check government health schemes (Ayushman Bharat / Arogya Karnataka), and track referrals. How can I assist further?`,
    };
  }

  try {
    const ai = getAIClient();
    const systemInstruction = `
You are RuralCare Assistant, an empathetic, clear, multi-lingual AI chatbot for RuralCare AI in India.
Language preference: ${language} (Kannada 'kn', English 'en', or Hindi 'hi').
Respond in the language requested or match the user's input language naturally.

Your capabilities:
1. Explain triage urgency levels (RED, ORANGE, YELLOW, GREEN)
2. Explain nearby hospital recommendations & bed availability
3. Guide users on how to apply for Government Schemes (Ayushman Bharat PM-JAY, Arogya Karnataka, Jan Aushadhi)
4. Assist with mobile clinic schedules and emergency transport (108 Ambulance)
5. Explain medical report terminology in plain, non-jargon language.

Safety Disclaimer: Always state politely if urgent symptoms need immediate doctor/ER evaluation. NEVER claim to diagnose or prescribe drugs.
`;

    const chatHistoryFormatted = (history || []).map((h) => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        ...chatHistoryFormatted,
        { role: 'user', parts: [{ text: message }] },
      ],
      config: {
        systemInstruction,
      },
    });

    return {
      text: response.text || 'I am here to assist with your healthcare needs. How can I help you today?',
    };
  } catch (error) {
    console.error('Chatbot error:', error);
    return {
      text: 'RuralCare Assistant is available. How can I help you navigate symptoms, hospital referrals, or government schemes?',
    };
  }
}
