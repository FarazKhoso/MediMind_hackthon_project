'use server';

import {
  aiHealthQuery,
  type AIHealthQueryOutput,
} from '@/ai/flows/ai-health-query';
import {
  initiateDoctorHandoff,
  type InitiateDoctorHandoffOutput,
} from '@/ai/flows/doctor-handoff-initiation';
import {
  healthDataAnalysis
} from '@/ai/flows/health-data-analysis';
import {
  medicineReminder
} from '@/ai/flows/medicine-reminder';
import {
  mentalHealthChatbot
} from '@/ai/flows/mental-health-chatbot';
import { z } from 'zod';

// This is a server-side representation. We can't use the client-side `logConsultation` directly.
// We'll call a simple server-side function to add to Firestore.
// For a real app, you'd use the Firebase Admin SDK here.
// For this prototype, we'll keep it simple and assume we can write.
// This is a simplified representation for the prototype.
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, App } from 'firebase-admin/app';

// Zod schemas moved from flows
export const HealthDataAnalysisInputSchema = z.object({
  bloodPressure: z.string().optional().describe("User's blood pressure reading (e.g., '150/90')."),
  bloodSugar: z.string().optional().describe("User's blood sugar level (e.g., '120 mg/dL')."),
  heartRate: z.number().optional().describe("User's heart rate (e.g., 95)."),
});
export type HealthDataAnalysisInput = z.infer<typeof HealthDataAnalysisInputSchema>;

export const HealthDataAnalysisOutputSchema = z.object({
  riskAnalysis: z.string().describe('Analysis of the health data and potential risks.'),
  recommendations: z.string().describe('Recommendations based on the analysis.'),
  isDoctorAlertRequired: z.boolean().describe('Whether an alert to a doctor is recommended.'),
});
export type HealthDataAnalysisOutput = z.infer<typeof HealthDataAnalysisOutputSchema>;

export const MedicineReminderInputSchema = z.object({
  request: z.string().describe("User's request for a reminder. e.g., 'Set a reminder for Panadol every 6 hours' or 'Polio vaccine is due on 10/10/2025'"),
});
export type MedicineReminderInput = z.infer<typeof MedicineReminderInputSchema>;

export const MedicineReminderOutputSchema = z.object({
  confirmation: z.string().describe('Confirmation message in Roman Urdu.'),
  schedule: z.object({
    medicineOrVaccine: z.string(),
    frequency: z.string().optional(),
    date: z.string().optional(),
    time: z.string().optional(),
  }).describe("The parsed schedule details."),
});
export type MedicineReminderOutput = z.infer<typeof MedicineReminderOutputSchema>;

export const MentalHealthChatbotInputSchema = z.object({
  message: z.string().describe("User's message about their mental state."),
});
export type MentalHealthChatbotInput = z.infer<typeof MentalHealthChatbotInputSchema>;

export const MentalHealthChatbotOutputSchema = z.object({
  response: z.string().describe('An empathetic response with coping tips in Roman Urdu.'),
  escalate: z.boolean().describe('A flag to indicate if the case seems serious and requires handoff.'),
});
export type MentalHealthChatbotOutput = z.infer<typeof MentalHealthChatbotOutputSchema>;


// Initialize Firebase Admin SDK if not already initialized
let adminApp: App;
if (!getApps().length) {
  adminApp = initializeApp();
} else {
  adminApp = getApps()[0];
}
const db = getFirestore(adminApp);


async function logConsultationServer(log: {
    userId: string,
    userQuery: string;
    aiResponse: string;
    confidenceScore: number;
    handoffStatus: 'pending' | 'completed' | 'not_required';
}) {
    if (!log.userId) return;
    try {
        const collectionRef = db.collection(`users/${log.userId}/consultationLogs`);
        await collectionRef.add({
            ...log,
            timestamp: new Date(),
        });
    } catch (e) {
        console.error("Error logging consultation from server:", e);
    }
}


export async function getAIResponse(
  userId: string | undefined,
  query: string
): Promise<AIHealthQueryOutput> {
  try {
    const response = await aiHealthQuery({ query });

    // Log the consultation if a user ID is available
    if (userId) {
      await logConsultationServer({
        userId: userId,
        userQuery: query,
        aiResponse: response.insights,
        confidenceScore: response.confidenceScore,
        handoffStatus: response.handoffRequired ? 'pending' : 'not_required',
      });
    }

    return response;
  } catch (error) {
    console.error('Error getting AI response:', error);
    // Return a structured error so the client can handle it gracefully.
    return {
      insights: 'An error occurred while processing your request.',
      riskFactors: 'Please try again later.',
      nextSteps: 'If the problem persists, contact support.',
      confidenceScore: 0,
      handoffRequired: false,
    };
  }
}

export async function requestDoctorHandoff(
  patientQuery: string,
  aiDiagnosis: string,
  confidenceScore: number
): Promise<InitiateDoctorHandoffOutput> {
  try {
    const response = await initiateDoctorHandoff({
      patientQuery,
      aiDiagnosis,
      confidenceScore,
    });

    // Optionally update the consultation log with the handoff result
    if (response.handoffInitiated) {
      // You might want a way to identify the original consultation to update it.
      // For now, we'll log a new event or assume the latest log is the one to update.
    }

    return response;
  } catch (error) {
    console.error('Error initiating doctor handoff:', error);
    return {
      handoffInitiated: false,
      message:
        'An error occurred while trying to contact a doctor. Please try again.',
    };
  }
}

export async function analyzeHealthData(
  data: HealthDataAnalysisInput
): Promise<HealthDataAnalysisOutput> {
  try {
    return await healthDataAnalysis(data);
  } catch (error) {
    console.error('Error in health data analysis:', error);
    return {
      riskAnalysis: 'Analysis failed.',
      recommendations: 'Could not process the data.',
      isDoctorAlertRequired: false,
    };
  }
}

export async function setMedicineReminder(
  data: MedicineReminderInput
): Promise<MedicineReminderOutput> {
  try {
    return await medicineReminder(data);
  } catch (error) {
    console.error('Error setting reminder:', error);
    return {
      confirmation: 'Failed to set reminder.',
      schedule: { medicineOrVaccine: '' },
    };
  }
}

export async function getMentalHealthResponse(
  data: MentalHealthChatbotInput
): Promise<MentalHealthChatbotOutput> {
  try {
    return await mentalHealthChatbot(data);
  } catch (error) {
    console.error('Error in mental health chat:', error);
    return {
      response: 'Sorry, I am unable to respond at the moment.',
      escalate: false,
    };
  }
}
