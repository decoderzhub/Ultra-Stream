import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoPlaceholder } from '../components/LogoPlaceholder';
import { User, Send, Phone, Video, MoreVertical } from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
  read: boolean;
}

interface Chat {
  id: string;
  users: string[];
  lastMessage?: string;
  lastMessageTime?: any;
  unreadCount: number;
  user: {
    id: string;
    name: string;
    avatar: string;
    online: boolean;
  };
}

export function MessagesScreen() {
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'chats'),
      where('users', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList: Chat[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const otherUserId = data.users.find((id: string) => id !== currentUser.uid);
        chatList.push({
          id: doc.id,
          users: data.users,
          lastMessage: data.lastMessage,
          lastMessageTime: data.lastMessageTime,
          unreadCount: data.unreadCount || 0,
          user: {
            id: otherUserId,
            name: data.userNames[otherUserId] || 'User',
            avatar: data.userAvatars[otherUserId] || '',
            online: data.userStatuses?.[otherUserId] || false,
          },
        });
      });
      setChats(chatList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (!selectedChat || !currentUser) return;

    const q = query(
      collection(db, `chats/${selectedChat.id}/messages`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList: Message[] = [];
      snapshot.forEach((doc) => {
        messageList.push({
          id: doc.id,
          ...doc.data(),
        } as Message);
      });
      setMessages(messageList.reverse());
    });

    return () => unsubscribe();
  }, [selectedChat, currentUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !currentUser) return;

    try {
      await addDoc(collection(db, `chats/${selectedChat.id}/messages`), {
        text: newMessage,
        senderId: currentUser.uid,
        createdAt: serverTimestamp(),
        read: false,
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const startVideoCall = (userId: string) => {
    navigate(`/call/${userId}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/home')}>
            <LogoPlaceholder />
            <h1 className="text-xl font-bold text-primary">Messages</h1>
          </div>
          
          <button 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
          >
            <User size={20} />
          </button>
        </div>
      </header>

      <div className="pt-16 flex h-[calc(100vh-4rem)]">
        {/* Chat List */}
        <div className="w-80 border-r border-border bg-card">
          <div className="p-4">
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full px-4 py-2 rounded-full border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
          </div>

          <div className="overflow-y-auto h-full">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 cursor-pointer hover:bg-accent ${
                  selectedChat?.id === chat.id ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={chat.user.avatar || 'https://via.placeholder.com/40'}
                      alt={chat.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    {chat.user.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{chat.user.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col bg-background">
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedChat.user.avatar || 'https://via.placeholder.com/40'}
                  alt={selectedChat.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{selectedChat.user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedChat.user.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => startVideoCall(selectedChat.user.id)}
                  className="p-2 hover:bg-accent rounded-full"
                >
                  <Video size={20} className="text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-accent rounded-full">
                  <Phone size={20} className="text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-accent rounded-full">
                  <MoreVertical size={20} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.senderId === currentUser?.uid
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-accent-foreground'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.createdAt?.toDate().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-full border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center">
              <h3 className="text-xl font-medium text-foreground">Select a chat to start messaging</h3>
              <p className="text-muted-foreground mt-2">Choose from your existing conversations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}