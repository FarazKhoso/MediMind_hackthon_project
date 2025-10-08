
'use client';

import {
  collection,
  addDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';

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
    timestamp: new Date(), // Using client-side timestamp to avoid potential server-side issues.
  };

  const collectionRef = collection(db, 'users', log.userId, 'consultationLogs');
  
  addDoc(collectionRef, logWithTimestamp)
    .catch(error => {
      // With open rules, this should not be a permission error.
      // Log any other error to the console for debugging.
      console.error("Failed to log consultation:", error);
    });
}
