import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// Replace these values with your Firebase project configuration
// You can find these values in your Firebase Console -> Project Settings
const firebaseConfig = {
  // Android: google-services.json
  // iOS: GoogleService-Info.plist
  
  // Web configuration (optional, if you're also building for web)
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

/*
Setup Instructions:

1. Create a new Firebase project at https://console.firebase.google.com/
2. Enable Authentication with Email/Password provider
3. Enable Cloud Firestore
4. Download the configuration files:
   - For Android: google-services.json -> place in android/app/
   - For iOS: GoogleService-Info.plist -> place in ios/[YourAppName]/
5. Copy this file to 'firebase.ts' and update the configuration values

Note: For React Native, you don't need to manually initialize Firebase.
The @react-native-firebase packages handle initialization using the native configuration files.
*/

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