
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
  // Default to 'patient' but allow override from localStorage for logged-out users
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

  // Effect to sync mode with user role once logged in
  useEffect(() => {
    if (user && !user.isAnonymous && !isUserLoading && userProfile) {
      const userMode = isProviderRole ? 'provider' : 'patient';
      if (mode !== userMode) {
        setModeState(userMode);
        // No need to store in localStorage for logged-in users as role is the source of truth
         if (typeof window !== 'undefined') {
            localStorage.removeItem('appMode');
         }
      }
    }
  }, [user, isUserLoading, userProfile, isProviderRole, mode]);

  const setMode = (newMode: AppMode) => {
    // Logged-in users cannot switch mode; it's determined by their role.
    if (user && !user.isAnonymous) {
      console.warn("Cannot switch modes while logged in. Mode is determined by user role.");
      return;
    }
    
    // For logged-out users, allow switching and persist choice.
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('appMode', newMode);
    }
    
    // Refresh the page to ensure all components re-evaluate the mode
    // Using a full reload is more robust than router.refresh() for context changes
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    const value = current.toString();
    const query = value ? `?${value}` : "";
    
    // We use window.location.href to force a full page reload, which is more reliable
    // for deep context changes than Next.js's soft navigation.
    window.location.href = pathname + query;
  };
  
  const contextValue = useMemo(() => ({
    mode,
    setMode,
    isProviderRole,
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
