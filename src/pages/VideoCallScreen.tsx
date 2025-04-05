import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-react';

const appId = import.meta.env.VITE_AGORA_APP_ID;

export function VideoCallScreen() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [localTracks, setLocalTracks] = useState<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCClient[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  useEffect(() => {
    const initCall = async () => {
      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      
      try {
        await client.join(appId, 'test-channel', null, user?.uid);
        
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalTracks([audioTrack, videoTrack]);
        
        await client.publish([audioTrack, videoTrack]);
        
        client.on('user-published', async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          setRemoteUsers(prev => [...prev, user]);
        });
        
        client.on('user-unpublished', (user) => {
          setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
        });
      } catch (error) {
        console.error('Error joining call:', error);
      }
    };

    if (user && userId) {
      initCall();
    }

    return () => {
      localTracks?.[0].close();
      localTracks?.[1].close();
    };
  }, [user, userId]);

  const toggleMute = () => {
    if (localTracks) {
      localTracks[0].setEnabled(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localTracks) {
      localTracks[1].setEnabled(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const endCall = () => {
    localTracks?.[0].close();
    localTracks?.[1].close();
    navigate('/messages');
  };

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Video Grid */}
      <div className="grid grid-cols-2 gap-4 p-4 h-screen">
        {/* Local Video */}
        <div className="relative rounded-lg overflow-hidden bg-gray-800">
          {localTracks && (
            <div className="absolute inset-0">
              <video
                className="w-full h-full object-cover"
                ref={(ref) => {
                  if (ref) ref.srcObject = localTracks[1].getMediaStream();
                }}
                autoPlay
                muted
              />
            </div>
          )}
          <div className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded-lg">
            You
          </div>
        </div>

        {/* Remote Videos */}
        {remoteUsers.map((remoteUser) => (
          <div key={remoteUser.uid} className="relative rounded-lg overflow-hidden bg-gray-800">
            <video
              className="w-full h-full object-cover"
              ref={(ref) => {
                if (ref) ref.srcObject = remoteUser.getMediaStream();
              }}
              autoPlay
            />
            <div className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded-lg">
              Remote User
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 p-4 rounded-full">
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full ${
            isMuted ? 'bg-red-500' : 'bg-gray-600'
          } hover:bg-opacity-80 transition-colors`}
        >
          {isMuted ? <MicOff className="text-white" /> : <Mic className="text-white" />}
        </button>

        <button
          onClick={endCall}
          className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
        >
          <PhoneOff className="text-white" />
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full ${
            !isVideoEnabled ? 'bg-red-500' : 'bg-gray-600'
          } hover:bg-opacity-80 transition-colors`}
        >
          {isVideoEnabled ? <Video className="text-white" /> : <VideoOff className="text-white" />}
        </button>
      </div>
    </div>
  );
}