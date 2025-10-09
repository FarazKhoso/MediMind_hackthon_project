
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { LogOut, User, Settings, Shield, FileText, LifeBuoy, Bell } from 'lucide-react';
import Link from 'next/link';

interface ProfileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SidebarLink = ({ href, icon: Icon, children, onClick }: { href: string; icon: React.ElementType; children: React.ReactNode; onClick?: () => void; }) => (
    <Link href={href} onClick={onClick} className="flex items-center p-3 -mx-3 rounded-lg hover:bg-muted transition-colors">
        <Icon className="w-5 h-5 mr-3 text-muted-foreground" />
        <span className="font-medium">{children}</span>
    </Link>
)

export function ProfileSidebar({ open, onOpenChange }: ProfileSidebarProps) {
  const { user, userProfile } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    onOpenChange(false);
    router.push('/');
  };

  if (!user || user.isAnonymous) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
           <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
                <AvatarFallback className="text-2xl">
                {userProfile?.name?.[0] ?? user.email?.[0]}
                </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
                <h2 className="text-xl font-bold truncate">{userProfile?.name ?? 'User'}</h2>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
            </div>
           </div>
        </SheetHeader>
        <div className="flex-1 p-6 overflow-y-auto">
            <nav className="flex flex-col gap-2">
                <SidebarLink href="/profile/edit" icon={User} onClick={() => onOpenChange(false)}>Edit Profile</SidebarLink>
                <SidebarLink href="/my-bookings" icon={FileText} onClick={() => onOpenChange(false)}>My Bookings</SidebarLink>
                <SidebarLink href="/notifications" icon={Bell} onClick={() => onOpenChange(false)}>Notifications</SidebarLink>
                <SidebarLink href="/settings" icon={Settings} onClick={() => onOpenChange(false)}>Settings</SidebarLink>
                <SidebarLink href="/help" icon={LifeBuoy} onClick={() => onOpenChange(false)}>Help & Support</SidebarLink>
                <SidebarLink href="/privacy" icon={Shield} onClick={() => onOpenChange(false)}>Privacy Policy</SidebarLink>
            </nav>
        </div>
        <div className="p-6 border-t mt-auto">
            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                <LogOut className="mr-3 w-5 h-5"/>
                Logout
            </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
