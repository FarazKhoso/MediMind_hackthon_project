
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
  const { userProfile, isUserProfileLoading, user } = useUser();
  const isProvider = userProfile?.role === 'provider';

  // Default to patient, but switch to provider if the user's role is provider.
  const [mode, setModeState] = useState<AppMode>('patient');

  useEffect(() => {
    // When user profile is loaded, set the mode based on the role.
    if (!isUserProfileLoading && user) {
      if (isProvider) {
        setModeState('provider');
      } else {
        setModeState('patient');
      }
    } else if (!user) {
        // If user logs out, default to patient mode
        setModeState('patient');
    }
  }, [isProvider, isUserProfileLoading, user]);
  
  const setMode = (newMode: AppMode) => {
    // Prevent a non-provider from ever switching to provider mode.
    if (newMode === 'provider' && !isProvider) {
      console.warn("Attempted to switch to provider mode without provider role. Denied.");
      return;
    }
     // Prevent a provider from switching to patient mode.
    if (newMode === 'patient' && isProvider) {
      console.warn("A provider cannot switch to patient mode. Denied.");
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
