// src/ai/flows/ai-health-query.ts
'use server';

/**
 * @fileOverview An AI health query agent.
 *
 * - aiHealthQuery - A function that handles the health query process.
 * - AIHealthQueryInput - The input type for the aiHealthQuery function.
 * - AIHealthQueryOutput - The return type for the aiHealthQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIHealthQueryInputSchema = z.object({
  query: z.string().describe('The health-related query from the user.'),
});
export type AIHealthQueryInput = z.infer<typeof AIHealthQueryInputSchema>;

const AIHealthQueryOutputSchema = z.object({
  insights: z.string().describe('Potential insights related to the query.'),
  riskFactors: z.string().describe('Potential risk factors related to the query.'),
  nextSteps: z.string().describe('Possible next steps based on the query.'),
  confidenceScore: z.number().describe('Confidence score of the AI response (0-1).'),
  handoffRequired: z.boolean().describe('Indicates if a handoff to a doctor is required.'),
});
export type AIHealthQueryOutput = z.infer<typeof AIHealthQueryOutputSchema>;

export async function aiHealthQuery(input: AIHealthQueryInput): Promise<AIHealthQueryOutput> {
  return aiHealthQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiHealthQueryPrompt',
  input: {schema: AIHealthQueryInputSchema},
  output: {schema: AIHealthQueryOutputSchema},
  prompt: `You are an AI health assistant providing insights, risk factors, and next steps based on user queries.

  Query: {{{query}}}

  Provide your response in a structured format, including insights, risk factors, and possible next steps. Also, provide a confidence score (0-1) for your response and indicate if a handoff to a doctor is required.

  Insights:
  Risk Factors:
  Next Steps:
  Confidence Score:
  Handoff Required: `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const aiHealthQueryFlow = ai.defineFlow(
  {
    name: 'aiHealthQueryFlow',
    inputSchema: AIHealthQueryInputSchema,
    outputSchema: AIHealthQueryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
