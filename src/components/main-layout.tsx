
'use client';

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Bot, HeartPulse, HandPlatter, LayoutDashboard, BookMarked, Home } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { useAppMode } from '@/hooks/use-app-mode';
import { BottomNav } from './bottom-nav';
import { MainApp } from './main-app';
import { AppHeader } from './header';
import { AppFooter } from './footer';
import { useSidebar } from '@/components/ui/sidebar';
import { ModeSwitcher } from './mode-switcher';

const PatientMenu = () => {
    const { setOpenMobile } = useSidebar();
    return (
    <>
        <SidebarMenuItem>
            <Link href="/" onClick={() => setOpenMobile(false)}>
                <SidebarMenuButton tooltip="Home">
                    <Home />
                    <span>Home</span>
                </SidebarMenuButton>
            </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
            <Link href="/symptom-checker" onClick={() => setOpenMobile(false)}>
                <SidebarMenuButton tooltip="Symptom Checker">
                    <Bot />
                    <span>AI Symptom Checker</span>
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
    </>
)};

const ProviderMenu = () => {
    const { setOpenMobile } = useSidebar();
    return (
    <>
        <SidebarMenuItem>
            <Link href="/dashboard" onClick={() => setOpenMobile(false)}>
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

export function MainLayout({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const { isProviderRole, mode } = useAppMode();

    const showProviderMenu = user ? isProviderRole : mode === 'provider';

    return (
        <>
            <Sidebar>
                <SidebarContent className="flex flex-col p-2">
                    <SidebarHeader className="p-2">
                        <Logo />
                    </SidebarHeader>
                    
                    <SidebarMenu className="flex-1 mt-4">
                        {showProviderMenu ? <ProviderMenu /> : <PatientMenu />}
                    </SidebarMenu>
                    <ModeSwitcher />
                </SidebarContent>
            </Sidebar>
            <MainApp>
                <div className="relative flex min-h-screen flex-col">
                    <AppHeader />
                    <main className="flex-1 pb-16 md:pb-0">
                        {children}
                    </main>
                    {!showProviderMenu && (
                      <>
                        <div className="hidden md:block">
                          <AppFooter />
                        </div>
                        <BottomNav />
                      </>
                    )}
                     {showProviderMenu && <AppFooter />}
                </div>
            </MainApp>
        </>
    )
}
