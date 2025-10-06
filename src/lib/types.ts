import type { AIHealthQueryOutput } from '@/ai/flows/ai-health-query';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string | AIHealthQueryOutput;
}
