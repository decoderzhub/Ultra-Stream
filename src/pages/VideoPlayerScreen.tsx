import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LogoPlaceholder } from '../components/LogoPlaceholder';
import { User } from 'lucide-react';
import { auth } from '../firebase';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    followers: number;
  };
}

interface Comment {
  id: string;
  text: string;
  likes: number;
  createdAt: string;
  user: {
    name: string;
    avatar: string;
  };
}

const MOCK_VIDEO: Video = {
  id: '1',
  title: 'Getting Started with Ultra Stream',
  description: 'Learn how to get started with Ultra Stream, the next generation streaming platform.',
  thumbnail: 'https://i.postimg.cc/SRYzJxw9/brown-breast-female.png?w=800&auto=format&fit=crop',
  url: 'https://i.postimg.cc/SRYzJxw9/brown-breast-female.png?w=800&auto=format&fit=crop',
  duration: '12:34',
  views: 1234,
  likes: 156,
  comments: 48,
  createdAt: '2024-03-15',
  user: {
    id: 'user1',
    name: 'Ultra Stream',
    avatar: 'https://i.postimg.cc/SRYzJxw9/brown-breast-female.png?w=100&auto=format&fit=crop',
    followers: 10000
  }
};

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    text: 'This is an amazing tutorial! Thanks for sharing.',
    likes: 24,
    createdAt: '2024-03-15',
    user: {
      name: 'John Doe',
      avatar: 'https://i.postimg.cc/m2M8nLth/brown-butt.png?w=100&auto=format&fit=crop'
    }
  },
  {
    id: '2',
    text: 'Very helpful content, keep it up!',
    likes: 15,
    createdAt: '2024-03-15',
    user: {
      name: 'Jane Smith',
      avatar: 'https://i.postimg.cc/QM6b7VnY/white-girl-pole.png?w=100&auto=format&fit=crop'
    }
  }
];

export function VideoPlayerScreen() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [isVpnActive] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVideo(MOCK_VIDEO);
      setComments(MOCK_COMMENTS);
      setRelatedVideos([MOCK_VIDEO, MOCK_VIDEO, MOCK_VIDEO]);
      setLoading(false);
    }, 1000);
  }, [videoId]);

  const handleLike = () => {
    if (!auth.currentUser) {
      alert('Please login to like videos');
      return;
    }
    setLiked(!liked);
  };

  const handleAddComment = () => {
    if (!auth.currentUser) {
      alert('Please login to comment');
      return;
    }
    
    if (!commentText.trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText,
      likes: 0,
      createdAt: new Date().toISOString(),
      user: {
        name: auth.currentUser.displayName || 'Anonymous',
        avatar: auth.currentUser.photoURL || 'https://i.postimg.cc/SRYzJxw9/brown-breast-female.png?w=100&auto=format&fit=crop'
      }
    };
    
    setComments([newComment, ...comments]);
    setCommentText('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading video...</div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error || 'Video not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-2 px-4 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/home')}>
            <LogoPlaceholder />
            <h1 className="text-xl font-bold text-purple-600">Ultra Stream</h1>
          </div>
          
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search videos..."
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button className="absolute right-4 top-2.5 text-gray-400">
                🔍
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 hover:bg-purple-200 transition-colors"
          >
            <User size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
          {/* Video Player Column */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-4">
              {isVpnActive && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <span>🔒</span>
                  <span>VPN Active</span>
                </div>
              )}
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Video Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{video.title}</h1>
              
              <div className="flex items-center justify-between mb-6">
                <div className="text-gray-600">
                  {video.views.toLocaleString()} views • {new Date(video.createdAt).toLocaleDateString()}
                </div>
                
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      liked ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                    } hover:bg-gray-200 transition-colors`}
                  >
                    👍 {video.likes}
                  </button>
                  
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                    💬 {video.comments}
                  </button>
                  
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                    ↗️ Share
                  </button>
                </div>
              </div>

              {/* Channel Info */}
              <div className="flex items-center justify-between pb-6 border-b">
                <div className="flex items-center gap-4">
                  <img 
                    src={video.user.avatar} 
                    alt={video.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{video.user.name}</h3>
                    <p className="text-gray-600 text-sm">{video.user.followers.toLocaleString()} followers</p>
                  </div>
                </div>
                
                <button className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                  Subscribe
                </button>
              </div>

              {/* Description */}
              <div className="py-6 border-b">
                <p className="text-gray-700 whitespace-pre-line">{video.description}</p>
              </div>

              {/* Comments */}
              <div className="pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {comments.length} Comments
                </h3>

                {auth.currentUser && (
                  <div className="flex gap-4 mb-8">
                    <img 
                      src={auth.currentUser.photoURL || 'https://i.postimg.cc/SRYzJxw9/brown-breast-female.png?w=100&auto=format&fit=crop'} 
                      alt="Your avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full px-0 py-2 border-b border-gray-300 focus:outline-none focus:border-purple-600"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleAddComment}
                          disabled={!commentText.trim()}
                          className="px-4 py-2 bg-purple-600 text-white rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <img 
                        src={comment.user.avatar} 
                        alt={comment.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">
                            {comment.user.name}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{comment.text}</p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                            👍 {comment.likes}
                          </button>
                          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                            👎
                          </button>
                          <button className="text-gray-500 hover:text-gray-700">
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Videos Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Related Videos</h3>
            
            {relatedVideos.map((relatedVideo, index) => (
              <div 
                key={`${relatedVideo.id}-${index}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/video/${relatedVideo.id}`)}
              >
                <div className="relative aspect-video">
                  <img 
                    src={relatedVideo.thumbnail}
                    alt={relatedVideo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-1 rounded">
                    {relatedVideo.duration}
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {relatedVideo.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{relatedVideo.user.name}</p>
                  <p className="text-gray-500 text-sm">
                    {relatedVideo.views.toLocaleString()} views • {new Date(relatedVideo.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}