
'use client';

import Link from 'next/link';
import { LogOut, User, Menu, Settings, Languages, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback } from './ui/avatar';
import { ModeToggle } from './theme-toggle';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';
import { Logo } from './logo';
import { useAppMode } from '@/hooks/use-app-mode';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const PatientNavLinks = ({ isMobile = false, onLinkClick }: { isMobile?: boolean, onLinkClick?: () => void }) => (
    <>
        <Link href="/symptom-checker" className={cn(!isMobile && "text-sm font-medium text-muted-foreground transition-colors hover:text-primary", isMobile && "block p-4 border-b")} onClick={onLinkClick}>AI Symptom Checker</Link>
        <Link href="/book-service" className={cn(!isMobile && "text-sm font-medium text-muted-foreground transition-colors hover:text-primary", isMobile && "block p-4 border-b")} onClick={onLinkClick}>Book a Service</Link>
        <Link href="/my-bookings" className={cn(!isMobile && "text-sm font-medium text-muted-foreground transition-colors hover:text-primary", isMobile && "block p-4 border-b")} onClick={onLinkClick}>My Bookings</Link>
    </>
);

const ProviderNavLinks = ({ isMobile = false, onLinkClick }: { isMobile?: boolean, onLinkClick?: () => void }) => (
     <>
        <Link href="/dashboard" className={cn(!isMobile && "text-sm font-medium text-muted-foreground transition-colors hover:text-primary", isMobile && "block p-4 border-b")} onClick={onLinkClick}>Dashboard</Link>
        <Link href="/provider-bookings" className={cn(!isMobile && "text-sm font-medium text-muted-foreground transition-colors hover:text-primary", isMobile && "block p-4 border-b")} onClick={onLinkClick}>My Bookings</Link>
        <Link href="/disease-tracking" className={cn(!isMobile && "text-sm font-medium text-muted-foreground transition-colors hover:text-primary", isMobile && "block p-4 border-b")} onClick={onLinkClick}>Disease Tracking</Link>
    </>
);


export function AppHeader() {
  const { user, userProfile } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { isProviderRole, mode } = useAppMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showProviderMenu = user ? isProviderRole : mode === 'provider';

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/');
  };

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="flex items-center">
          {/* Mobile Menu */}
          <div className="md:hidden mr-2">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                          <Menu />
                          <span className="sr-only">Open Menu</span>
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-3/4 p-0">
                      <div className="p-4 border-b">
                          <Logo />
                      </div>
                      <nav className="flex flex-col mt-2">
                          {showProviderMenu ? <ProviderNavLinks isMobile onLinkClick={handleMobileLinkClick} /> : <PatientNavLinks isMobile onLinkClick={handleMobileLinkClick} />}
                      </nav>
                  </SheetContent>
              </Sheet>
          </div>
          <Logo />
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 mx-auto">
              {showProviderMenu ? <ProviderNavLinks /> : <PatientNavLinks />}
        </nav>
        
        <div className="flex flex-1 items-center justify-end gap-3">
          <ModeToggle />

          {user && !user.isAnonymous ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{userProfile?.name?.[0] ?? user.email?.[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userProfile?.name ?? 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                 <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Languages className="mr-2 h-4 w-4" />
                        <span>Language</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => setLanguage('en')}>
                                <Check className={`mr-2 h-4 w-4 ${language === 'en' ? 'opacity-100' : 'opacity-0'}`} />
                                English
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setLanguage('ur-PK')}>
                                 <Check className={`mr-2 h-4 w-4 ${language === 'ur-PK' ? 'opacity-100' : 'opacity-0'}`} />
                                Roman Urdu
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                 </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => router.push('/login')}>Sign In</Button>
                <Button onClick={() => router.push('/register/patient')}>Sign Up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
