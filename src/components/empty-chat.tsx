import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { agentExamples } from '@/lib/agent-examples';

interface EmptyChatProps {
  onQuery: (query: string) => void;
  agent?: string;
}

export function EmptyChat({ onQuery, agent = 'General Physician' }: EmptyChatProps) {
  const examples = agentExamples[agent] || agentExamples.default;

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-lg p-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline mb-4">
          {agent === 'General Physician' ? 'AI Symptom Checker' : `${agent} AI Agent`}
        </h1>
        <p className="text-muted-foreground mb-2 font-semibold text-lg">{examples.greeting}</p>
        <p className="text-muted-foreground mb-8">
          Start a conversation by typing a query below or select an example.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {examples.queries.map((query, i) => (
            <Button
              key={i}
              variant="outline"
              className="text-left justify-start h-auto p-3 whitespace-normal"
              onClick={() => onQuery(query)}
            >
              <Lightbulb className="mr-3 h-5 w-5 shrink-0" />
              <span>{query}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
