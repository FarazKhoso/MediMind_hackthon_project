'use server';

/**
 * @fileOverview An AI agent to analyze health data for potential risks.
 *
 * - healthDataAnalysis - Analyzes user's health data (e.g., BP, Sugar) for risks.
 * - HealthDataAnalysisInput - The input type for the healthDataAnalysis function.
 * - HealthDataAnalysisOutput - The return type for the healthDataAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

export async function healthDataAnalysis(input: HealthDataAnalysisInput): Promise<HealthDataAnalysisOutput> {
  return healthDataAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'healthDataAnalysisPrompt',
  input: {schema: HealthDataAnalysisInputSchema},
  output: {schema: HealthDataAnalysisOutputSchema},
  prompt: `You are a health data analysis AI for users in Pakistan. Analyze the following health data and provide the risk analysis and recommendations in Roman Urdu.

  Data:
  {{#if bloodPressure}}Blood Pressure: {{{bloodPressure}}}{{/if}}
  {{#if bloodSugar}}Blood Sugar: {{{bloodSugar}}}{{/if}}
  {{#if heartRate}}Heart Rate: {{{heartRate}}} bpm{{/if}}

  Based on this data, provide:
  1. A risk analysis in Roman Urdu (e.g., "Aapka blood pressure thora high hai, jo long-term heart issues ka risk barha sakta hai.").
  2. Recommendations in Roman Urdu (e.g., "Namak ka istemal kam karein aur rozana walk karein.").
  3. A boolean flag 'isDoctorAlertRequired' if the readings are in a high-risk zone.
  `,
});

const healthDataAnalysisFlow = ai.defineFlow(
  {
    name: 'healthDataAnalysisFlow',
    inputSchema: HealthDataAnalysisInputSchema,
    outputSchema: HealthDataAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Could not get a response from the AI.");
    }
    return output;
  }
);
