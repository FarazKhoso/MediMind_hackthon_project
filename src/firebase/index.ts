
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { useUser as useUserHook } from './auth/use-user';


// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  const isInitialized = getApps().length > 0;
  const app = isInitialized ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  // NOTE: This is a workaround for the demo environment to ensure emulators are always used.
  if (typeof window !== 'undefined') {
    // @ts-ignore
    if (!auth.emulatorConfig) {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    }
    // @ts-ignore
    if (!firestore.emulatorConfig) {
      connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    }
  }

  return { firebaseApp: app, auth, firestore };
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';

// This is the hook we want to export and use throughout the app.
export const useUser = useUserHook;
