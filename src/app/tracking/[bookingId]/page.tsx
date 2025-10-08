
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase, useUser } from '@/firebase';
import { doc, updateDoc, collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Loader2, MapPin, User, Clock, CheckCircle, ShieldCheck, MessageSquare, SendHorizonal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useCollection, errorEmitter, FirestorePermissionError } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getStatusInfo } from '@/lib/booking-status';

// Mock map component for tracking
const TrackingMap = () => (
    <div className="h-80 bg-muted rounded-md flex items-center justify-center my-4">
        <div className="text-center text-muted-foreground">
            <MapPin className="mx-auto h-12 w-12" />
            <p>Live tracking map placeholder</p>
            <p className="text-xs">Provider is 5 minutes away.</p>
        </div>
    </div>
);

const ChatBubble = ({ message, role }: { message: string, role: 'customer' | 'provider' | string }) => (
    <div className={`flex ${role === 'customer' ? 'justify-end' : 'justify-start'}`}>
        <div className={`rounded-lg px-4 py-2 max-w-sm shadow-sm ${role === 'customer' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            {message}
        </div>
    </div>
);

export default function TrackingPage() {
    const { bookingId } = useParams();
    const firestore = useFirestore();
    const { user, userProfile } = useUser();
    const router = useRouter();
    const [newMessage, setNewMessage] = useState('');

    const bookingRef = useMemoFirebase(() => {
        if (!firestore || !bookingId) return null;
        return doc(firestore, 'bookings', bookingId as string);
    }, [firestore, bookingId]);
    const { data: booking, isLoading: bookingLoading } = useDoc(bookingRef);

    const chatCollectionRef = useMemoFirebase(() => {
        if (!firestore || !bookingId) return null;
        return collection(firestore, 'bookings', bookingId as string, 'messages');
    }, [firestore, bookingId]);

    const chatQuery = useMemoFirebase(() => {
        if (!chatCollectionRef) return null;
        return query(chatCollectionRef, orderBy('createdAt', 'asc'));
    }, [chatCollectionRef]);
    
    const { data: messages, isLoading: messagesLoading } = useCollection(chatQuery);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !chatCollectionRef || !userProfile) return;

        const messageData = {
            text: newMessage,
            sender: userProfile.role || 'customer',
            createdAt: serverTimestamp(),
        };

        setNewMessage('');

        addDoc(chatCollectionRef, messageData)
            .catch(error => {
              errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                  path: chatCollectionRef.path,
                  operation: 'create',
                  requestResourceData: messageData,
                })
              )
            });
    };

    const handleCompleteBooking = async () => {
        if (!bookingRef) return;
        updateDoc(bookingRef, { status: 'completed', completedAt: serverTimestamp() })
          .catch(error => {
            errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                  path: bookingRef.path,
                  operation: 'update',
                  requestResourceData: { status: 'completed' },
                })
            )
          });
    };

    if (bookingLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin" /></div>;
    }

    if (!booking) {
        return (
            <div className="flex h-screen items-center justify-center p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Booking Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>The requested booking could not be found.</p>
                        <Button onClick={() => router.push('/')} className="mt-4">Go Home</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const statusInfo = getStatusInfo(booking.status);

    return (
        <div className="flex flex-col h-full bg-background">
            <header className="p-4 border-b bg-card shadow-sm text-center">
                <h1 className="text-xl font-headline font-bold">Booking Status</h1>
                <p className="text-sm text-muted-foreground">ID: {bookingId}</p>
            </header>
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Left Column - Tracking & Details */}
                    <div className="space-y-6">
                        <Card>
                             <CardHeader>
                                <CardTitle>Live Tracking</CardTitle>
                                <Badge variant={statusInfo.variant} className={statusInfo.className}>
                                    <statusInfo.icon className="w-4 h-4 mr-2" />
                                    Status: {statusInfo.label}
                                </Badge>
                             </CardHeader>
                             <CardContent>
                                <TrackingMap />
                             </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Booking Details</CardTitle>
                            </CardHeader>
                             <CardContent className="space-y-4 text-sm">
                                <p><strong>Service:</strong> <span className="capitalize">{booking.serviceType}</span></p>
                                <p><strong>Final Price:</strong> PKR {booking.finalPrice || booking.bidPrice}</p>
                                {booking.providerId && (
                                <div className="flex items-center gap-3 pt-2">
                                    <Avatar>
                                        <AvatarFallback><User /></AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">Provider Assigned</p>
                                        <p className="text-muted-foreground text-xs">{booking.providerId}</p>
                                    </div>
                                </div>
                                )}
                             </CardContent>
                        </Card>
                        {userProfile?.role === 'provider' && booking.status === 'accepted' && (
                            <Button onClick={handleCompleteBooking} className="w-full bg-green-500 hover:bg-green-600" size="lg">
                                <CheckCircle className="mr-2"/> Mark as Completed
                            </Button>
                        )}
                         {booking.status === 'completed' && (
                            <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                                <ShieldCheck className="h-4 w-4 !text-green-600"/>
                                <AlertTitle>Booking Completed!</AlertTitle>
                                <AlertDescription>Thank you for using MediMind AI. Please rate your provider.</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Right Column - Negotiation Chat */}
                    <div className="space-y-6">
                        <Card className="flex flex-col h-full max-h-[70vh]">
                            <CardHeader>
                                <CardTitle>Negotiation Chat</CardTitle>
                                <CardDescription>Communicate with your provider/customer.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
                                {messagesLoading && <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>}
                                {messages?.map(msg => (
                                    <ChatBubble key={msg.id} message={msg.text} role={msg.sender} />
                                ))}
                                {!messagesLoading && messages?.length === 0 && (
                                    <div className="text-center text-muted-foreground p-8">
                                        <MessageSquare className="mx-auto h-8 w-8 mb-2" />
                                        <p>No messages yet.</p>
                                        <p className="text-xs">Start the conversation below.</p>
                                    </div>
                                )}
                            </CardContent>
                            <div className="p-4 border-t bg-background/80 backdrop-blur-sm">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <Textarea
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1"
                                        rows={1}
                                        disabled={messagesLoading}
                                    />
                                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                                        <SendHorizonal />
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
