
'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';

export function ProviderHeroSection() {
  const router = useRouter();

  return (
    <main className="flex-1">
      <section className="relative flex items-center justify-center h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl font-headline">
            Welcome, Health Provider
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Manage your booking requests, communicate with patients, and grow your practice.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              className="h-12 text-base font-bold"
              onClick={() => router.push('/dashboard')}
            >
              <LayoutDashboard className="mr-2" />
              Go to Dashboard
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
