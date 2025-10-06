'use server';

/**
 * @fileOverview An AI agent for medicine and vaccination reminders.
 *
 * - medicineReminder - Sets up a reminder schedule.
 * - MedicineReminderInput - The input type for the medicineReminder function.
 * - MedicineReminderOutput - The return type for the medicineReminder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const MedicineReminderInputSchema = z.object({
  request: z.string().describe("User's request for a reminder. e.g., 'Set a reminder for Panadol every 6 hours' or 'Polio vaccine is due on 10/10/2025'"),
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

export async function medicineReminder(input: MedicineReminderInput): Promise<MedicineReminderOutput> {
  return medicineReminderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicineReminderPrompt',
  input: {schema: MedicineReminderInputSchema},
  output: {schema: MedicineReminderOutputSchema},
  prompt: `You are a reminder-setting AI assistant for a health app in Pakistan. Your job is to parse the user's request and create a schedule. Respond with a confirmation in Roman Urdu.

  User Request: "{{{request}}}"
  
  Parse the medicine/vaccine name, frequency, date, and time.
  Provide a confirmation message like: "Theek hai, aapke liye [Medicine/Vaccine Name] ki reminder set kar di gayi hai."
  `,
});

const medicineReminderFlow = ai.defineFlow(
  {
    name: 'medicineReminderFlow',
    inputSchema: MedicineReminderInputSchema,
    outputSchema: MedicineReminderOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Could not get a response from the AI.");
    }
    // In a real app, this `output.schedule` would be used to set up notifications via FCM and save to a local db for offline sync.
    return output;
  }
);
