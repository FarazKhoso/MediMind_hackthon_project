
import { Search, Calendar, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Search for Doctor',
    description:
      'Find the best doctors, clinics, and hospitals in your city.',
  },
  {
    icon: Calendar,
    title: 'Choose Time Slot',
    description: 'Select a convenient time slot that fits your schedule.',
  },
  {
    icon: CheckCircle,
    title: 'Book Instantly',
    description:
      'Confirm your appointment with a single click and get a confirmation.',
  },
];

export function HowItWorks() {
  return (
    <section className="bg-secondary/50 py-20 md:py-24">
      <div className="container">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl font-headline">
          How It Works
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-muted-foreground">
          Booking an appointment is easy and takes just 3 simple steps.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-card text-primary shadow-md">
                <step.icon className="h-10 w-10" />
              </div>
              <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-10 hidden h-px w-full translate-x-1/2 border-t-2 border-dashed border-border md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
