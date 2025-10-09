
'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Loader2, HandPlatter, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/header';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getStatusInfo } from '@/lib/booking-status';

export default function ProviderBookingsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'bookings'),
      where('providerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user?.uid]);

  const { data: bookings, isLoading: bookingsLoading, error } = useCollection(bookingsQuery);

  const handleViewDetails = (bookingId: string) => {
    router.push(`/tracking/${bookingId}`);
  };

  if (isUserLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!user || user.isAnonymous) {
     return (
        <div className="flex flex-col h-full">
             <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10 md:hidden">
                <h1 className="text-xl font-headline font-bold">My Assigned Bookings</h1>
                <AppHeader />
            </header>
            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="max-w-md text-center">
                    <CardHeader>
                        <CardTitle>Login Required</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">Please login to see your assigned bookings.</p>
                        <Button onClick={() => router.push('/login')}>Go to Login</Button>
                    </CardContent>
                </Card>
            </main>
        </div>
     )
  }

  const showNoBookingsMessage = !bookingsLoading && bookings && bookings.length === 0;
  const showError = error && !bookingsLoading && (!bookings || bookings.length === 0);

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10 md:hidden">
        <h1 className="text-xl font-headline font-bold">My Assigned Bookings</h1>
        <AppHeader />
      </header>
      <main className="flex-1 overflow-y-auto bg-muted/50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {bookingsLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="animate-spin h-6 w-6 text-primary" />
            </div>
          )}

          {showNoBookingsMessage && (
            <div className="text-center py-16">
                <HandPlatter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-headline text-lg">No Assigned Bookings Yet</h3>
              <p className="text-muted-foreground">You haven't accepted any bookings.</p>
              <Button variant="link" onClick={() => router.push('/dashboard')}>
                View New Requests
              </Button>
            </div>
          )}
          
          {showError && (
             <Card className="text-center">
                <CardHeader>
                    <CardTitle className="text-destructive">Error Loading Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Could not load your assigned bookings. Please try again later.</p>
                </CardContent>
            </Card>
          )}

          {!bookingsLoading && bookings && bookings.length > 0 && bookings.map((booking) => {
            const statusInfo = getStatusInfo(booking.status);
            return (
              <Card key={booking.id} className="shadow-md animate-in fade-in rounded-xl overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="font-headline capitalize">{booking.serviceType} Request</CardTitle>
                      <CardDescription>
                        Status: <span className="font-semibold" style={{color: statusInfo.color}}>{statusInfo.label}</span>
                      </CardDescription>
                    </div>
                     <Badge variant={statusInfo.variant} className={cn("capitalize", statusInfo.className)}>
                        <statusInfo.icon className="h-3.5 w-3.5 mr-1.5" />
                        {booking.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-sm p-3 bg-muted/50 rounded-md">
                     <p className="text-muted-foreground">Final Price</p>
                     <p className="font-bold text-lg text-primary">PKR {booking.finalPrice || booking.bidPrice}</p>
                  </div>
                  <Button onClick={() => handleViewDetails(booking.id)} className="w-full">
                    View Details & Chat
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
