
'use client';

import { useParams } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Loader2, MapPin, User, Clock, CheckCircle, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useCollection, errorEmitter, FirestorePermissionError } from '@/firebase';

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

const ChatBubble = ({ message, role }: { message: string, role: 'customer' | 'provider' }) => (
    <div className={`flex ${role === 'customer' ? 'justify-end' : 'justify-start'}`}>
        <div className={`rounded-lg px-4 py-2 max-w-sm ${role === 'customer' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            {message}
        </div>
    </div>
);

export default function TrackingPage() {
    const { bookingId } = useParams();
    const firestore = useFirestore();
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
        if (!newMessage.trim() || !chatCollectionRef) return;

        const messageData = {
            text: newMessage,
            sender: 'customer', // In a real app, you'd check user role
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
        await updateDoc(bookingRef, { status: 'completed' });
    };

    if (bookingLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-10 w-10 animate-spin" /></div>;
    }

    if (!booking) {
        return <div className="flex h-screen items-center justify-center"><p>Booking not found.</p></div>;
    }

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
                                <Badge className="w-fit" variant={booking.status === 'completed' ? 'default' : 'secondary'}>
                                    Status: {booking.status}
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
                                <p><strong>Service:</strong> {booking.serviceType}</p>
                                <p><strong>Final Price:</strong> PKR {booking.finalPrice || booking.bidPrice}</p>
                                {booking.providerId && (
                                <div className="flex items-center gap-3 pt-2">
                                    <Avatar>
                                        <AvatarFallback><User /></AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">Provider Assigned</p>
                                        <p className="text-muted-foreground">{booking.providerId.substring(0,12)}...</p>
                                    </div>
                                </div>
                                )}
                             </CardContent>
                        </Card>
                        {booking.status === 'accepted' && (
                            <Button onClick={handleCompleteBooking} className="w-full" size="lg">
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
                                <CardDescription>Communicate with your provider.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto space-y-4">
                                {messagesLoading && <Loader2 className="animate-spin" />}
                                {messages?.map(msg => (
                                    <ChatBubble key={msg.id} message={msg.text} role={msg.sender} />
                                ))}
                                {messages?.length === 0 && !messagesLoading && <p className="text-muted-foreground text-center">No messages yet.</p>}
                            </CardContent>
                            <div className="p-4 border-t">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <Textarea
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1"
                                        rows={1}
                                    />
                                    <Button type="submit">Send</Button>
                                </form>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
