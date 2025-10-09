import { HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 text-primary focus:outline-none',
        className
      )}
    >
      <div className="rounded-full bg-primary p-2 text-primary-foreground">
        <HeartPulse className="h-6 w-6" />
      </div>
      <span className="font-headline text-2xl font-bold text-foreground">
        MediConnect
      </span>
    </Link>
  );
}
