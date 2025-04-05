import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  increment,
  onSnapshot
} from 'firebase/firestore';

export function useRelationships(userId?: string) {
  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !auth.currentUser) return;

    const userRef = doc(db, 'users', userId);
    const currentUserRef = doc(db, 'users', auth.currentUser.uid);

    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setFollowersCount(data.followers || 0);
        setFollowingCount(data.following || 0);
        setFollowing(data.followedBy?.includes(auth.currentUser?.uid));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const followUser = async (targetUserId: string) => {
    if (!auth.currentUser) return;

    const currentUserRef = doc(db, 'users', auth.currentUser.uid);
    const targetUserRef = doc(db, 'users', targetUserId);

    try {
      // Add to current user's following list
      await updateDoc(currentUserRef, {
        following: increment(1),
        followingList: arrayUnion(targetUserId)
      });

      // Add to target user's followers list
      await updateDoc(targetUserRef, {
        followers: increment(1),
        followedBy: arrayUnion(auth.currentUser.uid)
      });

      setFollowing(true);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const unfollowUser = async (targetUserId: string) => {
    if (!auth.currentUser) return;

    const currentUserRef = doc(db, 'users', auth.currentUser.uid);
    const targetUserRef = doc(db, 'users', targetUserId);

    try {
      // Remove from current user's following list
      await updateDoc(currentUserRef, {
        following: increment(-1),
        followingList: arrayRemove(targetUserId)
      });

      // Remove from target user's followers list
      await updateDoc(targetUserRef, {
        followers: increment(-1),
        followedBy: arrayRemove(auth.currentUser.uid)
      });

      setFollowing(false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  return { following, followersCount, followingCount, loading, followUser, unfollowUser };
}