
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, MapPin, Clock, DollarSign, Stethoscope, User, Syringe } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';


// Mock map component
const MapPreview = () => (
    <div className="h-64 bg-muted rounded-md flex items-center justify-center">
         <div className="text-center text-muted-foreground">
            <MapPin className="mx-auto h-12 w-12" />
            <p>Map Preview Placeholder</p>
        </div>
    </div>
);

const bookingSchema = z.object({
  serviceType: z.enum(['doctor', 'nurse', 'compounder']),
  location: z.string().min(1, 'Location is required'), // For simplicity, we're using a string. In a real app, this would be a geo-coordinate.
  timing: z.enum(['now', '1hr', '2hr']),
  bidPrice: z.number().min(300).max(5000),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const serviceTypes = [
    { value: 'doctor', label: 'Doctor', icon: Stethoscope },
    { value: 'nurse', label: 'Nurse', icon: User },
    { value: 'compounder', label: 'Compounder', icon: Syringe },
]

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
      location: '', // User must enter location
      timing: 'now',
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
        // In a real app, we'd add customer details here like name, rating etc.
        ...data,
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
         <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10">
            <h1 className="text-xl font-headline font-bold">Book a Home Service</h1>
            <SidebarTrigger />
        </header>
        <main className="flex-1 overflow-y-auto">
            <div className="relative">
                <div className="h-64 md:h-80">
                    <div className="h-full bg-muted flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                            <MapPin className="mx-auto h-12 w-12" />
                            <p>Map Preview Placeholder</p>
                        </div>
                    </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 md:relative md:p-0">
                    <Card className="shadow-lg animate-in fade-in md:shadow-none md:rounded-none md:border-0 -mb-16">
                        <CardContent className="p-4 md:p-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                
                                <div className="space-y-4">
                                     <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative">
                                                     <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                     <Input className="pl-10" placeholder="Enter your full address" {...field} />
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
                                                            className="pl-10 font-bold" 
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


                                <Button type="submit" size="lg" className="w-full font-bold" disabled={loading || isUserLoading}>
                                    {loading ? <Loader2 className="mr-2 animate-spin" /> : null}
                                    Find a Provider
                                </Button>
                            </form>
                        </Form>
                        </CardContent>
                    </Card>
                </div>

            </div>

        </main>
    </div>
  );
}
