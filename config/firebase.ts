import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// Export the auth and firestore instances
export const getAuth = () => auth();
export const getFirestore = () => firestore();

// Type exports for convenience
export type Auth = FirebaseAuthTypes.Module;
export type Firestore = FirebaseFirestoreTypes.Module;
export type User = FirebaseAuthTypes.User;
export type Timestamp = FirebaseFirestoreTypes.Timestamp;

// Helper functions
export const createTimestamp = () => firestore.Timestamp.now();
export const timestampToDate = (timestamp: FirebaseFirestoreTypes.Timestamp) => timestamp.toDate();
export const dateToTimestamp = (date: Date) => firestore.Timestamp.fromDate(date);