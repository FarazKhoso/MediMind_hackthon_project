
'use client';

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarFooter, useSidebar } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Bot, HeartPulse, LogIn, MessageSquareHeart, Stethoscope, Syringe, UserPlus, HandPlatter, LayoutDashboard, User, LogOut, BookMarked } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useAppMode } from '@/hooks/use-app-mode';
import { ModeSwitcher } from './mode-switcher';

const PatientMenu = () => {
    const { setOpenMobile } = useSidebar();
    return (
    <>
        <SidebarMenuItem>
            <Link href="/symptom-checker" onClick={() => setOpenMobile(false)}>
                <SidebarMenuButton tooltip="Symptom Checker">
                    <Bot />
                    <span>Symptom Checker</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <Link href="/book-service" onClick={() => setOpenMobile(false)}>
                <SidebarMenuButton tooltip="Book a Service">
                    <HandPlatter />
                    <span>Book a Service</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <Link href="/my-bookings" onClick={() => setOpenMobile(false)}>
                <SidebarMenuButton tooltip="My Bookings">
                    <BookMarked />
                    <span>My Bookings</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <Link href="/health-analysis" onClick={() => setOpenMobile(false)}>
                <SidebarMenuButton tooltip="Health Analysis">
                    <Stethoscope />
                    <span>Health Analysis</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <Link href="/medicine-reminder" onClick={() => setOpenMobile(false)}>
                <SidebarMenuButton tooltip="Reminders">
                    <Syringe />
                    <span>Reminders</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <Link href="/mental-health" onClick={() => setOpenMobile(false)}>
                <SidebarMenuButton tooltip="Mental Health">
                    <MessageSquareHeart />
                    <span>Mental Health</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
    </>
)};

const ProviderMenu = () => {
    const { setOpenMobile } = useSidebar();
    return (
    <>
        <SidebarMenuItem>
            <Link href="/" onClick={() => setOpenMobile(false)}>
                <SidebarMenuButton tooltip="Provider Dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
         <SidebarMenuItem>
            <Link href="/provider-bookings" onClick={() => setOpenMobile(false)}>
                <SidebarMenuButton tooltip="My Bookings">
                    <BookMarked />
                    <span>My Bookings</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <Link href="/disease-tracking" onClick={() => setOpenMobile(false)}>
                <SidebarMenuButton tooltip="Disease Tracking">
                    <HeartPulse />
                    <span>Disease Tracking</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
    </>
)};


const AuthMenu = ({ mode }: { mode: 'patient' | 'provider' }) => {
    const { setOpenMobile } = useSidebar();
    return (
        <SidebarMenuItem>
            <Link href="/login" onClick={() => setOpenMobile(false)}>
                <SidebarMenuButton tooltip="Login">
                    <LogIn />
                    <span>Login</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
    );
};


export function MainLayout({ children }: { children: React.ReactNode }) {
    const { user, userProfile } = useUser();
    const auth = useAuth();
    const { mode, isProviderRole } = useAppMode();
    
    // Determine which menu to show based on login status and role
    const showProviderMenu = user ? isProviderRole : mode === 'provider';

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent className="flex flex-col p-4">
                    <SidebarHeader>
                        <Logo />
                    </SidebarHeader>
                    
                    <SidebarMenu className="flex-1">
                        {showProviderMenu ? <ProviderMenu /> : <PatientMenu />}
                    </SidebarMenu>

                    <SidebarFooter>
                        <SidebarMenu>
                            {!user || user.isAnonymous ? (
                                <AuthMenu mode={mode} />
                            ) : (
                                <SidebarMenuItem>
                                    <SidebarMenuButton tooltip="Logout" onClick={() => signOut(auth)}>
                                        <LogOut />
                                        <span>Logout ({userProfile?.role})</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                        <ModeSwitcher />
                    </SidebarFooter>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}
