'use server';

/**
 * @fileOverview Initiates a handoff request to available doctors via FCM if the AI determines a user should consult with a medical professional.
 *
 * - initiateDoctorHandoff - A function that initiates the doctor handoff process.
 * - InitiateDoctorHandoffInput - The input type for the initiateDoctorHandoff function.
 * - InitiateDoctorHandoffOutput - The return type for the initiateDoctorHandoff function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InitiateDoctorHandoffInputSchema = z.object({
  patientQuery: z.string().describe('The patient\s health query.'),
  aiDiagnosis: z.string().describe('The AI\s diagnosis of the patient\s query.'),
  confidenceScore: z.number().describe('The confidence score of the AI\s diagnosis (0-1).'),
});
export type InitiateDoctorHandoffInput = z.infer<typeof InitiateDoctorHandoffInputSchema>;

const InitiateDoctorHandoffOutputSchema = z.object({
  handoffInitiated: z.boolean().describe('Whether the handoff request to a doctor was initiated.'),
  message: z.string().describe('A message indicating the status of the handoff request.'),
});
export type InitiateDoctorHandoffOutput = z.infer<typeof InitiateDoctorHandoffOutputSchema>;

export async function initiateDoctorHandoff(input: InitiateDoctorHandoffInput): Promise<InitiateDoctorHandoffOutput> {
  return initiateDoctorHandoffFlow(input);
}

const prompt = ai.definePrompt({
  name: 'initiateDoctorHandoffPrompt',
  input: {schema: InitiateDoctorHandoffInputSchema},
  output: {schema: InitiateDoctorHandoffOutputSchema},
  prompt: `You are an AI assistant that determines if a doctor handoff is required and initiates it via FCM.

  Patient Query: {{{patientQuery}}}
  AI Diagnosis: {{{aiDiagnosis}}}
  Confidence Score: {{{confidenceScore}}}

  Based on the patient query, AI diagnosis, and confidence score, determine if a doctor handoff is necessary.  If the confidence score is below 0.95, a handoff is required.
  If a handoff is required, initiate the handoff process via FCM.  Then respond indicating that the handoff has been initiated along with the message that it was initiated. If a handoff is not required, respond that no handoff was required.

  Return a JSON object with the following format:
  {
    "handoffInitiated": true or false,
    "message": "A message indicating the status of the handoff request."
  }`,
});

const initiateDoctorHandoffFlow = ai.defineFlow(
  {
    name: 'initiateDoctorHandoffFlow',
    inputSchema: InitiateDoctorHandoffInputSchema,
    outputSchema: InitiateDoctorHandoffOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // TODO: Add FCM integration here to actually initiate the handoff.
    // The current implementation only returns the AI's decision.
    return output!;
  }
);
