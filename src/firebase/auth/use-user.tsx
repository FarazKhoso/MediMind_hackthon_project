
'use client';

import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase/provider';
import { doc, onSnapshot } from 'firebase/firestore';

interface UserProfile {
  role?: 'customer' | 'provider';
  [key: string]: any;
}

interface UseUserResult {
  user: User | null;
  userProfile: UserProfile | null;
  isUserLoading: boolean;
  isUserProfileLoading: boolean;
}

export function useUser(): UseUserResult {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isUserProfileLoading, setIsUserProfileLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(firebaseUser => {
      setUser(firebaseUser);
      setIsUserLoading(false);

      if (!firebaseUser) {
        setUserProfile(null);
        setIsUserProfileLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [auth]);

  useEffect(() => {
    if (user && firestore) {
      setIsUserProfileLoading(true);
      const userProfileRef = doc(firestore, 'users', user.uid);
      const unsubscribeProfile = onSnapshot(userProfileRef, (doc) => {
        if (doc.exists()) {
          setUserProfile(doc.data() as UserProfile);
        } else {
          // If the user document doesn't exist, they are a customer by default
          setUserProfile({ role: 'customer' });
        }
        setIsUserProfileLoading(false);
      }, (error) => {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
          setIsUserProfileLoading(false);
      });

      return () => unsubscribeProfile();
    }
  }, [user, firestore]);

  return { user, userProfile, isUserLoading, isUserProfileLoading: isUserLoading || isUserProfileLoading };
}
