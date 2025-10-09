import { Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-primary focus:outline-none", className)}>
      <div className="p-2 bg-primary text-primary-foreground rounded-full">
        <Stethoscope className="h-6 w-6" />
      </div>
      <span className="font-headline text-2xl font-bold text-foreground">
        MediMind AI
      </span>
    </div>
  );
}
