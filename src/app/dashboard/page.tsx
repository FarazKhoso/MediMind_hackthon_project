
'use client';

import { useState } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, ShieldAlert, Star, MapPin } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppMode } from '@/hooks/use-app-mode';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import { AppHeader } from '@/components/header';


export default function ProviderDashboard() {
  const { user, isUserLoading, userProfile } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { mode } = useAppMode();
  const { toast } = useToast();

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'bookings'), where('status', '==', 'requested'));
  }, [firestore]);
    
  const { data: bookingRequests, isLoading: bookingsLoading, error } = useCollection(bookingsQuery);
  
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleAccept = async (bookingId: string) => {
    if (!user || !firestore) return;
    setUpdatingId(bookingId);
    
    const bookingRef = doc(firestore, 'bookings', bookingId);
    const updateData = {
      status: 'accepted',
      providerId: user.uid,
    };

    updateDoc(bookingRef, updateData)
      .then(() => {
        toast({
          title: 'Request Accepted!',
          description: 'The booking has been moved to your "My Bookings" section.',
        });
        router.push(`/tracking/${bookingId}`);
      })
      .catch((e: any) => {
        console.error("Error accepting booking:", e);
        toast({
            variant: "destructive",
            title: "Accept Failed",
            description: "Could not accept the booking. Please try again."
        });
      })
      .finally(() => {
        setUpdatingId(null);
      });
  };

  const handleDecline = async (bookingId: string) => {
    if (!firestore) return;
    setUpdatingId(bookingId);
    const bookingRef = doc(firestore, 'bookings', bookingId);
    
    deleteDoc(bookingRef)
        .then(() => {
            toast({
                title: 'Request Declined',
                description: 'The booking request has been removed.',
            });
        })
        .catch((e: any) => {
            console.error("Error declining booking:", e);
            toast({
                variant: "destructive",
                title: "Decline Failed",
                description: "Could not decline the booking. Please try again."
            });
        })
        .finally(() => {
            setUpdatingId(null);
        });
  }
  
  const handleNavigateToChat = (bookingId: string) => {
    router.push(`/tracking/${bookingId}`);
  }

  if (isUserLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!user || user.isAnonymous || userProfile?.role !== 'provider' || mode !== 'provider') {
    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10 md:hidden">
                <h1 className="text-xl font-headline font-bold">Provider Dashboard</h1>
                <AppHeader />
            </header>
            <main className="flex-1 flex items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>
                        This dashboard is for registered health providers only. Please <a href="/login" className="font-bold underline">log in</a> as a provider.
                    </AlertDescription>
                </Alert>
            </main>
        </div>
    );
  }

  const showPermissionError = error && !bookingsLoading && (!bookingRequests || bookingRequests.length === 0);

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10 md:hidden">
        <h1 className="text-xl font-headline font-bold">New Booking Requests</h1>
        <AppHeader />
      </header>
      <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {bookingsLoading && <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin h-6 w-6 text-primary" /></div>}
          
          {showPermissionError && (
             <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Permission Error</AlertTitle>
                <AlertDescription>
                    Could not load booking requests. Please ensure you have the correct permissions.
                </AlertDescription>
            </Alert>
          )}

          {!bookingsLoading && bookingRequests && bookingRequests.length === 0 && !error && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No new booking requests at the moment.</p>
              <p className="text-sm text-muted-foreground/80">We'll notify you when one comes in.</p>
            </div>
          )}

          {bookingRequests?.map((booking) => (
            <Card key={booking.id} className="shadow-md animate-in fade-in rounded-xl overflow-hidden">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border">
                            <AvatarFallback><User size={28}/></AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                             <div className="flex justify-between items-center">
                                <h3 className="font-headline font-semibold">{booking.serviceType.charAt(0).toUpperCase() + booking.serviceType.slice(1)} Request</h3>
                                <p className="text-xl font-bold text-primary">PKR {booking.bidPrice}</p>
                             </div>
                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400"/> 4.9
                                </div>
                                <span>&middot;</span>
                                <p>5 mins away</p>
                             </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="border-t pt-4">
                        <div className="flex items-center text-sm gap-2 text-muted-foreground mb-4">
                            <MapPin className="w-4 h-4" />
                            <span>{booking.location}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <Button 
                                onClick={() => handleAccept(booking.id)}
                                disabled={updatingId === booking.id}
                                className="bg-green-500 hover:bg-green-600"
                            >
                                {updatingId === booking.id && updatingId === booking.id ? <Loader2 className="animate-spin"/> : "Accept"}
                            </Button>
                            <Button variant="outline" onClick={() => handleNavigateToChat(booking.id)}>Negotiate</Button>
                            <Button 
                              variant="ghost" 
                              className="text-red-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() => handleDecline(booking.id)}
                              disabled={updatingId === booking.id}
                            >
                                {updatingId === booking.id && updatingId === booking.id ? <Loader2 className="animate-spin"/> : "Decline"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
