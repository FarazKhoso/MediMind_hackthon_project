'use server';

/**
 * @fileOverview An AI agent to securely fetch patient data from Firestore.
 *
 * - fetchPatientData - A function that fetches patient data based on a patient ID.
 * - FetchPatientDataInput - The input type for the fetchPatientData function.
 * - FetchPatientDataOutput - The return type for the fetchPatientData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getPatientData } from '@/services/firestore';

const FetchPatientDataInputSchema = z.object({
  patientId: z.string().describe('The ID of the patient to fetch data for.'),
});
export type FetchPatientDataInput = z.infer<typeof FetchPatientDataInputSchema>;

const FetchPatientDataOutputSchema = z.object({
  patientData: z.record(z.any()).describe('The fetched patient data from Firestore.'),
});
export type FetchPatientDataOutput = z.infer<typeof FetchPatientDataOutputSchema>;

export async function fetchPatientData(input: FetchPatientDataInput): Promise<FetchPatientDataOutput> {
  return fetchPatientDataFlow(input);
}

const fetchPatientDataFlow = ai.defineFlow(
  {
    name: 'fetchPatientDataFlow',
    inputSchema: FetchPatientDataInputSchema,
    outputSchema: FetchPatientDataOutputSchema,
  },
  async input => {
    const patientData = await getPatientData(input.patientId);
    return { patientData };
  }
);
