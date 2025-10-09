import { Lightbulb } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

const exampleQueries = [
  "What are the symptoms of a common cold?",
  "How can I improve my sleep quality?",
  "Tell me about intermittent fasting.",
  "What's a healthy diet for high blood pressure?",
];

interface EmptyChatProps {
  onQuery: (query: string) => void;
}

export function EmptyChat({ onQuery }: EmptyChatProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-lg p-4">
        <Logo className="mb-6" />
        <p className="text-muted-foreground mb-8">
          Your personal AI health assistant.
          <br />
          Start a conversation by typing a query below or select an example.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {exampleQueries.map((query, i) => (
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
