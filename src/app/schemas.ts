
import { z } from 'zod';

export const HealthDataAnalysisInputSchema = z.object({
  bloodPressure: z.string().optional().describe("User's blood pressure reading (e.g., '150/90')."),
  bloodSugar: z.string().optional().describe("User's blood sugar level (e.g., '120 mg/dL')."),
  heartRate: z.union([z.number(), z.string()]).optional().describe("User's heart rate (e.g., 95)."),
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
  reportImage: z.string().optional().describe("An optional image of a prescription or report, as a data URI."),
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
