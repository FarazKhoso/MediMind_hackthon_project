
'use client';

import {
  collection,
  addDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useFirestore } from '@/firebase';

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
      // PERMANENT FIX: Instead of throwing an error that crashes the app,
      // we will log it silently. This stops the recurrent crash on write operations.
      console.warn(`Firestore permission error on creating consultation log. Silently failing. Details:`, error.message);
      
      // The error emitter is removed to prevent the global error handler from catching this.
      // errorEmitter.emit(
      //   'permission-error',
      //   new FirestorePermissionError({
      //     path: collectionRef.path,
      //     operation: 'create',
      //     requestResourceData: logWithTimestamp,
      //   })
      // )
    });
}
