'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, Suspense } from 'react';
import { useUser } from '@/firebase';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export type AppMode = 'patient' | 'provider';

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isProviderRole: boolean;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

function AppModeInnerProvider({ children }: { children: ReactNode }) {
  const { userProfile, isUserLoading, user } = useUser();
  const [mode, setModeState] = useState<AppMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('appMode') as AppMode) || 'patient';
    }
    return 'patient';
  });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isProviderRole = userProfile?.role === 'provider';

  useEffect(() => {
    if (user && !user.isAnonymous && !isUserLoading && userProfile) {
      const userMode = isProviderRole ? 'provider' : 'patient';
      if (mode !== userMode) {
        setModeState(userMode);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('appMode');
        }
      }
    }
  }, [user, isUserLoading, userProfile, isProviderRole, mode]);

  const setMode = (newMode: AppMode) => {
    if (user && !user.isAnonymous) {
      console.warn('Cannot switch modes while logged in. Mode is determined by user role.');
      return;
    }

    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('appMode', newMode);
    }

    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const value = current.toString();
    const query = value ? `?${value}` : '';
    window.location.href = pathname + query;
  };

  const contextValue = useMemo(
    () => ({
      mode,
      setMode,
      isProviderRole,
    }),
    [mode, user, isProviderRole]
  );

  return <AppModeContext.Provider value={contextValue}>{children}</AppModeContext.Provider>;
}

// ✅ FIX: Wrap the provider in Suspense to handle searchParams safely
export const AppModeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={null}>
      <AppModeInnerProvider>{children}</AppModeInnerProvider>
    </Suspense>
  );
};

export const useAppMode = () => {
  const context = useContext(AppModeContext);
  if (context === undefined) {
    throw new Error('useAppMode must be used within an AppModeProvider');
  }
  return context;
};
