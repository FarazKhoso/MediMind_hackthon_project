
'use client';

import { useState } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, UserCheck, Clock, DollarSign, ShieldAlert } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { useCollection } from '@/firebase/firestore/use-collection';

export default function ProviderDashboard() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  // Query for booking requests, memoized for performance.
  const bookingsQuery = useMemoFirebase(() => {
    // Only fetch bookings if the user is a logged-in (not anonymous) provider
    if (!firestore || !user || user.isAnonymous) return null;
    
    // In a real app, you'd also query based on provider's service type and location
    return query(
        collection(firestore, 'bookings'),
        where('status', '==', 'requested')
    );
  }, [firestore, user]);
    
  const { data: bookingRequests, isLoading: bookingsLoading, error: bookingsError } = useCollection(bookingsQuery);
  
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleAccept = async (bookingId: string) => {
    if (!user || !firestore) return;
    setUpdatingId(bookingId);
    try {
      const bookingRef = doc(firestore, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: 'accepted',
        providerId: user.uid,
      });
      router.push(`/tracking/${bookingId}`);
    } catch (e) {
      console.error("Failed to accept booking:", e);
    }
    setUpdatingId(null);
  };

  if (isUserLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  // If user is not logged in OR is an anonymous user, show access denied message.
  if (!user || user.isAnonymous) {
    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10">
                <h1 className="text-xl font-headline font-bold">Provider Dashboard</h1>
                <SidebarTrigger />
            </header>
            <main className="flex-1 flex items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>
                        This dashboard is for registered health providers only. Please <a href="/login" className="font-bold underline">log in</a> or <a href="/register" className="font-bold underline">register</a> to continue.
                    </AlertDescription>
                </Alert>
            </main>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10">
        <h1 className="text-xl font-headline font-bold">Provider Dashboard</h1>
        <SidebarTrigger />
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-2xl font-headline font-semibold">New Booking Requests</h2>
          {bookingsLoading && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin h-4 w-4" /><span>Loading requests...</span></div>}

          {bookingRequests && bookingRequests.length === 0 && !bookingsLoading && (
            <p className="text-muted-foreground">No new booking requests at the moment. We'll notify you when one comes in.</p>
          )}

          <div className="grid gap-6">
            {bookingRequests?.map((booking) => (
              <Card key={booking.id} className="shadow-md animate-in fade-in">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{booking.serviceType.charAt(0).toUpperCase() + booking.serviceType.slice(1)} Request</span>
                    <Badge variant="secondary">{booking.status}</Badge>
                  </CardTitle>
                  <CardDescription>
                    A new request is available near you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground"/>
                        <span>Requested: {booking.timing}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground"/>
                        <span>Bid: PKR {booking.bidPrice}</span>
                    </div>
                  </div>
                   <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-muted-foreground"/>
                        <span>Customer ID: {booking.customerId.substring(0,8)}...</span>
                    </div>
                  <div className="flex gap-4 pt-4">
                    <Button 
                      onClick={() => handleAccept(booking.id)}
                      disabled={updatingId === booking.id}
                      className="w-full"
                    >
                      {updatingId === booking.id && <Loader2 className="mr-2 animate-spin"/>}
                      Accept
                    </Button>
                    <Button variant="outline" className="w-full">Negotiate</Button>
                    <Button variant="destructive" className="w-full">Reject</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
