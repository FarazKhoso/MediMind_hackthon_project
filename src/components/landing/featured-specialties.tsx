
'use client';

import {
  Stethoscope,
  HeartPulse,
  Baby,
  Brain,
  Bone,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';

// Custom inline SVG for the Tooth icon
const ToothIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12.25 22c-3.13 0-4.63-3.63-4.63-3.63a1.5 1.5 0 0 1 2.38-2.12c1.33 1.22 2.25 2.75 4.63 2.75s3.3-1.53 4.63-2.75a1.5 1.5 0 0 1 2.38 2.12S15.38 22 12.25 22Z" />
        <path d="M12.25 2c-3.13 0-4.63 3.63-4.63 3.63a1.5 1.5 0 0 0 2.38 2.12c1.33-1.22 2.25-2.75 4.63-2.75s3.3 1.53 4.63 2.75a1.5 1.5 0 0 0 2.38-2.12S15.38 2 12.25 2Z" />
        <path d="M5.5 8.25a1.5 1.5 0 0 0-1.25 2.38c1.22 1.33 2.75 2.25 2.75 4.63s-1.53 3.3-2.75 4.63A1.5 1.5 0 0 0 5.5 22" />
        <path d="M19 8.25a1.5 1.5 0 0 1 1.25 2.38c-1.22 1.33-2.75 2.25-2.75 4.63s1.53 3.3 2.75 4.63a1.5 1.5 0 0 1-1.25 2.38" />
    </svg>
);


const specialties = [
  { name: 'General Physician', icon: Stethoscope, agentId: 'general' },
  { name: 'Cardiologist', icon: HeartPulse, agentId: 'cardio' },
  { name: 'Dentist', icon: ToothIcon, agentId: 'dental' },
  { name: 'Pediatrician', icon: Baby, agentId: 'peds' },
  { name: 'Neurologist', icon: Brain, agentId: 'neuro' },
  { name: 'Orthopedic', icon: Bone, agentId: 'ortho' },
];

export function FeaturedSpecialties() {
  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Talk to a Specialist AI Agent
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-foreground/70">
          Get instant, specialized advice from our AI agents, trained in various medical fields.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
          {specialties.map((specialty) => (
            <Card
              key={specialty.name}
              className="group overflow-hidden text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col"
            >
              <CardContent className="flex flex-col items-center justify-between p-6 flex-1">
                <div className="flex-grow flex flex-col items-center justify-center">
                  <div className="mb-4 rounded-full bg-accent p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <specialty.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-sm font-semibold">{specialty.name}</h3>
                </div>
                <Link href={`/symptom-checker?agent=${specialty.agentId}`} className="w-full mt-4">
                    <Button variant="outline" size="sm" className="w-full">Talk Now</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
