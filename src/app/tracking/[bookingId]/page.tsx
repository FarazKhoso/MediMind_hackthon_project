
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useDoc, useMemoFirebase, useUser } from '@/firebase';
import { doc, updateDoc, collection, addDoc, serverTimestamp, query, orderBy, runTransaction, DocumentReference } from 'firebase/firestore';
import { Loader2, MapPin, User, Clock, CheckCircle, ShieldCheck, MessageSquare, SendHorizonal, Star, XCircle, Hourglass, Car, CircleDotDashed } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { getStatusInfo } from '@/lib/booking-status';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const bookingStatuses = ['requested', 'accepted', 'in_progress', 'completed'];

const StatusTimeline = ({ currentStatus }: { currentStatus: string }) => {
    const currentIndex = bookingStatuses.indexOf(currentStatus);

    const getStatusDetails = (status: string) => {
        switch (status) {
            case 'requested':
                return { icon: Hourglass, label: 'Booking Requested' };
            case 'accepted':
                return { icon: ShieldCheck, label: 'Provider Assigned' };
            case 'in_progress':
                return { icon: Car, label: 'Provider En Route' };
            case 'completed':
                return { icon: CheckCircle, label: 'Service Completed' };
            default:
                return { icon: CircleDotDashed, label: 'Unknown' };
        }
    };
    
    return (
        <div className="flex justify-between items-start text-center text-xs sm:text-sm my-4">
            {bookingStatuses.map((status, index) => {
                const isActive = index === currentIndex;
                const isCompleted = index < currentIndex;
                const details = getStatusDetails(status);

                return (
                    <div key={status} className="relative flex-1 flex flex-col items-center">
                        {/* Connecting Line */}
                        {index > 0 && (
                            <div className={cn(
                                "absolute top-[18px] right-1/2 w-full h-0.5",
                                isCompleted || isActive ? 'bg-primary' : 'bg-border'
                            )} />
                        )}

                        <div className={cn(
                            "relative z-10 w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                            isCompleted || isActive ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-border text-muted-foreground'
                        )}>
                            <details.icon className="h-5 w-5" />
                        </div>
                        <p className={cn(
                            "mt-2 font-semibold",
                            isActive ? 'text-primary' : (isCompleted ? 'text-foreground' : 'text-muted-foreground')
                        )}>
                            {details.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};


const ChatBubble = ({ message, role, userRole }: { message: string, role: 'customer' | 'provider' | string, userRole: 'customer' | 'provider' | undefined }) => (
    <div className={`flex ${role === userRole ? 'justify-end' : 'justify-start'}`}>
        <div className={`rounded-lg px-4 py-2 max-w-sm shadow-sm ${role === userRole ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            {message}
        </div>
    </div>
);

export default function TrackingPage() {
    const { bookingId } = useParams();
    const firestore = useFirestore();
    const { user, userProfile } = useUser();
    const router = useRouter();
    const { toast } = useToast();
    const [newMessage, setNewMessage] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [ratingLoading, setRatingLoading] = useState(false);

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
        if (!newMessage.trim() || !chatCollectionRef || !userProfile?.role) return;

        const messageData = {
            text: newMessage,
            sender: userProfile.role,
            createdAt: new Date(),
        };
        setNewMessage('');
        try {
            await addDoc(chatCollectionRef, messageData);
        } catch(error: any) {
            console.warn(`Firestore permission error on creating message. Silently failing. Details:`, error.message);
            toast({
                variant: 'destructive',
                title: 'Message failed',
                description: 'Could not send message due to a permission error.'
            });
        }
    };

    const handleCompleteBooking = async () => {
        if (!bookingRef) return;
        try {
            await updateDoc(bookingRef, { status: 'completed', completedAt: new Date() });
             toast({ title: "Booking Completed!", description: "The booking has been marked as complete." });
        } catch (error: any) {
            console.warn(`Firestore permission error on completing booking. Silently failing. Details:`, error.message);
            toast({ variant: 'destructive', title: 'Update failed', description: 'Could not complete the booking.' });
        }
    };
    
    const handleCancelBooking = async () => {
        if (!bookingRef) return;
        try {
            await updateDoc(bookingRef, { status: 'cancelled' });
            toast({ title: "Booking Cancelled", description: "Your booking has been cancelled.", variant: 'destructive' });
            router.push('/my-bookings');
        } catch (error: any) {
            console.warn(`Firestore permission error on cancelling booking. Silently failing. Details:`, error.message);
            toast({ variant: 'destructive', title: 'Cancellation failed', description: 'Could not cancel the booking.' });
        }
    };

    const handleRatingSubmit = async () => {
        if (rating === 0 || !firestore || !booking || !bookingRef || !booking.providerId) {
            toast({ variant: 'destructive', title: 'Invalid Rating', description: 'Please select a rating before submitting.' });
            return;
        }
        setRatingLoading(true);
        const providerRef = doc(firestore, 'providers', booking.providerId);
        
        try {
            await runTransaction(firestore, async (transaction) => {
                const providerDoc = await transaction.get(providerRef);
                if (!providerDoc.exists()) {
                    throw "Provider profile not found!";
                }

                const providerData = providerDoc.data();
                const currentRating = providerData.rating || 0;
                const reviewCount = providerData.reviewCount || 0;

                const newReviewCount = reviewCount + 1;
                const newRating = ((currentRating * reviewCount) + rating) / newReviewCount;
                
                transaction.update(providerRef, { 
                    rating: newRating,
                    reviewCount: newReviewCount 
                });
                
                transaction.update(bookingRef, { rating: rating });
            });
            
            toast({ title: 'Rating Submitted!', description: 'Thank you for your feedback.' });
        } catch (error) {
            console.error("Failed to submit rating:", error);
            toast({ variant: 'destructive', title: 'Rating Failed', description: 'Could not submit your rating. Please try again.' });
        } finally {
            setRatingLoading(false);
        }
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
    const isProvider = userProfile?.role === 'provider';
    const isCustomer = userProfile?.role === 'customer';

    const renderActionButtons = () => {
        if (booking.status === 'completed' || booking.status === 'cancelled') return null;

        if (isProvider && (booking.status === 'accepted' || booking.status === 'in_progress')) {
             return (
                <Button onClick={handleCompleteBooking} className="w-full bg-green-500 hover:bg-green-600" size="lg">
                    <CheckCircle className="mr-2"/> Mark as Completed
                </Button>
            );
        }
        
        if(isCustomer && (booking.status === 'requested' || booking.status === 'accepted' || booking.status === 'in_progress')) {
            return (
                <Button onClick={handleCancelBooking} variant="destructive" className="w-full" size="lg">
                    <XCircle className="mr-2"/> Cancel Booking
                </Button>
            )
        }
        
        return null;
    }
    
    const renderStatusAlert = () => {
        if (booking.status === 'completed') {
             return (
                <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                    <ShieldCheck className="h-4 w-4 !text-green-600"/>
                    <AlertTitle>Booking Completed!</AlertTitle>
                    <AlertDescription>
                        {isCustomer ? 'Thank you for using MediMind AI. Please rate your provider.' : 'This job has been successfully completed.'}
                    </AlertDescription>
                </Alert>
            );
        }
        
        if (booking.status === 'cancelled') {
             return (
                <Alert variant="destructive">
                    <XCircle className="h-4 w-4"/>
                    <AlertTitle>Booking Cancelled</AlertTitle>
                    <AlertDescription>
                        This booking has been cancelled.
                    </AlertDescription>
                </Alert>
            );
        }
        return null;
    }
    
    const renderRating = () => {
        if (isCustomer && booking.status === 'completed' && !booking.rating) {
            return (
                <Card>
                    <CardHeader>
                        <CardTitle>Rate your Provider</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center gap-4">
                        <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <button 
                                    key={star} 
                                    className="group" 
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                >
                                    <Star className={cn("h-8 w-8 text-gray-300 transition-colors", 
                                        (hoverRating >= star || rating >= star) ? "text-yellow-400 fill-yellow-400" : ""
                                    )} />
                                </button>
                            ))}
                        </div>
                        <Button onClick={handleRatingSubmit} disabled={ratingLoading} className="w-full">
                            {ratingLoading ? <Loader2 className="animate-spin" /> : "Submit Rating"}
                        </Button>
                    </CardContent>
                </Card>
            );
        }
        if(isCustomer && booking.status === 'completed' && booking.rating) {
             return (
                <Card>
                     <CardHeader>
                        <CardTitle>Your Rating</CardTitle>
                    </CardHeader>
                     <CardContent className="flex items-center justify-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className={cn("h-8 w-8 text-yellow-400", booking.rating >= star ? "fill-yellow-400" : "fill-transparent" )} />
                        ))}
                    </CardContent>
                </Card>
             )
        }

        return null;
    }

    const otherParty = isProvider 
        ? { name: booking.customerName, avatarUrl: booking.customerAvatarUrl, role: 'Customer' }
        : { name: booking.providerName, avatarUrl: booking.providerAvatarUrl, role: 'Provider' };


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
                                <StatusTimeline currentStatus={booking.status} />
                             </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Booking Details</CardTitle>
                            </CardHeader>
                             <CardContent className="space-y-4 text-sm">
                                <p><strong>Service:</strong> <span className="capitalize">{booking.serviceType}</span></p>
                                <p><strong>Final Price:</strong> PKR {booking.finalPrice || booking.bidPrice}</p>
                                {otherParty.name && (
                                <div className="flex items-center gap-3 pt-2">
                                    <Avatar>
                                        <AvatarImage src={otherParty.avatarUrl} alt={otherParty.name} />
                                        <AvatarFallback>{otherParty.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{otherParty.role}</p>
                                        <p className="text-muted-foreground text-xs">{otherParty.name}</p>
                                    </div>
                                </div>
                                )}
                             </CardContent>
                        </Card>
                        {renderActionButtons()}
                        {renderStatusAlert()}
                        {renderRating()}
                    </div>

                    {/* Right Column - Negotiation Chat */}
                    <div className="space-y-6">
                        <Card className="flex flex-col h-full max-h-[70vh]">
                            <CardHeader>
                                <CardTitle>Negotiation Chat</CardTitle>
                                <CardDescription>Communicate with your {isProvider ? 'customer' : 'provider'}.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
                                {messagesLoading && <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>}
                                {messages?.map(msg => (
                                    <ChatBubble key={msg.id} message={msg.text} role={msg.sender} userRole={userProfile?.role} />
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
                                        disabled={messagesLoading || booking.status === 'completed' || booking.status === 'cancelled'}
                                    />
                                    <Button type="submit" size="icon" disabled={!newMessage.trim() || booking.status === 'completed' || booking.status === 'cancelled'}>
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
