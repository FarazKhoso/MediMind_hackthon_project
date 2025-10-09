
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, HandPlatter, BookMarked, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { useState } from 'react';
import { ProfileSidebar } from './profile-sidebar';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/book-service', label: 'Book', icon: HandPlatter },
  { href: '/my-bookings', label: 'Bookings', icon: BookMarked },
];

export function BottomNav() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!user || user.isAnonymous) {
      // If user is not logged in, proceed with default navigation to login
      return;
    }
    // If user is logged in, prevent navigation and open sidebar
    e.preventDefault();
    setProfileSidebarOpen(true);
  };
  
  const profileHref = !isUserLoading && (!user || user.isAnonymous) ? '/login' : '#';

  return (
    <>
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
           <Link
              href={profileHref}
              onClick={handleProfileClick}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs transition-colors',
                pathname === '/profile'
                  ? 'text-primary font-bold'
                  : 'text-muted-foreground hover:text-primary'
              )}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
        </nav>
      </div>
      {user && !user.isAnonymous && <ProfileSidebar open={profileSidebarOpen} onOpenChange={setProfileSidebarOpen} />}
    </>
  );
}
