import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoPlaceholder } from '../components/LogoPlaceholder';
import { User, Clock, Heart, Download, Bookmark, PlayCircle } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  createdAt: string;
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
    views: 1234,
    likes: 50000,
    createdAt: '2024-03-15',
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
    views: 892,
    likes: 35000,
    createdAt: '2024-03-14',
    user: {
      name: 'Stream Pro',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop'
    }
  }
];

export function LibraryScreen() {
  const navigate = useNavigate();
  const categories = [
    { name: 'History', icon: Clock },
    { name: 'Liked', icon: Heart },
    { name: 'Downloads', icon: Download },
    { name: 'Watch Later', icon: Bookmark },
    { name: 'Playlists', icon: PlayCircle }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/home')}>
            <LogoPlaceholder />
            <h1 className="text-xl font-bold text-primary">Library</h1>
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
        {/* Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 py-6">
          {categories.map((category) => (
            <button
              key={category.name}
              className="flex flex-col items-center gap-2 p-4 bg-card text-card-foreground rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <category.icon size={24} className="text-primary" />
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Recent Videos */}
        <div className="py-6">
          <h2 className="text-xl font-semibold mb-4">Recent Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_VIDEOS.map((video) => (
              <div
                key={video.id}
                onClick={() => navigate(`/video/${video.id}`)}
                className="bg-card text-card-foreground rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-sm">
                    {video.duration}
                  </span>
                </div>
                
                <div className="p-4">
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
                      <p className="text-sm text-muted-foreground">
                        {video.views.toLocaleString()} views • {video.createdAt}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}