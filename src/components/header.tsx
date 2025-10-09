
'use client';

import Link from 'next/link';
import { LogOut, User, Menu, Settings, Languages, Check, Moon, Sun } from 'lucide-react';
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
import { SidebarTrigger } from './ui/sidebar';
import { ModeToggle } from './theme-toggle';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';
import { Logo } from './logo';

export function AppHeader() {
  const { user, userProfile } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div className="hidden md:block">
              <Logo />
            </div>
        </div>
        
        <div className="md:hidden">
            <Logo />
        </div>
        
        <div className="flex-1" />

        <div className="flex items-center gap-3">
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
            <div className="hidden items-center gap-2 md:flex">
                <Button variant="ghost" onClick={() => router.push('/login')}>Sign In</Button>
                <Button onClick={() => router.push('/register/patient')}>Sign Up</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
