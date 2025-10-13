
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
  CardFooter
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  phone: z.string().min(10, 'Enter a valid phone number.'),
  serviceType: z.enum(['doctor', 'nurse', 'compounder']),
  licenseUrl: z.string().url('Please enter a valid URL to your license.'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterProviderPage() {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      licenseUrl: '',
    },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    setLoading(true);
    if (!auth || !firestore) {
        toast({ variant: 'destructive', title: 'Services not available' });
        setLoading(false);
        return;
    }
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // 2. Create public user profile in 'users' collection
      const userProfileRef = doc(firestore, 'users', user.uid);
      await setDoc(userProfileRef, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'provider',
        avatarUrl: `https://picsum.photos/seed/${user.uid}/200/200`
      });

      // 3. Create provider-specific profile in 'providers' collection
      const providerProfileRef = doc(firestore, 'providers', user.uid);
      await setDoc(providerProfileRef, {
        serviceType: data.serviceType,
        licenseUrl: data.licenseUrl,
        isVerified: false, // Admin will verify this later
        availabilityStatus: 'offline',
        rating: 0,
        reviewCount: 0, 
      });

      toast({
        title: 'Registration Successful',
        description: "Your provider account has been created. Please log in.",
      });
      router.push('/login/provider');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4 py-12">
      <Card className="w-full max-w-lg shadow-lg border-0">
        <CardHeader className="text-center space-y-4">
          <Link href="/" className="mx-auto">
            <Logo />
          </Link>
          <CardTitle className="text-2xl font-headline">Join as a Health Provider</CardTitle>
          <CardDescription>
            Create your account to offer your services to the community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. Ali Khan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="03001234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Service Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select your service" />
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
                    name="licenseUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>License URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://your-license.com/proof.pdf" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
              </div>

              <Button type="submit" size="lg" className="w-full font-bold" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Creating Account...' : 'Register Account'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-4">
           <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login/provider" className="font-semibold text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
