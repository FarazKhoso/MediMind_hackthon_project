'use server';

/**
 * @fileOverview A disease tracking and early warning agent.
 *
 * - diseaseTrackingAgent - Analyzes disease data to predict outbreaks and identify hotspots.
 * - DiseaseTrackingInput - The input type for the diseaseTrackingAgent function.
 * - DiseaseTrackingOutput - The return type for the diseaseTrackingAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiseaseTrackingInputSchema = z.object({
  disease: z.string().describe('The disease being tracked (e.g., Dengue, Flu).'),
  cases: z.array(z.object({
    location: z.string().describe('The location of the reported case (e.g., "Lahore").'),
    count: z.number().describe('The number of cases reported in that location.'),
  })).describe('A list of reported cases with their locations and counts.'),
});
export type DiseaseTrackingInput = z.infer<typeof DiseaseTrackingInputSchema>;

const DiseaseTrackingOutputSchema = z.object({
  prediction: z.string().describe('The prediction for a potential outbreak.'),
  hotspots: z.array(z.string()).describe('A list of locations identified as hotspots.'),
  confidenceScore: z.number().describe('The confidence score of the prediction (0-1).'),
  recommendations: z.string().describe('Recommendations for health departments.'),
});
export type DiseaseTrackingOutput = z.infer<typeof DiseaseTrackingOutputSchema>;

export async function diseaseTrackingAgent(input: DiseaseTrackingInput): Promise<DiseaseTrackingOutput> {
  return diseaseTrackingAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diseaseTrackingPrompt',
  input: {schema: DiseaseTrackingInputSchema},
  output: {schema: DiseaseTrackingOutputSchema},
  prompt: `You are a public health AI expert for Pakistan. Analyze the provided case data for {{{disease}}} to predict potential outbreaks, identify hotspots, and provide recommendations for health departments. Your response must be in Roman Urdu.

  Case Data:
  {{#each cases}}
  - Location: {{{location}}}, Cases: {{{count}}}
  {{/each}}

  Based on this data, provide:
  1.  A prediction about the risk of an outbreak.
  2.  A list of hotspot locations.
  3.  A confidence score for your prediction.
  4.  Recommendations for health departments in Roman Urdu.

  Include this disclaimer in your final output, separately: 'Yeh AI se bana hai. Doctor se salah lain. Yeh medical salah nahi hai.'
  `,
});

const diseaseTrackingAgentFlow = ai.defineFlow(
  {
    name: 'diseaseTrackingAgentFlow',
    inputSchema: DiseaseTrackingInputSchema,
    outputSchema: DiseaseTrackingOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if(output) {
      if (output.confidenceScore < 0.95) {
        output.prediction = `Low confidence prediction: ${output.prediction}. Please verify with more data.`;
      }
    }
    return output!;
  }
);
