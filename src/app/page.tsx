
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
import { useLanguage } from '@/hooks/use-language';
import { translations } from '@/lib/translations';
import { HowItWorks } from '@/components/landing/how-it-works';
import { DoctorProfilesPreview } from '@/components/landing/doctor-profiles-preview';
import { Testimonials } from '@/components/landing/testimonials';
import { FeaturedSpecialties } from '@/components/landing/featured-specialties';

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
  const { language } = useLanguage();
  const t = translations[language];

  const features = [
    {
      icon: Bot,
      title: t.home.feature1Title,
      description: t.home.feature1Description,
      href: '/symptom-checker',
    },
    {
      icon: HeartPulse,
      title: t.home.feature2Title,
      description: t.home.feature2Description,
      href: '/health-analysis',
    },
    {
      icon: Syringe,
      title: t.home.feature3Title,
      description: t.home.feature3Description,
      href: '/medicine-reminder',
    },
    {
      icon: MessageSquareHeart,
      title: t.home.feature4Title,
      description: t.home.feature4Description,
      href: '/mental-health',
    },
  ];

  return (
    <div className="flex min-h-full flex-col bg-background">
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-32">
          <div className="container relative z-10 text-center">
             <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl font-headline">
              {t.home.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              {t.home.subtitle}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-12 text-base font-bold"
                onClick={() => router.push('/symptom-checker')}
              >
                <Bot className="mr-2" />
                {t.home.mainCta}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 text-base font-bold"
                onClick={() => router.push('/book-service')}
              >
                <Stethoscope className="mr-2" />
                {t.home.secondaryCta}
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24 bg-secondary/50">
          <div className="container">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl font-headline">
                {t.home.featuresTitle}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                {t.home.featuresSubtitle}
                </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  href={feature.href}
                />
              ))}
            </div>
          </div>
        </section>
        <HowItWorks />
        <DoctorProfilesPreview />
        <FeaturedSpecialties />
        <Testimonials />
      </main>
    </div>
  );
}
