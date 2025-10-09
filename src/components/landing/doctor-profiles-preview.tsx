import Image from 'next/image';
import { Star, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const doctors = [
  {
    name: 'Dr. Aisha Khan',
    specialty: 'Cardiologist',
    rating: 4.9,
    reviews: 120,
    image: 'https://picsum.photos/seed/doc1/200/200',
  },
  {
    name: 'Dr. Bilal Ahmed',
    specialty: 'Dermatologist',
    rating: 4.8,
    reviews: 88,
    image: 'https://picsum.photos/seed/doc2/200/200',
  },
  {
    name: 'Dr. Fatima Zahra',
    specialty: 'Pediatrician',
    rating: 5.0,
    reviews: 210,
    image: 'https://picsum.photos/seed/doc3/200/200',
  },
];

export function DoctorProfilesPreview() {
  return (
    <section className="py-20 md:py-24 bg-secondary/30">
      <div className="container">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Our Top Rated Doctors
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-foreground/70">
          Trusted by thousands of patients for their exceptional care.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <Card
              key={doctor.name}
              className="overflow-hidden text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <CardContent className="p-6">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  width={120}
                  height={120}
                  className="mx-auto rounded-full border-4 border-white shadow-md"
                />
                <h3 className="mt-4 text-xl font-bold">{doctor.name}</h3>
                <p className="mt-1 text-primary">{doctor.specialty}</p>
                <div className="mt-3 flex items-center justify-center gap-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                    <span className="font-bold">{doctor.rating}</span>
                    <span className="text-foreground/60">
                      ({doctor.reviews})
                    </span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    Verified
                  </Badge>
                </div>
                <Button className="mt-6 w-full">Book Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
