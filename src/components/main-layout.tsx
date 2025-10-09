
'use client';

import { useUser } from '@/firebase';
import { useAppMode } from '@/hooks/use-app-mode';
import { BottomNav } from './bottom-nav';
import { AppHeader } from './header';
import { AppFooter } from './footer';
import { usePathname } from 'next/navigation';

export function MainLayout({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const { isProviderRole, mode } = useAppMode();
    const pathname = usePathname();

    const showProviderMenu = user ? isProviderRole : mode === 'provider';

    // Don't show nav/footer on these pages for an immersive experience
    const immersivePages = ['/login', '/register', '/register/patient', '/book-service', '/tracking', '/profile/edit'];
    const isImmersive = immersivePages.some(p => pathname.startsWith(p));
    
    // Symptom checker is full-screen, but needs its own header.
    if (pathname.startsWith('/symptom-checker')) {
         return <main className="h-screen">{children}</main>;
    }
    
    if (isImmersive) {
        return <main className="h-screen">{children}</main>;
    }

    return (
        <div className="relative flex min-h-screen flex-col">
            <AppHeader />
            <main className="flex-1">
                {children}
            </main>
            {/* The pb-16 is padding for the bottom nav on mobile */}
            <div className="pb-16 md:pb-0">
                 {/* Only show the footer on the homepage */}
                {pathname === '/' && <AppFooter />}
                
                {/* Only show bottom nav for patient mode on non-immersive pages */}
                {!showProviderMenu && <BottomNav />}
            </div>
        </div>
    )
}
