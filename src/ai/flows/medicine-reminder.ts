
'use server';

/**
 * @fileOverview An AI agent for medicine and vaccination reminders.
 *
 * - medicineReminder - Sets up a reminder schedule.
 */

import {ai} from '@/ai/genkit';
import { MedicineReminderInputSchema, MedicineReminderOutputSchema, type MedicineReminderInput, type MedicineReminderOutput } from '@/app/schemas';

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
