
'use client';

import { usePathname } from 'next/navigation';
import { useSidebar } from './ui/sidebar';
import { cn } from '@/lib/utils';

export function MainApp({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { open, isMobile } = useSidebar();

    const immersivePages = ['/login', '/register', '/register/patient'];
    const isImmersive = immersivePages.some(p => pathname.startsWith(p));

    if (isImmersive) {
        return <div className="h-full">{children}</div>;
    }

    return (
        <div className={cn(
            "transition-[margin-left] duration-300 ease-in-out",
            !isMobile && open ? "md:ml-64" : "md:ml-0"
        )}>
            {children}
        </div>
    );
}
