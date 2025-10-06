'use server';

import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export async function getPatientData(patientId: string) {
  try {
    const userDoc = await db.collection('users').doc(patientId).get();
    if (!userDoc.exists) {
      return { error: 'Patient not found' };
    }
    return userDoc.data();
  } catch (error) {
    console.error('Error fetching patient data:', error);
    return { error: 'Failed to fetch patient data' };
  }
}
