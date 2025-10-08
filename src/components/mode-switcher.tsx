
'use client';

import { useAppMode } from '@/hooks/use-app-mode';
import { Button } from '@/components/ui/button';
import { Repeat } from 'lucide-react';
import { useUser } from '@/firebase';

export function ModeSwitcher() {
  const { mode, setMode } = useAppMode();
  const { user, isUserLoading } = useUser();

  // Hide the switcher if the user is loading or already logged in.
  // A logged-in user's mode is fixed by their role.
  if (isUserLoading || (user && !user.isAnonymous)) {
    return null;
  }

  const handleSwitchMode = () => {
    const newMode = mode === 'patient' ? 'provider' : 'patient';
    setMode(newMode);
  };

  return (
    <div className="p-2 border-t">
      <Button variant="outline" className="w-full justify-start" onClick={handleSwitchMode}>
        <Repeat className="mr-2 h-4 w-4" />
        <span>Switch to {mode === 'patient' ? 'Provider' : 'Patient'} View</span>
      </Button>
    </div>
  );
}
