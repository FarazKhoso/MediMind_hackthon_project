import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-accent/50 via-background to-background py-20 md:py-32">
      <div className="container relative z-10 grid items-center gap-12 md:grid-cols-2">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter text-foreground md:text-5xl lg:text-6xl">
            Book Doctor Appointments Online, Anytime.
          </h1>
          <p className="mt-4 max-w-lg text-lg text-foreground/70">
            Find the right specialist near you in minutes. Easy, fast, and
            reliable healthcare access.
          </p>
          <Card className="mt-8 w-full max-w-lg shadow-lg">
            <CardContent className="p-4">
              <form className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-center">
                <div className="sm:col-span-1">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dentist">Dentist</SelectItem>
                      <SelectItem value="cardiologist">Cardiologist</SelectItem>
                      <SelectItem value="dermatologist">
                        Dermatologist
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-1">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="karachi">Karachi</SelectItem>
                      <SelectItem value="lahore">Lahore</SelectItem>
                      <SelectItem value="islamabad">Islamabad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button size="lg" className="h-12 w-full sm:col-span-1">
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="relative hidden h-80 md:block lg:h-96">
          <Image
            src="https://picsum.photos/seed/doc-hero/600/600"
            alt="Doctor Illustration"
            width={600}
            height={600}
            className="h-full w-full rounded-full object-cover object-top shadow-2xl"
            data-ai-hint="doctor illustration"
          />
        </div>
      </div>
    </section>
  );
}
