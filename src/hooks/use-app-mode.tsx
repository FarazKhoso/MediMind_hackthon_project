'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export type AppMode = 'patient' | 'provider';

interface AppModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  isProviderRole: boolean;
}

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

export const AppModeProvider = ({ children }: { children: ReactNode }) => {
  const { userProfile, isUserLoading, user } = useUser();
  const [mode, setModeState] = useState<AppMode>('patient');
  const router = useRouter();

  // ✅ Load mode from localStorage (only runs on client)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedMode = localStorage.getItem('appMode') as AppMode | null;
      if (storedMode && storedMode !== mode) {
        setModeState(storedMode);
      }
    }
  }, []);

  // ✅ Automatically determine mode if user logged in
  const isProviderRole = userProfile?.role === 'provider';
  useEffect(() => {
    if (user && !user.isAnonymous && !isUserLoading && userProfile) {
      const userMode: AppMode = isProviderRole ? 'provider' : 'patient';
      if (mode !== userMode) {
        setModeState(userMode);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('appMode'); // clean old value
        }
      }
    }
  }, [user, isUserLoading, userProfile, isProviderRole, mode]);

  // ✅ For logged-out users, allow switching manually
  const setMode = (newMode: AppMode) => {
    if (user && !user.isAnonymous) {
      console.warn('Cannot switch modes while logged in. Mode is determined by user role.');
      return;
    }

    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('appMode', newMode);
    }

    // Refresh to apply changes globally
    router.refresh();
  };

  const contextValue = useMemo(
    () => ({
      mode,
      setMode,
      isProviderRole,
    }),
    [mode, isProviderRole]
  );

  return (
    <AppModeContext.Provider value={contextValue}>
      {children}
    </AppModeContext.Provider>
  );
};

// ✅ Hook to use mode anywhere
export const useAppMode = () => {
  const context = useContext(AppModeContext);
  if (!context) {
    throw new Error('useAppMode must be used within an AppModeProvider');
  }
  return context;
};
