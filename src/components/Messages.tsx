import React, { useState, useEffect } from 'react';
import { Send, Search, MoreVertical, Phone, Video } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar: string;
}

const Messages: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load conversations from localStorage
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    } else {
      // Initialize with sample conversations
      const sampleConversations: Conversation[] = [
        {
          id: 'conv-1',
          participantId: 'user-alice',
          participantName: 'Alice Johnson',
          lastMessage: 'Thanks for connecting! Looking forward to collaborating.',
          lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
          unreadCount: 2,
          avatar: 'AJ'
        },
        {
          id: 'conv-2',
          participantId: 'user-mike',
          participantName: 'Mike Chen',
          lastMessage: "Let's schedule a call to discuss the project requirements.",
          lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
          unreadCount: 1,
          avatar: 'MC'
        },
        {
          id: 'conv-3',
          participantId: 'user-sarah',
          participantName: 'Sarah Wilson',
          lastMessage: 'The presentation looks great! 👍',
          lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
          unreadCount: 0,
          avatar: 'SW'
        }
      ];
      setConversations(sampleConversations);
      localStorage.setItem('conversations', JSON.stringify(sampleConversations));
    }
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      // Load messages for selected conversation
      const savedMessages = localStorage.getItem(`messages-${selectedConversation}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Initialize with sample messages
        const sampleMessages: Message[] = [
          {
            id: 'msg-1',
            senderId: selectedConversation === 'conv-1' ? 'user-alice' : 'user-mike',
            senderName: selectedConversation === 'conv-1' ? 'Alice Johnson' : 'Mike Chen',
            receiverId: user?.id || 'current-user',
            content: selectedConversation === 'conv-1' 
              ? 'Hi! Thanks for connecting. I saw your profile and was impressed by your experience in web development.'
              : 'Hello! I have an exciting project opportunity that might interest you.',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            read: true
          },
          {
            id: 'msg-2',
            senderId: user?.id || 'current-user',
            senderName: user?.name || 'You',
            receiverId: selectedConversation === 'conv-1' ? 'user-alice' : 'user-mike',
            content: selectedConversation === 'conv-1'
              ? 'Thank you! I would love to learn more about potential collaboration opportunities.'
              : 'That sounds interesting! Could you share more details about the project?',
            timestamp: new Date(Date.now() - 82800000).toISOString(),
            read: true
          },
          {
            id: 'msg-3',
            senderId: selectedConversation === 'conv-1' ? 'user-alice' : 'user-mike',
            senderName: selectedConversation === 'conv-1' ? 'Alice Johnson' : 'Mike Chen',
            receiverId: user?.id || 'current-user',
            content: selectedConversation === 'conv-1'
              ? 'Thanks for connecting! Looking forward to collaborating.'
              : "Let's schedule a call to discuss the project requirements.",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false
          }
        ];
        setMessages(sampleMessages);
        localStorage.setItem(`messages-${selectedConversation}`, JSON.stringify(sampleMessages));
      }
    }
  }, [selectedConversation, user]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      receiverId: conversations.find(c => c.id === selectedConversation)?.participantId || '',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(`messages-${selectedConversation}`, JSON.stringify(updatedMessages));

    // Update conversation with last message
    const updatedConversations = conversations.map(conv => 
      conv.id === selectedConversation 
        ? { ...conv, lastMessage: newMessage.trim(), lastMessageTime: message.timestamp }
        : conv
    );
    setConversations(updatedConversations);
    localStorage.setItem('conversations', JSON.stringify(updatedConversations));

    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-screen">
          {/* Conversations List */}
          <div className="w-1/3 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-semibold text-professional-primary mb-4">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-professional-primary"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    selectedConversation === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="professional-avatar w-12 h-12">
                      <span className="text-sm">{conversation.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-professional-primary truncate">
                          {conversation.participantName}
                        </p>
                        <p className="text-xs text-professional-muted">
                          {formatTime(conversation.lastMessageTime)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-professional-muted truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation && selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="professional-avatar w-10 h-10">
                        <span className="text-sm">{selectedConv.avatar}</span>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-professional-primary">
                          {selectedConv.participantName}
                        </h2>
                        <p className="text-sm text-professional-muted">Active now</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Phone size={20} />
                      </button>
                      <button className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Video size={20} />
                      </button>
                      <button className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-black">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === user?.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-white dark:bg-gray-800 text-professional-primary border border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === user?.id ? 'text-blue-100' : 'text-professional-muted'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-professional-primary"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-black">
                <div className="text-center">
                  <div className="professional-avatar w-16 h-16 mx-auto mb-4">
                    <span className="text-xl">💬</span>
                  </div>
                  <h3 className="text-lg font-medium text-professional-primary mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-professional-muted">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
