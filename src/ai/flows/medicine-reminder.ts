
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
  prompt: `You are a reminder-setting AI assistant for a health app in Pakistan. Your job is to parse the user's request (either text or an image of a prescription) and create a schedule for ALL medicines mentioned. Respond with a confirmation in Roman Urdu.

  User Request: "{{{request}}}"
  {{#if reportImage}}
  Prescription Image: {{media url=reportImage}}
  {{/if}}
  
  Analyze the text request and/or the image to extract ALL medicines/vaccines, along with their respective frequencies, dates, and times.
  Return these as an array of schedule objects.
  For a request like "panadol 6 pm and ponistan 9 am", you must return two schedule objects in the array.
  
  Provide a single, general confirmation message like: "Theek hai, aapke liye reminders set kar diye gaye hain."
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
