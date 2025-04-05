import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, UserPlus, MessageSquare, Check } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { useRelationships } from '../hooks/useRelationships';

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat?: (userId: string) => void;
}

export function UserSearchModal({ isOpen, onClose, onStartChat }: UserSearchModalProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { results, loading, error, hasMore, searchUsers } = useSearch();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { following, followUser, unfollowUser } = useRelationships(selectedUserId || undefined);

  useEffect(() => {
    if (searchTerm) {
      const delayDebounceFn = setTimeout(() => {
        searchUsers(searchTerm);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm]);

  if (!isOpen) return null;

  const handleStartChat = (userId: string) => {
    if (onStartChat) {
      onStartChat(userId);
    }
    onClose();
  };

  const handleFollowToggle = async (userId: string) => {
    if (following) {
      await unfollowUser(userId);
    } else {
      await followUser(userId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-xl w-full max-w-lg mx-4">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold">Find Users</h2>
          <button onClick={onClose} className="p-2 hover:bg-accent rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by username..."
              className="w-full px-4 py-2 pl-10 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Search className="absolute left-3 top-2.5 text-muted-foreground" size={20} />
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {results.map((user) => (
              <div key={user.uid} className="flex items-center justify-between p-3 hover:bg-accent rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <img
                    src={user.photoURL || 'https://via.placeholder.com/40'}
                    alt={user.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-medium">{user.displayName}</h3>
                      {user.isVerified && (
                        <span className="text-primary">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleFollowToggle(user.uid)}
                    className={`p-2 rounded-full ${
                      following
                        ? 'bg-primary/10 text-primary'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {following ? <Check size={20} /> : <UserPlus size={20} />}
                  </button>
                  <button
                    onClick={() => handleStartChat(user.uid)}
                    className="p-2 bg-primary text-primary-foreground rounded-full"
                  >
                    <MessageSquare size={20} />
                  </button>
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            )}

            {error && (
              <div className="text-destructive text-center py-4">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}