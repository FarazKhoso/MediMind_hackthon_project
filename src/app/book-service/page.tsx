
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
import { Loader2, MapPin, Clock, DollarSign } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

// Mock map component
const MapPreview = () => (
    <div className="h-64 bg-muted rounded-md flex items-center justify-center">
        <p className="text-muted-foreground">Map Preview Placeholder</p>
    </div>
);

const bookingSchema = z.object({
  serviceType: z.enum(['doctor', 'nurse', 'compounder']),
  location: z.string().min(1, 'Location is required'), // For simplicity, we're using a string. In a real app, this would be a geo-coordinate.
  timing: z.enum(['now', '1hr', '2hr']),
  bidPrice: z.number().min(300).max(5000),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

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
      location: 'My Current Location', // Mock
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
    <div className="flex flex-col h-full">
         <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10">
            <h1 className="text-xl font-headline font-bold">Book a Home Service</h1>
            <SidebarTrigger />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <Card className="shadow-lg animate-in fade-in">
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline">Find a Provider</CardTitle>
                        <CardDescription>
                            Select a service, set your location, and make a bid.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="serviceType"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Service Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a service" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="doctor">Doctor</SelectItem>
                                            <SelectItem value="nurse">Nurse</SelectItem>
                                            <SelectItem value="compounder">Compounder</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2"><MapPin/> Location</FormLabel>
                                    <FormControl>
                                        <div>
                                            <MapPreview />
                                            <Input className="mt-2" placeholder="e.g., Block 13, Gulistan-e-Jauhar, Karachi" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="timing"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="flex items-center gap-2"><Clock/> Timing</FormLabel>
                                    <Select onValuecha
nge={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select timing" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="now">Immediately</SelectItem>
                                            <SelectItem value="1hr">Within 1 Hour</SelectItem>
                                            <SelectItem value="2hr">Within 2 Hours</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bidPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center justify-between">
                                            <span className="flex items-center gap-2"><DollarSign/> Your Bid (PKR)</span>
                                            <span className="font-bold text-lg text-primary">PKR {field.value}</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Slider
                                                min={300}
                                                max={5000}
                                                step={50}
                                                value={[field.value]}
                                                onValueChange={(values) => field.onChange(values[0])}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <Button type="submit" className="w-full" disabled={loading || isUserLoading}>
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
