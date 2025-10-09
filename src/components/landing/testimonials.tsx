import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const testimonials = [
  {
    name: 'Ahmed Raza',
    location: 'Karachi',
    review:
      'Finding a specialist was so easy with MediConnect. The booking process was seamless and I got an appointment for the next day. Highly recommended!',
    image: 'https://picsum.photos/seed/user1/100/100',
  },
  {
    name: 'Sana Javed',
    location: 'Lahore',
    review:
      'A lifesaver for my family! The app is user-friendly and the doctors are highly professional. The reminder feature is a great bonus.',
    image: 'https://picsum.photos/seed/user2/100/100',
  },
  {
    name: 'Faisal Khan',
    location: 'Islamabad',
    review:
      'I was able to find a dermatologist in my area within minutes. The experience was much better than traditional methods. 5 stars!',
    image: 'https://picsum.photos/seed/user3/100/100',
  },
];

const Rating = ({ stars }: { stars: number }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: stars }, (_, i) => (
      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
    ))}
  </div>
);

export function Testimonials() {
  return (
    <section className="bg-secondary/30 py-20 md:py-24">
      <div className="container">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          What Our Patients Say
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-lg text-foreground/70">
          Real stories from real people who trust us with their health.
        </p>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="mx-auto mt-12 w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card className="h-full">
                    <CardContent className="flex h-full flex-col justify-between p-6">
                      <div>
                        <Rating stars={5} />
                        <p className="mt-4 text-foreground/80">
                          "{testimonial.review}"
                        </p>
                      </div>
                      <div className="mt-6 flex items-center gap-4">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div>
                          <h4 className="font-bold">{testimonial.name}</h4>
                          <p className="text-sm text-foreground/60">
                            {testimonial.location}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
