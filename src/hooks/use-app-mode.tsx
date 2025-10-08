
'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { useUser } from '@/firebase';

export type AppMode = 'patient' | 'provider';

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isProviderRole: boolean; // Renamed for clarity
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

export const AppModeProvider = ({ children }: { children: ReactNode }) => {
  const { userProfile, isUserLoading, user } = useUser();
  const [mode, setMode] = useState<AppMode>('patient'); // Default to patient mode

  const isProviderRole = userProfile?.role === 'provider';

  useEffect(() => {
    // If user is logged in, their role dictates the mode.
    if (user && !isUserLoading && userProfile) {
      const userMode = isProviderRole ? 'provider' : 'patient';
      if (mode !== userMode) {
        setMode(userMode);
      }
    }
  }, [user, isUserLoading, userProfile, isProviderRole, mode]);

  const setModeHandler = (newMode: AppMode) => {
    // A logged-in user cannot switch modes. Their role defines their mode.
    if (user && !user.isAnonymous) {
      console.warn("Cannot switch modes while logged in. Mode is determined by user role.");
      return;
    }
    setMode(newMode);
  };
  
  const contextValue = useMemo(() => ({
    mode,
    setMode: setModeHandler,
    isProviderRole: isProviderRole,
  }), [mode, isProviderRole]);

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
