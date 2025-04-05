import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore first
const db = getFirestore(app);

// Enable offline persistence for Firestore before any other operations
try {
  // Enable single-tab persistence first
  await enableIndexedDbPersistence(db);
  
  // Then enable multi-tab persistence
  await enableMultiTabIndexedDbPersistence(db);
} catch (err) {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled in one tab at a time
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    // The current browser doesn't support persistence
    console.warn('The current browser doesn\'t support persistence.');
  }
}

// Initialize auth after Firestore persistence is set up
const auth = getAuth(app);

// Set auth persistence to LOCAL (survives browser restart)
setPersistence(auth, browserLocalPersistence);

export { auth, db };