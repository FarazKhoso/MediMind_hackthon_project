
'use client';

import { Stethoscope, User, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';

export default function AuthHubPage() {
    const router = useRouter();

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center opacity-10 dark:opacity-20"
                style={{ backgroundImage: 'url(https://picsum.photos/seed/auth-bg/1920/1080)' }}
                data-ai-hint="abstract medical background"
            ></div>
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/50 via-background to-background"></div>
            
            <div className="relative z-20 flex flex-col items-center text-center">
                <Logo />
                <h1 className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl font-headline">
                    Welcome to MediMind AI
                </h1>
                <p className="mt-4 max-w-xl text-lg text-muted-foreground">
                    Aapki sehat, hamari fikar. Choose your role to get started.
                </p>

                <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Patient Card */}
                    <Card className="transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/50">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary">
                                    <User className="h-8 w-8" />
                                </div>
                            </div>
                            <CardTitle className="text-center text-2xl font-headline">For Patients</CardTitle>
                            <CardDescription className="text-center">
                                Access AI health advice, book services, and manage your health.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <Button size="lg" className="w-full font-bold" onClick={() => router.push('/login/patient')}>
                                Patient Login <ArrowRight className="ml-2" />
                            </Button>
                            <Button size="lg" variant="outline" className="w-full" onClick={() => router.push('/register/patient')}>
                                Register as a Patient
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Provider Card */}
                    <Card className="transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/50">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-primary">
                                    <Stethoscope className="h-8 w-8" />
                                </div>
                            </div>
                            <CardTitle className="text-center text-2xl font-headline">For Health Providers</CardTitle>
                            <CardDescription className="text-center">
                                Join our network, manage bookings, and connect with patients.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <Button size="lg" className="w-full font-bold" onClick={() => router.push('/login/provider')}>
                                Provider Login <ArrowRight className="ml-2" />
                            </Button>
                             <Button size="lg" variant="outline" className="w-full" onClick={() => router.push('/register/provider')}>
                                Register as a Provider
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
