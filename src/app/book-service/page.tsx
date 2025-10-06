
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, MapPin, DollarSign, Stethoscope, User, Syringe } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

const bookingSchema = z.object({
  serviceType: z.enum(['doctor', 'nurse', 'compounder']),
  location: z.string().min(1, 'Location is required'),
  bidPrice: z.number().min(300).max(5000),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const serviceTypes = [
    { value: 'doctor', label: 'Doctor', icon: Stethoscope },
    { value: 'nurse', label: 'Nurse', icon: User },
    { value: 'compounder', label: 'Compounder', icon: Syringe },
];

export default function BookServicePage() {
  const [loading, setLoading] = useState(false);
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceType: 'doctor',
      location: '', 
      bidPrice: 1000,
    },
  });

  const onSubmit: SubmitHandler<BookingFormValues> = async (data) => {
    setLoading(true);

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to book a service.',
      });
      setLoading(false);
      router.push('/login');
      return;
    }

    try {
      const docRef = await addDoc(collection(firestore, 'bookings'), {
        customerId: user.uid,
        ...data,
        timing: 'now', // Defaulting for new UI
        status: 'requested',
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Booking Request Sent!',
        description: 'Nearby providers have been notified. Please wait for a response.',
      });
      router.push(`/tracking/${docRef.id}`);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="absolute top-4 left-4 z-20">
          <SidebarTrigger />
      </div>
      <main className="flex-1 flex flex-col">
        <div className="flex-1 relative">
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                    <MapPin className="mx-auto h-12 w-12" />
                    <p>Map Preview Placeholder</p>
                </div>
            </div>
        </div>
        
        <div className="bg-background p-4 rounded-t-2xl shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
          <Card className="border-0 shadow-none">
              <CardContent className="p-2">
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      
                      <FormField
                          control={form.control}
                          name="serviceType"
                          render={({ field }) => (
                              <FormItem>
                                  <div className="grid grid-cols-3 gap-2">
                                      {serviceTypes.map((service) => (
                                          <Button
                                              key={service.value}
                                              type="button"
                                              variant={field.value === service.value ? 'default' : 'outline'}
                                              className="h-auto flex-col gap-1 py-3"
                                              onClick={() => field.onChange(service.value)}
                                          >
                                              <service.icon className="h-6 w-6 mb-1"/>
                                              <span>{service.label}</span>
                                          </Button>
                                      ))}
                                  </div>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      
                      <div className="space-y-3">
                            <FormField
                              control={form.control}
                              name="location"
                              render={({ field }) => (
                              <FormItem>
                                  <FormControl>
                                      <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <Input className="pl-10 h-11" placeholder="Enter your full address" {...field} />
                                      </div>
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="bidPrice"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormControl>
                                          <div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                <Input 
                                                  type="number" 
                                                  className="pl-10 h-11 font-bold" 
                                                  placeholder="Offer your fare"
                                                  value={field.value}
                                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                />
                                          </div>
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                      </div>


                      <Button type="submit" size="lg" className="w-full font-bold h-12" disabled={loading || isUserLoading}>
                          {loading ? <Loader2 className="mr-2 animate-spin" /> : null}
                          Find and Request Provider
                      </Button>
                  </form>
              </Form>
              </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
