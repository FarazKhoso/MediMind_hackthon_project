'use server';

/**
 * @fileOverview An empathetic AI agent for mental health support.
 *
 * - mentalHealthChatbot - Provides support for stress, anxiety, and depression.
 * - MentalHealthChatbotInput - The input type for the mentalHealthChatbot function.
 * - MentalHealthChatbotOutput - The return type for the mentalHealthChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const MentalHealthChatbotInputSchema = z.object({
  message: z.string().describe("User's message about their mental state."),
});
export type MentalHealthChatbotInput = z.infer<typeof MentalHealthChatbotInputSchema>;

export const MentalHealthChatbotOutputSchema = z.object({
  response: z.string().describe('An empathetic response with coping tips in Roman Urdu.'),
  escalate: z.boolean().describe('A flag to indicate if the case seems serious and requires handoff.'),
});
export type MentalHealthChatbotOutput = z.infer<typeof MentalHealthChatbotOutputSchema>;

export async function mentalHealthChatbot(input: MentalHealthChatbotInput): Promise<MentalHealthChatbotOutput> {
  return mentalHealthChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mentalHealthChatbotPrompt',
  input: {schema: MentalHealthChatbotInputSchema},
  output: {schema: MentalHealthChatbotOutputSchema},
  prompt: `You are an empathetic and supportive mental health chatbot for users in Pakistan. Your primary language is Roman Urdu. A user is reaching out to you.

  User's Message: "{{{message}}}"

  Please provide a kind, supportive, and non-judgmental response. Offer simple, actionable coping strategies (like deep breathing, short walks, or talking to a friend). 
  
  IMPORTANT: Do NOT act as a therapist. Keep your advice general. Always include the disclaimer: "Yaad rakhein, main ek AI hoon, professional therapist nahi. Agar aapko zyada pareshani ho, to kisi expert se zaroor baat karein."
  
  If the user's message contains any indication of self-harm, severe depression, or a crisis, set the 'escalate' flag to true. Otherwise, keep it false.
  `,
});

const mentalHealthChatbotFlow = ai.defineFlow(
  {
    name: 'mentalHealthChatbotFlow',
    inputSchema: MentalHealthChatbotInputSchema,
    outputSchema: MentalHealthChatbotOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Could not get a response from the AI.");
    }
    return output;
  }
);
