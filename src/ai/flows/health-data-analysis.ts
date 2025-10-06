
'use server';

/**
 * @fileOverview An AI agent to analyze health data for potential risks.
 *
 * - healthDataAnalysis - Analyzes user's health data (e.g., BP, Sugar) for risks.
 */

import {ai} from '@/ai/genkit';
import { HealthDataAnalysisInputSchema, HealthDataAnalysisOutputSchema, type HealthDataAnalysisInput, type HealthDataAnalysisOutput } from '@/app/schemas';


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
