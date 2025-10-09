
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bot, HandPlatter, BookMarked } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/symptom-checker', label: 'AI Chat', icon: Bot },
  { href: '/book-service', label: 'Book', icon: HandPlatter },
  { href: '/my-bookings', label: 'Bookings', icon: BookMarked },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)] md:hidden">
      <nav className="grid h-full grid-cols-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs transition-colors',
                isActive
                  ? 'text-primary font-bold'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
