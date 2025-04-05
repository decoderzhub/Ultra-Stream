import { initializeApp } from 'firebase/app';
<<<<<<< HEAD
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
=======
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import {
  getFirestore,
  enableIndexedDbPersistence,
  enableMultiTabIndexedDbPersistence,
} from 'firebase/firestore';
>>>>>>> 36fab14 (updates)

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
<<<<<<< HEAD
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
=======
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
>>>>>>> 36fab14 (updates)
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore first
const db = getFirestore(app);
<<<<<<< HEAD

// Initialize auth
const auth = getAuth(app);

// Set auth persistence to LOCAL (survives browser restart)
setPersistence(auth, browserLocalPersistence);

// Enable offline persistence for Firestore in an async function instead of using top-level await
const setupFirestorePersistence = async () => {
  try {
    // Enable single-tab persistence first
    await enableIndexedDbPersistence(db);
    
=======
const auth = getAuth(app);

// Enable offline persistence for Firestore before any other operations
const initializeFirestore = async () => {
  try {
    // Enable single-tab persistence first
    await enableIndexedDbPersistence(db);
>>>>>>> 36fab14 (updates)
    // Then enable multi-tab persistence
    await enableMultiTabIndexedDbPersistence(db);
  } catch (err) {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
<<<<<<< HEAD
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support persistence
      console.warn('The current browser doesn\'t support persistence.');
=======
      console.warn(
        'Multiple tabs open, persistence can only be enabled in one tab at a time.'
      );
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence
      console.warn(
        'The current browser does not support all of the features required to enable persistence.'
      );
>>>>>>> 36fab14 (updates)
    }
  }
};

// Call the async function immediately
<<<<<<< HEAD
setupFirestorePersistence();

export { auth, db };
=======
initializeFirestore();

// Set persistence for authentication
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Error setting auth persistence:', error);
});

export { auth, db };
>>>>>>> 36fab14 (updates)
