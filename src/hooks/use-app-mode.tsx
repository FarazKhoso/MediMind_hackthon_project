
'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { useUser } from '@/firebase';

export type AppMode = 'patient' | 'provider';

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isProvider: boolean;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

export const AppModeProvider = ({ children }: { children: ReactNode }) => {
  const { userProfile, isUserProfileLoading } = useUser();
  const isProvider = userProfile?.role === 'provider';

  const [mode, setModeState] = useState<AppMode>('patient');

  useEffect(() => {
    if (!isUserProfileLoading) {
      if (isProvider) {
        setModeState('provider');
      } else {
        setModeState('patient');
      }
    }
  }, [isProvider, isUserProfileLoading]);
  
  const setMode = (newMode: AppMode) => {
    if (newMode === 'provider' && !isProvider) {
      console.warn("Attempted to switch to provider mode without provider role.");
      return;
    }
    setModeState(newMode);
  };

  const contextValue = useMemo(() => ({
    mode,
    setMode,
    isProvider,
  }), [mode, isProvider]);

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
