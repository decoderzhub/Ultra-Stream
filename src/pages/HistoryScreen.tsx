import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoPlaceholder } from '../components/LogoPlaceholder';
import { User, Clock, Trash2, Filter, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  watchedAt: Date;
  progress: number;
  user: {
    name: string;
    avatar: string;
  };
}

const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Getting Started with Ultra Stream',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop',
    duration: '12:34',
    watchedAt: new Date(),
    progress: 75,
    user: {
      name: 'Ultra Stream',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop'
    }
  },
  {
    id: '2',
    title: 'Advanced Streaming Tips',
    thumbnail: 'https://images.unsplash.com/photo-1618609378039-b572f64c5b42?w=800&auto=format&fit=crop',
    duration: '8:21',
    watchedAt: new Date(Date.now() - 86400000), // Yesterday
    progress: 100,
    user: {
      name: 'Stream Pro',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop'
    }
  }
];

export function HistoryScreen() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const clearHistory = () => {
    // Implement clear history functionality
    console.log('Clearing history...');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/home')}>
            <LogoPlaceholder />
            <h1 className="text-xl font-bold text-primary">Watch History</h1>
          </div>
          
          <button 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          >
            <User size={20} />
          </button>
        </div>
      </header>

      <div className="pt-16 px-4 max-w-7xl mx-auto">
        {/* Controls */}
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-full ${
                selectedFilter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-card-foreground'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter('today')}
              className={`px-4 py-2 rounded-full ${
                selectedFilter === 'today'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-card-foreground'
              }`}
            >
              Today
            </button>
            <button className="p-2 rounded-full bg-card text-card-foreground">
              <Calendar size={20} />
            </button>
            <button className="p-2 rounded-full bg-card text-card-foreground">
              <Filter size={20} />
            </button>
          </div>
          
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-full hover:bg-destructive/20 transition-colors"
          >
            <Trash2 size={18} />
            <span>Clear History</span>
          </button>
        </div>

        {/* History List */}
        <div className="space-y-4 py-6">
          {MOCK_VIDEOS.map((video) => (
            <div
              key={video.id}
              onClick={() => navigate(`/video/${video.id}`)}
              className="bg-card text-card-foreground rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex">
                <div className="relative w-64">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-sm">
                    {video.duration}
                  </span>
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                    <div 
                      className="h-full bg-primary"
                      style={{ width: `${video.progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="p-4 flex-1">
                  <div className="flex gap-3">
                    <img
                      src={video.user.avatar}
                      alt={video.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {video.user.name}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Clock size={14} />
                        <span>Watched {format(video.watchedAt, 'PPp')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}