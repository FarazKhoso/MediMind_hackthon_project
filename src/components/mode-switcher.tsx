
'use client';

import { useAppMode } from '@/hooks/use-app-mode';
import { Button } from '@/components/ui/button';
import { Repeat } from 'lucide-react';
import { useUser } from '@/firebase';

export function ModeSwitcher() {
  const { mode, setMode, isProvider } = useAppMode();
  const { user, isUserLoading } = useUser();

  // Don't show switcher for providers, as they are locked into provider mode.
  // Also hide while loading or if logged out.
  if (isUserLoading || !user || user.isAnonymous || isProvider) {
    return null;
  }

  const handleSwitchMode = () => {
    const newMode = mode === 'patient' ? 'provider' : 'patient';
    setMode(newMode);
  };

  // This component will now effectively only be shown to non-provider users (e.g. admins in future)
  // who might have dual roles. For now, it will be mostly hidden for all roles.
  return (
    <div className="p-2 border-t">
      <Button variant="outline" className="w-full justify-start" onClick={handleSwitchMode}>
        <Repeat className="mr-2 h-4 w-4" />
        <span>Switch to {mode === 'patient' ? 'Provider' : 'Patient'}</span>
      </Button>
    </div>
  );
}
