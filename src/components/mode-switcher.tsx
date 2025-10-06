
'use client';

import { useAppMode } from '@/hooks/use-app-mode';
import { Button } from '@/components/ui/button';
import { User, Briefcase, Repeat } from 'lucide-react';
import { useUser } from '@/firebase';

export function ModeSwitcher() {
  const { mode, setMode, isProvider } = useAppMode();
  const { user } = useUser();

  // Don't show switcher if not logged in or if user is not a provider.
  if (!user || user.isAnonymous || !isProvider) {
    return null;
  }

  const handleSwitchMode = () => {
    const newMode = mode === 'patient' ? 'provider' : 'patient';
    setMode(newMode);
  };

  return (
    <div className="p-2 border-t">
      <Button variant="outline" className="w-full" onClick={handleSwitchMode}>
        <Repeat className="mr-2 h-4 w-4" />
        Switch to {mode === 'patient' ? 'Provider' : 'Patient'} Mode
      </Button>
    </div>
  );
}
