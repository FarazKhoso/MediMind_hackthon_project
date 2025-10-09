
'use client';

import { useAppMode } from '@/hooks/use-app-mode';
import ProviderDashboard from './dashboard/page';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Bot, Stethoscope, Syringe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';

const featureCards = [
  {
    title: "AI Symptom Checker",
    description: "Apni alamaat batayein aur fori AI-powered mashwara hasil karein.",
    icon: Bot,
    href: "/symptom-checker"
  },
  {
    title: "Book a Doctor",
    description: "Apne qareebi verified doctors, nurses, ya compounders se rabta karein.",
    icon: Stethoscope,
    href: "/book-service"
  },
  {
    title: "Medicine Reminders",
    description: "Dawa aur vaccine ke liye reminders set karein, taake aap kabhi na bhoolein.",
    icon: Syringe,
    href: "/medicine-reminder"
  }
];

function PatientLandingPage() {
  return (
    <div className="flex flex-col h-full bg-background">
       <header className="p-4 border-b bg-card shadow-sm text-center sticky top-0 z-10 backdrop-blur-sm bg-card/80">
         <Logo />
      </header>
      <main className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <section className="bg-card/50 text-center py-16 md:py-24 px-4">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
            Aapki Sehat, Hamari Fikar
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            MediMind AI aapko Roman Urdu mein fori medical mashwaray, ghar par doctor bulane ki sahulat, aur sehat ke reminders faraham karta hai.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="font-bold">
              <Link href="/symptom-checker">AI Se Baat Karein</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/book-service">Doctor Book Karein <ArrowRight className="ml-2" /></Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-20 px-4">
            <h2 className="text-3xl font-headline font-bold text-center mb-10">Hamari Services</h2>
            <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
              {featureCards.map((feature, index) => (
                <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center">
                        <feature.icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="pt-4 font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
        </section>
      </main>
    </div>
  );
}


export default function Home() {
  const { mode } = useAppMode();
  const { user, isUserLoading, userProfile } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If a user is logged in, their role dictates the view.
  if (user && userProfile) {
    if (userProfile.role === 'provider') {
        return <ProviderDashboard />;
    }
     // Logged in patients see the landing page too now
    return <PatientLandingPage />;
  }

  // If not logged in, the view is based on the selected mode.
  if (mode === 'provider') {
    return <ProviderDashboard />;
  }

  return <PatientLandingPage />;
}
