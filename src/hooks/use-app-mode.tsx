
'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';

export type AppMode = 'patient' | 'provider';

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isProviderRole: boolean;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

export const AppModeProvider = ({ children }: { children: ReactNode }) => {
  const { userProfile, isUserLoading, user } = useUser();
  const [mode, setMode] = useState<AppMode>('patient');
  const router = useRouter();
  const pathname = usePathname();

  const isProviderRole = userProfile?.role === 'provider';

  useEffect(() => {
    if (user && !user.isAnonymous && !isUserLoading && userProfile) {
      const userMode = isProviderRole ? 'provider' : 'patient';
      if (mode !== userMode) {
        setMode(userMode);
      }
    }
  }, [user, isUserLoading, userProfile, isProviderRole, mode]);

  const setModeHandler = (newMode: AppMode) => {
    if (user && !user.isAnonymous) {
      console.warn("Cannot switch modes while logged in. Mode is determined by user role.");
      return;
    }
    setMode(newMode);
    // Force a reload to ensure the entire UI context switches correctly
    router.push(pathname);
    router.refresh();
  };
  
  const contextValue = useMemo(() => ({
    mode,
    setMode: setModeHandler,
    isProviderRole: isProviderRole,
  }), [mode, user, isProviderRole]);

  return (
    <AppModeContext.Provider value={contextValue}>
      {children}
    </AppModeContext.Provider>
  );
};

export const useAppMode = () => {
  const context = useContext(AppModeContext);
  if (context === undefined) {
    throw new Error('useAppMode must be used within an AppModeProvider');
  }
  return context;
};
