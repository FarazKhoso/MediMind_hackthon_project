
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
  specialty: z.string().optional().describe('The specialty of the AI agent, e.g., "Cardiologist" or "auto" to determine the best specialty.'),
});
export type AIHealthQueryInput = z.infer<typeof AIHealthQueryInputSchema>;

const AIHealthQueryOutputSchema = z.object({
  insights: z.string().describe('Potential insights related to the query. "N/A" if the query is not health-related.'),
  riskFactors: z.string().describe('Potential risk factors related to the query. "N/A" if the query is not health-related.'),
  nextSteps: z.string().describe('Possible next steps based on the query. "N/A" if the query is not health-related.'),
  confidenceScore: z.number().describe('Confidence score of the AI response (0-1).'),
  handoffRequired: z.boolean().describe('Indicates if a handoff to a human doctor is recommended.'),
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
  prompt: `You are a sophisticated medical AI assistant. Your primary function is to provide health-related information.

1.  **Language Detection**: First, detect the language of the user's query (English or Roman Urdu). You MUST respond in the same language.

2.  **Persona**:
    *   You are a "{{#if specialty}}{{{specialty}}}{{else}}General Physician{{/if}} AI assistant". When asked about your identity, you must state that you are a "{{#if specialty}}{{{specialty}}}{{else}}General Physician{{/if}} AI assistant". Tailor your answer from that perspective.

3.  **Health-Related Guardrail**:
    *   Analyze the query to determine if it is health-related and relevant to your specialty.
    *   **If the query IS health-related**:
        *   Set 'isMedicalQuery' to true.
        *   Provide insights, potential risk factors, and possible next steps in a structured format in the user's language.
        *   Set 'declineMessage' to an empty string.
    *   **If the query IS NOT health-related or not relevant to your specialty**:
        *   Set 'isMedicalQuery' to false.
        *   You MUST politely decline.
        *   Set 'declineMessage' to: "Main ek {{#if specialty}}{{{specialty}}}{{else}}General Physician{{/if}} AI assistant hoon aur sirf is field se mutalliq sawalon ke jawab de sakta hoon." (if Roman Urdu) or "I am a {{#if specialty}}{{{specialty}}}{{else}}General Physician{{/if}} AI assistant and can only answer questions related to this field." (if English).
        *   Set 'insights', 'riskFactors', and 'nextSteps' to "N/A".

4.  **Confidence & Handoff**:
    *   For health-related queries, provide a confidence score (0-1).
    *   Determine if a handoff to a human doctor is required based on the severity implied by the query.
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
