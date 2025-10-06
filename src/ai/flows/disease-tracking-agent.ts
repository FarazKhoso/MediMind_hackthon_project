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

const CaseSchema = z.object({
  case_id: z.string().describe('Unique identifier for the case.'),
  date: z.string().describe('Date of the reported case.'),
  symptoms: z.string().describe('Symptoms of the patient.'),
  severity: z.enum(['low', 'medium', 'high']).describe('Severity of the case.'),
});

const DiseaseTrackingInputSchema = z.object({
  disease: z.string().describe('The disease being tracked (e.g., Dengue, Flu).'),
  casesByCity: z.record(z.array(CaseSchema)).describe('An object where keys are city names and values are arrays of cases.'),
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
  {{#each casesByCity}}
  City: {{@key}}
    Cases: {{this.length}}
  {{/each}}

  Based on this data, provide:
  1.  A prediction about the risk of an outbreak in Roman Urdu.
  2.  A list of hotspot locations based on case count and severity.
  3.  A confidence score for your prediction (between 0 and 1).
  4.  Recommendations for health departments in Roman Urdu.
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
    if (!output) {
      throw new Error("Could not get a response from the AI.");
    }
    
    if (output.confidenceScore < 0.95) {
      output.prediction = `Low confidence prediction: ${output.prediction}. Please verify with more data.`;
    }
    
    return output;
  }
);
