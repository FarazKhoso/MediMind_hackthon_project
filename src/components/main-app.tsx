
'use client';

import { usePathname } from 'next/navigation';

export function MainApp({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Pages that should have a completely clean layout (e.g., auth pages, tracking)
    const immersivePages = ['/login', '/register', '/register/patient', '/tracking'];
    const isImmersive = immersivePages.some(p => pathname.startsWith(p));

    if (isImmersive) {
        return <div className="h-full">{children}</div>;
    }

    return <>{children}</>;
}
