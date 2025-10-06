
'use client';

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarFooter } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Bot, HeartPulse, LogIn, MessageSquareHeart, Stethoscope, Syringe, UserPlus, HandPlatter, LayoutDashboard, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useAppMode } from '@/hooks/use-app-mode';
import { ModeSwitcher } from './mode-switcher';


const PatientMenu = () => (
    <>
        <SidebarMenuItem>
            <Link href="/symptom-checker">
                <SidebarMenuButton tooltip="Symptom Checker">
                    <Bot />
                    <span>Symptom Checker</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <Link href="/book-service">
                <SidebarMenuButton tooltip="Book a Service">
                    <HandPlatter />
                    <span>Book a Service</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <Link href="/health-analysis">
                <SidebarMenuButton tooltip="Health Analysis">
                    <Stethoscope />
                    <span>Health Analysis</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <Link href="/medicine-reminder">
                <SidebarMenuButton tooltip="Reminders">
                    <Syringe />
                    <span>Reminders</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <Link href="/mental-health">
                <SidebarMenuButton tooltip="Mental Health">
                    <MessageSquareHeart />
                    <span>Mental Health</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
    </>
);

const ProviderMenu = () => (
    <>
        <SidebarMenuItem>
            <Link href="/">
                <SidebarMenuButton tooltip="Provider Dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <Link href="/disease-tracking">
                <SidebarMenuButton tooltip="Disease Tracking">
                    <HeartPulse />
                    <span>Disease Tracking</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
         <SidebarMenuItem>
            <Link href="/provider-profile">
                <SidebarMenuButton tooltip="My Profile">
                    <User />
                    <span>My Profile</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
    </>
);

export function MainLayout({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const auth = useAuth();
    const { mode } = useAppMode();

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent className="p-4">
                    <SidebarHeader>
                        <Logo />
                    </SidebarHeader>

                    <ModeSwitcher />
                    
                    <SidebarMenu>
                        {mode === 'patient' ? <PatientMenu /> : <ProviderMenu />}
                    </SidebarMenu>

                    <SidebarFooter className="mt-auto">
                        <SidebarMenu>
                            {!user || user.isAnonymous ? (
                                <>
                                    <SidebarMenuItem>
                                        <Link href="/login">
                                            <SidebarMenuButton tooltip="Login">
                                                <LogIn />
                                                <span>Login</span>
                                            </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <Link href="/register">
                                            <SidebarMenuButton tooltip="Register as Provider">
                                                <UserPlus />
                                                <span>Register as Provider</span>
                                            </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>
                                </>
                            ) : (
                                <SidebarMenuItem>
                                    <SidebarMenuButton tooltip="Logout" onClick={() => signOut(auth)}>
                                        <LogOut />
                                        <span>Logout</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarFooter>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}
