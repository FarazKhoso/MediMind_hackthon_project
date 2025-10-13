
'use client';

import Link from 'next/link';
import {
  LogOut,
  User,
  Menu,
  Settings,
  Languages,
  Check,
  Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ModeToggle } from './theme-toggle';
import { useRouter, usePathname } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';
import { Logo } from './logo';
import { useAppMode } from '@/hooks/use-app-mode';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ProfileSidebar } from './profile-sidebar';
import { ModeSwitcher } from './mode-switcher';

const PatientNavLinks = ({
  isMobile = false,
  onLinkClick,
}: {
  isMobile?: boolean;
  onLinkClick?: () => void;
}) => (
  <>
    <Link
      href="/symptom-checker"
      className={cn(
        !isMobile &&
          'text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
        isMobile && 'block p-4 border-b'
      )}
      onClick={onLinkClick}
    >
      AI Symptom Checker
    </Link>
    <Link
      href="/book-service"
      className={cn(
        !isMobile &&
          'text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
        isMobile && 'block p-4 border-b'
      )}
      onClick={onLinkClick}
    >
      Book a Service
    </Link>
    <Link
      href="/my-bookings"
      className={cn(
        !isMobile &&
          'text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
        isMobile && 'block p-4 border-b'
      )}
      onClick={onLinkClick}
    >
      My Bookings
    </Link>
  </>
);

const ProviderNavLinks = ({
  isMobile = false,
  onLinkClick,
}: {
  isMobile?: boolean;
  onLinkClick?: () => void;
}) => (
  <>
    <Link
      href="/dashboard"
      className={cn(
        !isMobile &&
          'text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
        isMobile && 'block p-4 border-b'
      )}
      onClick={onLinkClick}
    >
      Dashboard
    </Link>
    <Link
      href="/provider-bookings"
      className={cn(
        !isMobile &&
          'text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
        isMobile && 'block p-4 border-b'
      )}
      onClick={onLinkClick}
    >
      My Bookings
    </Link>
    <Link
      href="/disease-tracking"
      className={cn(
        !isMobile &&
          'text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
        isMobile && 'block p-4 border-b'
      )}
      onClick={onLinkClick}
    >
      Disease Tracking
    </Link>
  </>
);

export function AppHeader() {
  const { user, userProfile } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const { isProviderRole, mode } = useAppMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);

  const showProviderMenu = user ? isProviderRole : mode === 'provider';

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/login');
  };

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };
  
  // Hide header on certain pages for a more immersive experience
  const immersivePages = ['/login', '/register'];
  if (immersivePages.some(p => pathname.startsWith(p))) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        {/* Left Side: Logo & Mobile Menu Trigger */}
        <div className="flex items-center gap-2 md:w-1/4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-3/4 p-0 flex flex-col">
              <div className="p-4 border-b">
                <Logo />
              </div>
              <nav className="flex-1 flex flex-col mt-2">
                {showProviderMenu ? (
                  <ProviderNavLinks isMobile onLinkClick={handleMobileLinkClick} />
                ) : (
                  <PatientNavLinks isMobile onLinkClick={handleMobileLinkClick} />
                )}
              </nav>

              {/* Mobile Actions in Footer of Drawer */}
              <div className="p-4 border-t mt-auto">
                
                {user && !user.isAnonymous ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mt-4">
                        <Avatar className="h-10 w-10">
                        <AvatarImage src={userProfile?.avatarUrl} />
                        <AvatarFallback>
                            {userProfile?.name?.[0] ?? user.email?.[0]}
                        </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium leading-none truncate">
                            {userProfile?.name ?? 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                            {user.email}
                        </p>
                        </div>
                    </div>
                     <Button variant="outline" className="w-full justify-start" onClick={() => {router.push('/profile/edit'); handleMobileLinkClick(); }}>
                        <Edit className="mr-2 h-4 w-4"/>
                        Edit Profile
                      </Button>
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4"/>
                      Logout
                    </Button>
                  </div>
                ) : (
                  <>
                  <ModeSwitcher />
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        router.push('/login');
                        handleMobileLinkClick();
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        router.push('/login');
                        handleMobileLinkClick();
                      }}
                    >
                      Sign Up
                    </Button>
                  </div>
                  </>
                )}
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-muted-foreground">Settings</p>
                  <div className="flex items-center gap-2">
                    <ModeToggle />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Languages />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setLanguage('en')}>
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              language === 'en' ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                          English
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLanguage('ur-PK')}>
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              language === 'ur-PK' ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                          Roman Urdu
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
           <Logo className="hidden md:flex" />
        </div>

        {/* Desktop Nav (Centered) */}
        <nav className="hidden md:flex flex-grow items-center justify-center gap-6">
          {showProviderMenu ? <ProviderNavLinks /> : <PatientNavLinks />}
        </nav>

        {/* Right Side: Desktop Actions */}
        <div className="hidden md:flex items-center justify-end gap-2 md:w-1/4">
            <ModeToggle />
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Languages />
                    </Button>
                </DropdownMenuTrigger>
                 <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setLanguage('en')}>
                        <Check className={`mr-2 h-4 w-4 ${language === 'en' ? 'opacity-100' : 'opacity-0'}`} />
                        English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('ur-PK')}>
                         <Check className={`mr-2 h-4 w-4 ${language === 'ur-PK' ? 'opacity-100' : 'opacity-0'}`} />
                        Roman Urdu
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

             {user && !user.isAnonymous ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={userProfile?.avatarUrl} />
                        <AvatarFallback>
                          {userProfile?.name?.[0] ?? user.email?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {userProfile?.name ?? 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setProfileSidebarOpen(true)}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ProfileSidebar open={profileSidebarOpen} onOpenChange={setProfileSidebarOpen} />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => router.push('/login')}>
                  Sign In
                </Button>
                <Button onClick={() => router.push('/login')}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
           {/* Mobile Logo (centered when menu is open) */}
           <div className="flex-grow flex justify-center md:hidden">
              <Link href="/">
                <Logo />
              </Link>
           </div>
           <div className="w-10 md:hidden"></div>
      </div>
    </header>
  );
}
