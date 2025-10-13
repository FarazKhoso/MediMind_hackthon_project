
import type { AIHealthQueryOutput } from '@/ai/flows/ai-health-query';

// Extend AIHealthQueryOutput to include the specialty determined by the 'auto' feature.
export interface EnrichedAIOutput extends AIHealthQueryOutput {
    specialty?: string;
}

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string | EnrichedAIOutput;
}
