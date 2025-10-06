"use server";

import { aiHealthQuery, type AIHealthQueryOutput } from "@/ai/flows/ai-health-query";
import { initiateDoctorHandoff, type InitiateDoctorHandoffOutput } from "@/ai/flows/doctor-handoff-initiation";

export async function getAIResponse(query: string): Promise<AIHealthQueryOutput> {
  try {
    const response = await aiHealthQuery({ query });
    return response;
  } catch (error) {
    console.error("Error getting AI response:", error);
    // Return a structured error so the client can handle it gracefully.
    return {
      insights: "An error occurred while processing your request.",
      riskFactors: "Please try again later.",
      nextSteps: "If the problem persists, contact support.",
      confidenceScore: 0,
      handoffRequired: false
    };
  }
}

export async function requestDoctorHandoff(patientQuery: string, aiDiagnosis: string, confidenceScore: number): Promise<InitiateDoctorHandoffOutput> {
  try {
    const response = await initiateDoctorHandoff({ patientQuery, aiDiagnosis, confidenceScore });
    return response;
  } catch (error) {
    console.error("Error initiating doctor handoff:", error);
    return {
      handoffInitiated: false,
      message: "An error occurred while trying to contact a doctor. Please try again."
    }
  }
}
