
'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export type AppMode = 'patient' | 'provider';

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isProviderRole: boolean;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

export const AppModeProvider = ({ children }: { children: ReactNode }) => {
  const { userProfile, isUserLoading, user } = useUser();
  // Start with a default mode, and update from localStorage on the client.
  const [mode, setModeState] = useState<AppMode>('patient');
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // This effect runs only on the client, after hydration.
  useEffect(() => {
    const storedMode = localStorage.getItem('appMode') as AppMode;
    if (storedMode && storedMode !== mode) {
      setModeState(storedMode);
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

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
    
    // Use router to refresh the page to reflect mode changes consistently
    router.refresh();
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
};

export const useAppMode = () => {
  const context = useContext(AppModeContext);
  if (context === undefined) {
    throw new Error('useAppMode must be used within an AppModeProvider');
  }
  return context;
};
