
'use server';

import {
  aiHealthQuery,
  type AIHealthQueryInput,
  type AIHealthQueryOutput,
} from '@/ai/flows/ai-health-query';
import {
  healthDataAnalysis
} from '@/ai/flows/health-data-analysis';
import {
  medicineReminder
} from '@/ai/flows/medicine-reminder';
import {
  mentalHealthChatbot
} from '@/ai/flows/mental-health-chatbot';
import {
    HealthDataAnalysisInput,
    HealthDataAnalysisOutput,
    MedicineReminderInput,
    MedicineReminderOutput,
    MentalHealthChatbotInput,
    MentalHealthChatbotOutput
} from '@/app/schemas';

export async function getAIResponse(
  userId: string | undefined,
  input: AIHealthQueryInput,
): Promise<AIHealthQueryOutput> {
  try {
    const response = await aiHealthQuery(input);
    // Logging will be handled on the client side in the chat container
    // to ensure user context is available and avoid server-side auth complexities.
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
      isMedicalQuery: false,
      declineMessage: 'An error occurred while processing your request. Please try again later.'
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
