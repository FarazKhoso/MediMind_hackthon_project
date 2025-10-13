
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
  specialty: z.string().optional().describe('The specialty of the AI agent, e.g., Cardiologist.'),
});
export type AIHealthQueryInput = z.infer<typeof AIHealthQueryInputSchema>;

const AIHealthQueryOutputSchema = z.object({
  insights: z.string().describe('Potential insights related to the query. "N/A" if the query is not health-related.'),
  riskFactors: z.string().describe('Potential risk factors related to the query. "N/A" if the query is not health-related.'),
  nextSteps: z.string().describe('Possible next steps based on the query. "N/A" if the query is not health-related.'),
  confidenceScore: z.number().describe('Confidence score of the AI response (0-1).'),
  handoffRequired: z.boolean().describe('Indicates if a handoff to a doctor is required.'),
  isMedicalQuery: z.boolean().describe('A boolean flag indicating if the query was determined to be medical or not.'),
  declineMessage: z.string().optional().describe('The polite decline message if the query is not health-related.'),
});
export type AIHealthQueryOutput = z.infer<typeof AIHealthQueryOutputSchema>;

export async function aiHealthQuery(input: AIHealthQueryInput): Promise<AIHealthQueryOutput> {
  return aiHealthQueryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiHealthQueryPrompt',
  input: {schema: AIHealthQueryInputSchema},
  output: {schema: AIHealthQueryOutputSchema},
  prompt: `You are a sophisticated medical AI assistant.
{{#if specialty}}
Your specialty is "{{{specialty}}}". When asked about your identity, you must state that you are a "{{{specialty}}}" AI assistant.
{{/if}}
Your primary function is to provide health-related information, focusing on your area of expertise if specified. You must adhere to the following rules:

1.  **Language Detection**: First, detect the language of the user's query. It will be either English or Roman Urdu. You MUST respond in the same language.
2.  **Health-Related Guardrail**: Analyze the query to determine if it is health-related.
    *   **If the query IS health-related**:
        *   Set the 'isMedicalQuery' flag to true.
        *   Provide insights, potential risk factors, and possible next steps in a structured format in the user's language. If a specialty is defined, tailor your answer from that perspective.
        *   Set the 'declineMessage' field to an empty string.
    *   **If the query IS NOT health-related**:
        *   Set the 'isMedicalQuery' flag to false.
        *   You MUST politely decline.
        *   If the query was in English, set the 'declineMessage' field to: "I am a medical AI assistant and can only answer health-related questions."
        *   If the query was in Roman Urdu, set the 'declineMessage' field to: "Main ek medical AI assistant hoon aur sirf sehat se mutalliq sawalon ke jawab de sakta hoon."
        *   In this case, set the 'insights', 'riskFactors', and 'nextSteps' fields in your output to "N/A".

3.  **Confidence & Handoff**:
    *   For health-related queries, provide a confidence score (0-1) and determine if a handoff to a human doctor is required.
    *   For non-health queries, set confidence to 0 and handoff to false.

User Query: {{{query}}}
`,
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
