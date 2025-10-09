
'use client';

import { Search, Calendar, CheckCircle, Bot, Type, FileText } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { translations } from '@/lib/translations';

export function HowItWorks() {
  const { language } = useLanguage();
  const t = translations[language].home.howItWorks;

  const steps = [
    {
      icon: Bot,
      title: t.stepAi1Title,
      description: t.stepAi1Description,
      category: "AI Assistant"
    },
     {
      icon: Type,
      title: t.stepAi2Title,
      description: t.stepAi2Description,
      category: "AI Assistant"
    },
    {
      icon: FileText,
      title: t.stepAi3Title,
      description: t.stepAi3Description,
      category: "AI Assistant"
    },
    {
      icon: Search,
      title: t.stepBooking1Title,
      description: t.stepBooking1Description,
      category: "Book a Doctor"
    },
    {
      icon: Calendar,
      title: t.stepBooking2Title,
      description: t.stepBooking2Description,
      category: "Book a Doctor"
    },
    {
      icon: CheckCircle,
      title: t.stepBooking3Title,
      description: t.stepBooking3Description,
      category: "Book a Doctor"
    },
  ];

  return (
    <section className="bg-secondary/50 py-20 md:py-24">
      <div className="container">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl font-headline">
          {t.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-muted-foreground">
          {t.subtitle}
        </p>
        <div className="mt-16 space-y-16">
            {/* AI Assistant Steps */}
            <div>
                <h3 className="text-center text-2xl font-bold text-primary font-headline mb-8">{t.aiAssistantTitle}</h3>
                <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
                {steps.filter(s => s.category === "AI Assistant").map((step, index) => (
                    <div
                    key={step.title}
                    className="relative flex flex-col items-center text-center"
                    >
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-card text-primary shadow-md">
                        <step.icon className="h-10 w-10" />
                    </div>
                    <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                    {index < 2 && (
                        <div className="absolute left-1/2 top-10 hidden h-px w-full translate-x-1/2 border-t-2 border-dashed border-border md:block" />
                    )}
                    </div>
                ))}
                </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
                <div className="w-full h-px bg-border"></div>
                <div className="absolute bg-secondary/50 px-4 text-sm text-muted-foreground font-semibold">OR</div>
            </div>

            {/* Booking Steps */}
            <div>
                 <h3 className="text-center text-2xl font-bold text-primary font-headline mb-8">{t.bookingTitle}</h3>
                <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
                {steps.filter(s => s.category === "Book a Doctor").map((step, index) => (
                    <div
                    key={step.title}
                    className="relative flex flex-col items-center text-center"
                    >
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-card text-primary shadow-md">
                        <step.icon className="h-10 w-10" />
                    </div>
                    <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                    {index < 2 && (
                        <div className="absolute left-1/2 top-10 hidden h-px w-full translate-x-1/2 border-t-2 border-dashed border-border md:block" />
                    )}
                    </div>
                ))}
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
