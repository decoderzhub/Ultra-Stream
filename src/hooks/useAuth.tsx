import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
<<<<<<< HEAD
import { auth } from '../firebase';
=======
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  updatedAt: Date;
  bio: string;
  followers: number;
  following: number;
  totalViews: number;
  totalLikes: number;
  isVerified: boolean;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    privateAccount: boolean;
  };
}
>>>>>>> 36fab14 (updates)

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
    const unsubscribe = auth.onAuthStateChanged((user) => {
=======
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Check if user profile exists
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          // Create new user profile
          const userProfile: Partial<UserProfile> = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: new Date(),
            updatedAt: new Date(),
            bio: '',
            followers: 0,
            following: 0,
            totalViews: 0,
            totalLikes: 0,
            isVerified: false,
            socialLinks: {},
            preferences: {
              notifications: true,
              emailUpdates: true,
              privateAccount: false
            }
          };

          await setDoc(userRef, {
            ...userProfile,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        } else {
          // Update last login
          await setDoc(userRef, {
            lastLogin: serverTimestamp()
          }, { merge: true });
        }
      }
      
>>>>>>> 36fab14 (updates)
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}