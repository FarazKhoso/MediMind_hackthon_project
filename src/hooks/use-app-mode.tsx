
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
  const { user, userProfile } = useUser();
  const isProvider = userProfile?.role === 'provider';

  const [mode, setModeState] = useState<AppMode>('patient');

  useEffect(() => {
    // When user logs in, if they are a provider, default to provider mode.
    // Otherwise, default to patient mode.
    if (isProvider) {
      setModeState('provider');
    } else {
      setModeState('patient');
    }
  }, [isProvider, user]);
  
  const setMode = (newMode: AppMode) => {
    // A non-provider cannot switch to provider mode.
    if (newMode === 'provider' && !isProvider) {
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
