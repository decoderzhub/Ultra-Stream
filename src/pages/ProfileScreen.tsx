import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoPlaceholder } from '../components/LogoPlaceholder';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { User, Settings, Edit3, LogOut, Shield, Film, Heart, Users, Eye } from 'lucide-react';
import { auth } from '../firebase';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  createdAt: string;
  isShort?: boolean;
}

const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Getting Started with Ultra Stream',
    thumbnail: 'https://i.postimg.cc/SRYzJxw9/brown-breast-female.png?w=800&auto=format&fit=crop',
    duration: '12:34',
    views: 1234,
    likes: 156,
    createdAt: '2024-03-15',
  },
  {
    id: '2',
    title: 'Advanced Streaming Tips',
    thumbnail: 'https://i.postimg.cc/m2M8nLth/brown-butt.png?w=800&auto=format&fit=crop',
    duration: '8:21',
    views: 892,
    likes: 78,
    createdAt: '2024-03-14',
    isShort: true,
  }
];

export function ProfileScreen() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isVpnActive, setIsVpnActive] = useState(true);
  const [profileData, setProfileData] = useState({
    displayName: auth.currentUser?.displayName || 'User',
    bio: 'Welcome to my channel! I create content about streaming and gaming.',
    email: auth.currentUser?.email || '',
  });

  const stats = [
    { icon: Film, label: 'Videos', value: '24' },
    { icon: Users, label: 'Followers', value: '1.2K' },
    { icon: Heart, label: 'Likes', value: '45.6K' },
    { icon: Eye, label: 'Views', value: '102K' }
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Here you would typically save to Firebase
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/home')}>
            <LogoPlaceholder />
            <h1 className="text-xl font-bold text-primary">Ultra Stream</h1>
          </div>
          
          <button 
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          >
            <User size={20} />
          </button>
        </div>
      </header>

      <div className="pt-16 px-4 max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-card text-card-foreground rounded-xl shadow-sm mt-6 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary/80 to-primary"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
              <div className="w-24 h-24 rounded-full border-4 border-background bg-primary/10 flex items-center justify-center overflow-hidden">
                {auth.currentUser?.photoURL ? (
                  <img 
                    src={auth.currentUser.photoURL} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-primary" />
                )}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold">{profileData.displayName}</h1>
                <p className="text-muted-foreground">{profileData.email}</p>
              </div>
              
              <div className="flex gap-3">
                {isEditing ? (
                  <Button onClick={handleSaveProfile}>Save Profile</Button>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="secondary">
                    <Edit3 size={18} className="mr-2" />
                    Edit Profile
                  </Button>
                )}
                <Button onClick={handleLogout} variant="secondary">
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Stats */}
          <div className="md:col-span-2 bg-card text-card-foreground rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Channel Statistics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-accent">
                  <stat.icon size={24} className="mx-auto mb-2 text-primary" />
                  <div className="font-semibold text-xl">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-card text-card-foreground rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-primary" />
                  <span>VPN Protection</span>
                </div>
                <button
                  onClick={() => setIsVpnActive(!isVpnActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isVpnActive ? 'bg-primary' : 'bg-accent'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isVpnActive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings size={20} className="text-primary" />
                  <span>Notifications</span>
                </div>
                <button
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary"
                >
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Videos */}
        <div className="mt-6 bg-card text-card-foreground rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Your Videos</h2>
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
                  {video.isShort ? (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center gap-1">
                      <Film size={14} />
                      <span>Short</span>
                    </div>
                  ) : (
                    <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-sm">
                      {video.duration}
                    </span>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                    <span>{video.views.toLocaleString()} views</span>
                    <div className="flex items-center gap-1">
                      <Heart size={14} />
                      <span>{video.likes}</span>
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