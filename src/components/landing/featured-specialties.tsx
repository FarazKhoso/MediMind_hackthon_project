
import {
  Stethoscope,
  HeartPulse,
  Baby,
  Brain,
  Bone,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
  { name: 'General Physician', icon: Stethoscope },
  { name: 'Cardiologist', icon: HeartPulse },
  { name: 'Dentist', icon: ToothIcon },
  { name: 'Pediatrician', icon: Baby },
  { name: 'Neurologist', icon: Brain },
  { name: 'Orthopedic', icon: Bone },
];

export function FeaturedSpecialties() {
  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Find by Speciality
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-foreground/70">
          Top-rated doctors from various fields are here to help you.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {specialties.map((specialty) => (
            <Card
              key={specialty.name}
              className="group cursor-pointer overflow-hidden text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="mb-4 rounded-full bg-accent p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <specialty.icon className="h-8 w-8" />
                </div>
                <h3 className="text-sm font-semibold">{specialty.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
