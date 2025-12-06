import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// The googleAI plugin automatically reads GEMINI_API_KEY or GOOGLE_API_KEY from environment variables
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
