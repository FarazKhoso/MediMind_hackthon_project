
'use client';

import { usePathname } from 'next/navigation';

export function MainApp({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const immersivePages = ['/login', '/register', '/register/patient'];
    const isImmersive = immersivePages.some(p => pathname.startsWith(p));

    if (isImmersive) {
        return <div className="h-full">{children}</div>;
    }

    return <>{children}</>;
}
