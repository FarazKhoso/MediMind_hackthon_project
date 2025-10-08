
'use client';

import { useAppMode } from '@/hooks/use-app-mode';
import SymptomCheckerPage from './symptom-checker/page';
import ProviderDashboard from './dashboard/page';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { mode } = useAppMode();
  const { user, isUserLoading, userProfile } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If a user is logged in, their role dictates the view.
  if (user && userProfile) {
    if (userProfile.role === 'provider') {
        return <ProviderDashboard />;
    }
    return <SymptomCheckerPage />;
  }

  // If not logged in, the view is based on the selected mode.
  if (mode === 'provider') {
    return <ProviderDashboard />;
  }

  return <SymptomCheckerPage />;
}
