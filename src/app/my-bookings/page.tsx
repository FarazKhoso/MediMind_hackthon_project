'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Loader2, HandPlatter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getStatusInfo } from '@/lib/booking-status';

export default function MyBookingsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'bookings'),
      where('customerId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user?.uid]);

  const { data: bookings, isLoading: bookingsLoading, error } = useCollection(bookingsQuery);

  const handleViewDetails = (bookingId: string) => {
    router.push(`/tracking/${bookingId}`);
  };

  if (isUserLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10">
          <h1 className="text-xl font-headline font-bold">My Bookings</h1>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md text-center">
            <CardHeader>
              <CardTitle>Login Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Please login to see your bookings.
              </p>
              <Button onClick={() => router.push('/login')}>Go to Login</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm z-10">
        <h1 className="text-xl font-headline font-bold">My Booking History</h1>
      </header>
      <main className="flex-1 overflow-y-auto bg-muted/50 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* 🌀 Loading State */}
          {bookingsLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="animate-spin h-6 w-6 text-primary" />
            </div>
          )}

          {/* ✅ Empty bookings message */}
          {!bookingsLoading && bookings && bookings.length === 0 && !error && (
            <div className="text-center py-16">
              <HandPlatter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-headline text-lg font-semibold mb-2">No Bookings Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven’t made any bookings yet. Book your first service now!
              </p>
              <Button
                onClick={() => router.push('/book-service')}
                className="mx-auto"
              >
                Book Your First Service
              </Button>
            </div>
          )}

          {/* ✅ Bookings List */}
          {!bookingsLoading &&
            bookings &&
            bookings.length > 0 &&
            bookings.map((booking) => {
              const statusInfo = getStatusInfo(booking.status);
              return (
                <Card
                  key={booking.id}
                  className="shadow-md animate-in fade-in rounded-xl overflow-hidden"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="font-headline capitalize">
                          {booking.serviceType} Request
                        </CardTitle>
                        <CardDescription>
                          Status:{' '}
                          <span
                            className="font-semibold"
                            style={{ color: statusInfo.color }}
                          >
                            {statusInfo.label}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge
                        variant={statusInfo.variant}
                        className={cn('capitalize', statusInfo.className)}
                      >
                        <statusInfo.icon className="h-3.5 w-3.5 mr-1.5" />
                        {booking.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center text-sm p-3 bg-muted/50 rounded-md">
                      <p className="text-muted-foreground">Your Bid</p>
                      <p className="font-bold text-lg text-primary">
                        PKR {booking.bidPrice}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleViewDetails(booking.id)}
                      className="w-full"
                    >
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
