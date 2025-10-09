
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

    // Don't show nav/footer on login/register pages
    const immersivePages = ['/login', '/register', '/register/patient'];
    const isImmersive = immersivePages.some(p => pathname.startsWith(p));
    
    if (isImmersive) {
        return <main className="flex-1">{children}</main>;
    }

    return (
        <div className="relative flex min-h-screen flex-col">
            <AppHeader />
            <main className="flex-1">
                {children}
            </main>
            <div className="pb-16 md:pb-0">
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
        </div>
    )
}
