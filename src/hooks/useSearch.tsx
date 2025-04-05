import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';

interface SearchResult {
  uid: string;
  displayName: string;
  username: string;
  photoURL: string;
  bio: string;
  followers: number;
  isVerified: boolean;
}

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);

  const searchUsers = async (searchTerm: string, clearPrevious = true) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (clearPrevious) {
        setResults([]);
        setLastDoc(null);
      }

      let searchQuery = query(
        collection(db, 'users'),
        where('username', '>=', searchTerm.toLowerCase()),
        where('username', '<=', searchTerm.toLowerCase() + '\uf8ff'),
        orderBy('username'),
        limit(20)
      );

      if (lastDoc && !clearPrevious) {
        searchQuery = query(
          collection(db, 'users'),
          where('username', '>=', searchTerm.toLowerCase()),
          where('username', '<=', searchTerm.toLowerCase() + '\uf8ff'),
          orderBy('username'),
          startAfter(lastDoc),
          limit(20)
        );
      }

      const snapshot = await getDocs(searchQuery);
      const users = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as SearchResult[];

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === 20);

      if (clearPrevious) {
        setResults(users);
      } else {
        setResults(prev => [...prev, ...users]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, hasMore, searchUsers };
}