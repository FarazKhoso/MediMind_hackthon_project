'use client';

import { useAppMode } from '@/hooks/use-app-mode';
import SymptomCheckerPage from './symptom-checker/page';
import ProviderDashboard from './dashboard/page';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { mode } = useAppMode();
  const { isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (mode === 'provider') {
    return <ProviderDashboard />;
  }

  return <SymptomCheckerPage />;
}
