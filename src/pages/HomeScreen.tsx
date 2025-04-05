import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoPlaceholder } from '../components/LogoPlaceholder';
import { 
  Search, 
  Home, 
  TrendingUp, 
  Library, 
  History, 
  User, 
  Settings, 
  Film, 
  Gamepad2, 
  Music2, 
  Newspaper, 
  Trophy, 
  Smartphone,
  MessageSquare,
  Video
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  createdAt: string;
  isShort?: boolean;
  user: {
    name: string;
    avatar: string;
  };
}

const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Getting Started with Ultra Stream',
    thumbnail: 'https://i.postimg.cc/SRYzJxw9/brown-breast-female.png?w=800&auto=format&fit=crop',
    duration: '12:34',
    views: 1234,
    createdAt: '2024-03-15',
    user: {
      name: 'Ultra Stream',
      avatar: 'https://i.postimg.cc/SRYzJxw9/brown-breast-female.png?w=50&auto=format&fit=crop'
    }
  },
  {
    id: '2',
    title: 'Advanced Streaming Tips',
    thumbnail: 'https://i.postimg.cc/m2M8nLth/brown-butt.png?w=800&auto=format&fit=crop',
    duration: '8:21',
    views: 892,
    createdAt: '2024-03-14',
    isShort: true,
    user: {
      name: 'Gaming Master',
      avatar: 'https://i.postimg.cc/m2M8nLth/brown-butt.png?w=50&auto=format&fit=crop'
    }
  },
  {
    id: '3',
    title: 'Content Creation Tips & Tricks',
    thumbnail: 'https://i.postimg.cc/QM6b7VnY/white-girl-pole.png?w=800&auto=format&fit=crop',
    duration: '15:45',
    views: 2156,
    createdAt: '2024-03-13',
    user: {
      name: 'Creator Hub',
      avatar: 'https://i.postimg.cc/QM6b7VnY/white-girl-pole.png?w=50&auto=format&fit=crop'
    }
  }
];

const categories = [
  { name: 'All', icon: Home },
  { name: 'Popular', icon: TrendingUp },
  { name: 'Discover', icon: Search },
  { name: 'Live', icon: Film },
  { name: 'Party', icon: Music2 },
];

export function HomeScreen() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [videos] = useState<Video[]>(MOCK_VIDEOS);

  const handleVideoClick = (video: Video) => {
    if (video.isShort) {
      navigate('/shorts');
    } else {
      navigate(`/video/${video.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <LogoPlaceholder />
            <h1 className="text-xl font-bold text-primary">Ultra Stream</h1>
          </div>
          
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="w-full px-4 py-2 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
              <Search className="absolute right-4 top-2.5 text-muted-foreground" size={20} />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/messages')}
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
            >
              <MessageSquare size={20} />
            </button>
            
            <button 
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
            >
              <User size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border overflow-y-auto">
          <nav className="p-4 space-y-2">
            <button 
              onClick={() => navigate('/home')}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 text-primary"
            >
              <Home size={20} />
              <span>Home</span>
            </button>
            
            <button 
              onClick={() => navigate('/shorts')}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              <Smartphone size={20} />
              <span>Shorts</span>
            </button>
            
            <button 
              onClick={() => navigate('/messages')}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              <MessageSquare size={20} />
              <span>Messages</span>
            </button>
            
            <button 
              onClick={() => navigate('/trending')}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              <TrendingUp size={20} />
              <span>Trending</span>
            </button>
            
            <button 
              onClick={() => navigate('/library')}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              <Library size={20} />
              <span>Library</span>
            </button>
            
            <button 
              onClick={() => navigate('/history')}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              <History size={20} />
              <span>History</span>
            </button>
            
            <button 
              onClick={() => navigate('/settings')}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-foreground hover:bg-accent transition-colors"
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6">
          {/* Categories */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  activeCategory === category.name
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-foreground hover:bg-accent'
                }`}
              >
                <category.icon size={18} />
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video)}
                className="bg-card rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  {video.isShort ? (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      <Smartphone size={14} />
                      <span>Short</span>
                    </div>
                  ) : (
                    <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-sm">
                      {video.duration}
                    </span>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex gap-3">
                    <img
                      src={video.user.avatar}
                      alt={video.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-foreground line-clamp-2">
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
        </main>
      </div>
    </div>
  );
}