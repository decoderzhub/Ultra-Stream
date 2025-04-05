import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoPlaceholder } from '../components/LogoPlaceholder';
import { User, TrendingUp, Flame, Award, Star, BarChart2 } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  trending: number;
  createdAt: string;
  user: {
    name: string;
    avatar: string;
  };
}

const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Most Popular Stream of the Week',
    thumbnail: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800&auto=format&fit=crop',
    duration: '12:34',
    views: 1000000,
    likes: 50000,
    trending: 1,
    createdAt: '2024-03-15',
    user: {
      name: 'Top Streamer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop'
    }
  },
  {
    id: '2',
    title: 'Viral Gaming Moment',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop',
    duration: '8:21',
    views: 750000,
    likes: 35000,
    trending: 2,
    createdAt: '2024-03-14',
    user: {
      name: 'Gaming Legend',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop'
    }
  }
];

export function TrendingScreen() {
  const navigate = useNavigate();
  const categories = [
    { name: 'Now', icon: Flame },
    { name: 'Today', icon: TrendingUp },
    { name: 'This Week', icon: BarChart2 },
    { name: 'Popular', icon: Star },
    { name: 'Rising', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/home')}>
            <LogoPlaceholder />
            <h1 className="text-xl font-bold text-primary">Trending</h1>
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
        <div className="flex gap-4 py-6 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.name}
              className="flex items-center gap-2 px-6 py-2 bg-card text-card-foreground rounded-full shadow-sm hover:shadow-md transition-shadow whitespace-nowrap"
            >
              <category.icon size={20} className="text-primary" />
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Trending Videos */}
        <div className="py-6">
          <div className="grid grid-cols-1 gap-6">
            {MOCK_VIDEOS.map((video) => (
              <div
                key={video.id}
                onClick={() => navigate(`/video/${video.id}`)}
                className="bg-card text-card-foreground rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-96">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      <Flame size={14} />
                      <span>#{video.trending} Trending</span>
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-sm">
                      {video.duration}
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={video.user.avatar}
                        alt={video.user.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="text-xl font-semibold">
                          {video.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {video.user.name}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{video.views.toLocaleString()} views</span>
                          <span>{video.likes.toLocaleString()} likes</span>
                          <span>{video.createdAt}</span>
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
    </div>
  );
}