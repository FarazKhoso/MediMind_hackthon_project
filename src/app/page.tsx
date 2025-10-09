
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bot,
  Stethoscope,
  Syringe,
  MessageSquareHeart,
  HeartPulse,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}) => (
  <Link href={href} className="block h-full">
    <Card className="group h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/50">
      <CardHeader>
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-accent">
          <Icon className="h-8 w-8" />
        </div>
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </Link>
);

export default function HomePage() {
  const router = useRouter();
  return (
    <div className="flex min-h-full flex-col bg-background">
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-32">
          <div className="container relative z-10 text-center">
             <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl font-headline">
              Aapki Sehat, Hamari Fikar.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              AI-powered health services aapke ghar tak. Fori mashwara, home
              service booking, aur bohat kuch.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-12 text-base font-bold"
                onClick={() => router.push('/symptom-checker')}
              >
                <Bot className="mr-2" />
                AI Se Baat Karein
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 text-base font-bold"
                onClick={() => router.push('/book-service')}
              >
                <Stethoscope className="mr-2" />
                Ghar par Service Book Karein
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="container">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl font-headline">
                Hamari Unique AI Services
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Technology ki taqat se apni sehat ka khayal rakhein, aasani se.
                </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={Bot}
                title="AI Symptom Checker"
                description="Apni alamaat batayein aur fori AI-powered tajziya aur mashwara haasil karein."
                href="/symptom-checker"
              />
              <FeatureCard
                icon={HeartPulse}
                title="Health Data Analysis"
                description="Apne BP, sugar, aur heart rate ka record rakhein aur AI se analysis karwayein."
                href="/health-analysis"
              />
              <FeatureCard
                icon={Syringe}
                title="Medicine Reminders"
                description="Dawa ya vaccine ki yaad-dehani set karein, sirf likh kar ya prescription upload kar ke."
                href="/medicine-reminder"
              />
              <FeatureCard
                icon={MessageSquareHeart}
                title="Mental Health Chatbot"
                description="Stress, anxiety, ya depression par hamare hamdard AI dost se baat karein."
                href="/mental-health"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
