'use server';

import {
  aiHealthQuery,
  type AIHealthQueryOutput,
} from '@/ai/flows/ai-health-query';
import {
  initiateDoctorHandoff,
  type InitiateDoctorHandoffOutput,
} from '@/ai/flows/doctor-handoff-initiation';

// This is a server-side representation. We can't use the client-side `logConsultation` directly.
// We'll call a simple server-side function to add to Firestore.
// For a real app, you'd use the Firebase Admin SDK here.
// For this prototype, we'll keep it simple and assume we can write.
// This is a simplified representation for the prototype.
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, App } from 'firebase-admin/app';

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
