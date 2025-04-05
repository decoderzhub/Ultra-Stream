import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoPlaceholder } from '../components/LogoPlaceholder';
import { ArrowLeft, Heart, MessageCircle, Share2, User, Play } from 'lucide-react';

interface Short {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  likes: number;
  comments: number;
  user: {
    name: string;
    avatar: string;
    followers: number;
  };
}

const MOCK_SHORTS: Short[] = [
  {
    id: '1',
    title: 'Quick Streaming Tips',
    description: 'Learn these essential streaming tips in under a minute!',
    thumbnail: 'https://i.postimg.cc/SRYzJxw9/brown-breast-female.png?w=800&auto=format&fit=crop',
    likes: 1234,
    comments: 89,
    user: {
      name: 'Stream Pro',
      avatar: 'https://i.postimg.cc/SRYzJxw9/brown-breast-female.png?w=50&auto=format&fit=crop',
      followers: 50000
    }
  },
  {
    id: '2',
    title: 'Gaming Highlights',
    description: 'Best gaming moments of the week!',
    thumbnail: 'https://i.postimg.cc/m2M8nLth/brown-butt.png?w=800&auto=format&fit=crop',
    likes: 2567,
    comments: 156,
    user: {
      name: 'Gaming Master',
      avatar: 'https://i.postimg.cc/m2M8nLth/brown-butt.png?w=50&auto=format&fit=crop',
      followers: 75000
    }
  }
];

export function ShortsScreen() {
  const navigate = useNavigate();
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const handleLike = (shortId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setLiked(prev => ({
      ...prev,
      [shortId]: !prev[shortId]
    }));
  };

  const handleShortClick = (shortId: string) => {
    // Here you could navigate to a full-screen view of the short
    console.log('Viewing short:', shortId);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-2">
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-foreground"
          >
            <ArrowLeft size={24} />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex items-center gap-4">
            <LogoPlaceholder />
            <h1 className="text-xl font-bold text-primary">Shorts</h1>
          </div>
          
          <button 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          >
            <User size={20} />
          </button>
        </div>
      </header>

      {/* Shorts Grid */}
      <div className="pt-16 px-4 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {MOCK_SHORTS.map((short) => (
            <div 
              key={short.id}
              onClick={() => handleShortClick(short.id)}
              className="bg-card text-card-foreground rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[9/16]">
                <img 
                  src={short.thumbnail}
                  alt={short.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
              
              {/* Info */}
              <div className="p-2">
                <h3 className="font-medium line-clamp-1 text-xs">
                  {short.title}
                </h3>
                
                <div className="flex items-center gap-1.5 mt-1.5">
                  <img 
                    src={short.user.avatar}
                    alt={short.user.name}
                    className="w-4 h-4 rounded-full"
                  />
                  <span className="text-muted-foreground text-xs truncate">
                    {short.user.name}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Heart size={12} />
                      <span>{short.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={12} />
                      <span>{short.comments}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(short.id, e);
                    }}
                    className={`p-1 rounded-full ${
                      liked[short.id] 
                        ? 'text-primary' 
                        : 'hover:bg-accent'
                    }`}
                  >
                    <Heart size={14} fill={liked[short.id] ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}