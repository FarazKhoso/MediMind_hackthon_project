
'use client';

import {
  collection,
  addDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface ConsultationLog {
  userId: string;
  userQuery: string;
  aiResponse: string;
  confidenceScore: number;
  handoffStatus: 'pending' | 'completed' | 'not_required';
  timestamp?: any;
}

/**
 * Logs a consultation to the database.
 * This is a non-blocking operation.
 * @param db The Firestore instance.
 * @param log The consultation log to save.
 */
export function logConsultation(db: Firestore, log: ConsultationLog) {
  if (!log.userId) {
    console.warn("Cannot log consultation without a user ID.");
    return;
  }
  
  const logWithTimestamp = {
    ...log,
    timestamp: serverTimestamp(),
  };

  const collectionRef = collection(db, 'users', log.userId, 'consultationLogs');
  
  addDoc(collectionRef, logWithTimestamp)
    .catch(error => {
      // With open rules, this should not trigger for permission errors,
      // but we log any other potential errors to the console.
      console.error("Error logging consultation:", error);
    });
}
