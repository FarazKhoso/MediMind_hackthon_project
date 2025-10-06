'use server';

/**
 * @fileOverview This flow checks the confidence level of an AI response and prompts the user to consult a doctor if it's below a threshold.
 *
 * - confidenceThresholdCheck - Checks the confidence level of an AI response.
 * - ConfidenceThresholdCheckInput - The input type for the confidenceThresholdCheck function.
 * - ConfidenceThresholdCheckOutput - The return type for the confidenceThresholdCheck function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConfidenceThresholdCheckInputSchema = z.object({
  aiResponse: z.string().describe('The AI generated response.'),
  confidenceScore: z.number().describe('The confidence score of the AI response (0-1).'),
});
export type ConfidenceThresholdCheckInput = z.infer<typeof ConfidenceThresholdCheckInputSchema>;

const ConfidenceThresholdCheckOutputSchema = z.object({
  response: z.string().describe('The AI response, possibly with a recommendation to consult a doctor.'),
});
export type ConfidenceThresholdCheckOutput = z.infer<typeof ConfidenceThresholdCheckOutputSchema>;

export async function confidenceThresholdCheck(input: ConfidenceThresholdCheckInput): Promise<ConfidenceThresholdCheckOutput> {
  return confidenceThresholdCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'confidenceThresholdCheckPrompt',
  input: {schema: ConfidenceThresholdCheckInputSchema},
  output: {schema: ConfidenceThresholdCheckOutputSchema},
  prompt: `{{#if (lt confidenceScore 0.95)}}The AI response is: {{{aiResponse}}}.  The AI has low confidence in this answer. Please consult a doctor for further advice.  Confidence score: {{{confidenceScore}}}.{{else}}The AI response is: {{{aiResponse}}}. Confidence score: {{{confidenceScore}}}.{{/if}}`,
});

const confidenceThresholdCheckFlow = ai.defineFlow(
  {
    name: 'confidenceThresholdCheckFlow',
    inputSchema: ConfidenceThresholdCheckInputSchema,
    outputSchema: ConfidenceThresholdCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
