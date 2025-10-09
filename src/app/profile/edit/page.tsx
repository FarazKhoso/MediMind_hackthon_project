
'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Input } from '@/components/ui/input';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Camera, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().optional(),
  avatar: z.string().optional(), // For base64 preview
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const [loading, setLoading] = useState(false);
  const { user, userProfile, isUserLoading, isUserProfileLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
      avatar: '',
    },
  });

  // Effect to set the initial avatar preview from userProfile
  useEffect(() => {
    if (userProfile?.avatarUrl) {
      setAvatarPreview(userProfile.avatarUrl);
    }
  }, [userProfile?.avatarUrl]);

  // Effect to reset form text values when userProfile loads, but NOT the avatar.
  useEffect(() => {
    if (userProfile) {
      // Use reset to update form values without touching the avatar preview state
      form.reset({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        // The 'avatar' field in the form is NOT reset, preserving the preview
      });
    }
  }, [userProfile, form.reset]);


  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        form.setValue('avatar', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    if (!user || !firestore) return;

    setLoading(true);
    try {
      // NOTE: In a real app, you would upload the 'data.avatar' (if it's a new base64 string)
      // to a service like Firebase Storage, get the URL, and then save that URL.
      // The direct save of the avatar base64 string is removed to prevent crashes from exceeding Firestore's 1MB limit.
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        name: data.name,
        phone: data.phone,
      });

      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
      router.back();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not save your changes. Please try again.',
      });
    }
    setLoading(false);
  };

  const isLoading = isUserLoading || isUserProfileLoading;

  return (
    <div className="flex flex-col h-screen bg-muted/30">
      <header className="flex items-center p-4 border-b bg-card shadow-sm sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mr-2"
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-headline font-bold">Edit Profile</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <Card>
              <CardHeader className="items-center">
                 <Skeleton className="h-24 w-24 rounded-full" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <Skeleton className="h-11 w-32" />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                     <AvatarImage src={avatarPreview} />
                    <AvatarFallback className="text-3xl">
                      {userProfile?.name?.[0] ?? <UserIcon size={40} />}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="icon" variant="outline" className="absolute -bottom-1 -right-1 rounded-full border-2 border-background h-8 w-8 cursor-pointer" onClick={handleAvatarClick}>
                    <Camera className="h-4 w-4"/>
                    <span className="sr-only">Change Photo</span>
                  </Button>
                   <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/jpg"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
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
                            <Input placeholder="e.g., 03001234567" {...field} />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                         <Input value={user?.email || ''} disabled />
                         <p className="text-xs text-muted-foreground pt-1">Email address cannot be changed.</p>
                    </FormItem>

                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
