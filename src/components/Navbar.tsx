import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Menu, X, Home, UserIcon, Users, Briefcase, Moon, Sun, Bell, MessageCircle, Search, Send, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface NavbarProps {
  currentView: 'feed' | 'profile' | 'connections' | 'jobs' | 'auth';
  onViewChange: (view: 'feed' | 'profile' | 'connections' | 'jobs' | 'auth') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Close messages dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (messagesRef.current && !messagesRef.current.contains(event.target as Node)) {
        setShowMessages(false);
        setSelectedConversation(null);
      }
    };

    if (showMessages) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMessages]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation?.messages]);

  // Mark conversation as read when selected
  useEffect(() => {
    if (selectedConversation) {
      setConversations(prev => prev.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, unread: false }
          : conv
      ));
    }
  }, [selectedConversation]);
  
  // Mock conversations data
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      lastMessage: 'Thanks for connecting!',
      time: '2 min ago',
      unread: true,
      messages: [
        { id: 1, text: 'Hi there! Thanks for connecting with me.', sender: 'Alice Johnson', time: '2:30 PM', isOwn: false },
        { id: 2, text: 'Thanks for connecting!', sender: 'Alice Johnson', time: '2:32 PM', isOwn: false }
      ]
    },
    {
      id: 2,
      name: 'Mike Chen',
      lastMessage: 'Let\'s schedule a call',
      time: '1 hour ago',
      unread: true,
      messages: [
        { id: 1, text: 'Hey! I saw your profile and I\'m interested in discussing potential collaboration.', sender: 'Mike Chen', time: '1:15 PM', isOwn: false },
        { id: 2, text: 'Let\'s schedule a call', sender: 'Mike Chen', time: '1:20 PM', isOwn: false }
      ]
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      lastMessage: 'Great meeting you!',
      time: '3 hours ago',
      unread: false,
      messages: [
        { id: 1, text: 'It was great meeting you at the conference!', sender: 'Sarah Wilson', time: '11:30 AM', isOwn: false },
        { id: 2, text: 'Great meeting you!', sender: 'Sarah Wilson', time: '11:35 AM', isOwn: false }
      ]
    }
  ]);

  const sendMessage = () => {
    if (newMessage.trim() && selectedConversation && !isSending) {
      setIsSending(true);
      
      const message = {
        id: Date.now(),
        text: newMessage.trim(),
        sender: user?.name || 'You',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      
      // Simulate slight delay for better UX
      setTimeout(() => {
        // Update conversations with new message
        const updatedConversations = conversations.map(conv => 
          conv.id === selectedConversation.id 
            ? { 
                ...conv, 
                messages: [...conv.messages, message], 
                lastMessage: newMessage.trim(),
                time: 'now',
                unread: false
              }
            : conv
        );
        
        setConversations(updatedConversations);
        
        // Update selected conversation to show new message immediately
        setSelectedConversation((prev: any) => ({
          ...prev,
          messages: [...prev.messages, message],
          lastMessage: newMessage.trim()
        }));
        
        setNewMessage('');
        setIsSending(false);
      }, 100);
    }
  };

  const handleLogout = () => {
    logout();
    onViewChange('auth');
    setMobileMenuOpen(false);
  };

  if (!user) return null;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-professional border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Search */}
          <div className="flex items-center flex-1 max-w-2xl">
            <div className="flex-shrink-0 mr-4">
              {/* Innovative LinkedIn-like Logo */}
              <div className="flex items-center logo-container group cursor-pointer" onClick={() => onViewChange('feed')}>
                {/* Logo Icon */}
                <div className="relative mr-3">
                  <div className="logo-icon w-11 h-11 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 relative overflow-hidden">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    
                    {/* Inner Icon - Network nodes */}
                    <div className="relative z-10">
                      {/* Connection nodes */}
                      <div className="connection-node absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-white rounded-full shadow-sm"></div>
                      <div className="connection-node absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-white rounded-full shadow-sm"></div>
                      <div className="connection-node absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-sm"></div>
                      
                      {/* Center network symbol */}
                      <div className="w-5 h-5 border-2 border-white rounded bg-white/10 backdrop-blur-sm"></div>
                      
                      {/* Connection lines with glow */}
                      <div className="absolute top-0 left-1/2 w-0.5 h-2.5 bg-white/80 shadow-sm transform -translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-1/2 w-0.5 h-2.5 bg-white/80 shadow-sm transform -translate-x-1/2"></div>
                      <div className="absolute left-0 top-1/2 w-2.5 h-0.5 bg-white/80 shadow-sm transform -translate-y-1/2"></div>
                      <div className="absolute right-0 top-1/2 w-2.5 h-0.5 bg-white/80 shadow-sm transform -translate-y-1/2"></div>
                    </div>
                  </div>
                  
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-md -z-10"></div>
                </div>
                
                {/* Logo Text */}
                <div className="flex flex-col relative">
                  <div className="flex items-center">
                    <h1 className="text-xl font-bold logo-text-animated group-hover:scale-105 transition-transform duration-300">
                      Professional Network
                    </h1>
                    {/* Modern version badge */}
                    <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                      Pro
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium -mt-0.5 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
                    Professional Network
                  </div>
                </div>
                
                {/* Subtle hover indicator */}
                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              <button
                onClick={() => onViewChange('feed')}
                className={`nav-item-professional ${
                  currentView === 'feed' ? 'nav-item-active' : 'nav-item-inactive'
                }`}
              >
                <Home size={20} />
                <span>Home</span>
                {currentView === 'feed' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                )}
              </button>
              <button
                onClick={() => onViewChange('connections')}
                className={`nav-item-professional ${
                  currentView === 'connections' ? 'nav-item-active' : 'nav-item-inactive'
                }`}
              >
                <Users size={20} />
                <span>My Network</span>
                {currentView === 'connections' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                )}
              </button>
              <button
                onClick={() => onViewChange('jobs')}
                className={`nav-item-professional ${
                  currentView === 'jobs' ? 'nav-item-active' : 'nav-item-inactive'
                }`}
              >
                <Briefcase size={20} />
                <span>Jobs</span>
                {currentView === 'jobs' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                )}
              </button>
              <button
                onClick={() => onViewChange('profile')}
                className={`nav-item-professional ${
                  currentView === 'profile' ? 'nav-item-active' : 'nav-item-inactive'
                }`}
              >
                <UserIcon size={20} />
                <span>Me</span>
                {currentView === 'profile' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                )}
              </button>
            </div>
          </div>

          {/* Desktop User Menu */}
                    {/* Desktop User Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                >
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                    </div>
                    <div className="p-2">
                      <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                        <p className="text-sm text-gray-900 dark:text-gray-100">John liked your post</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                      </div>
                      <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                        <p className="text-sm text-gray-900 dark:text-gray-100">Sarah commented on your post</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">4 hours ago</p>
                      </div>
                      <div className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                        <p className="text-sm text-gray-900 dark:text-gray-100">New connection request</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="relative" ref={messagesRef}>
                <button
                  onClick={() => setShowMessages(!showMessages)}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                >
                  <MessageCircle size={20} />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {conversations.filter(c => c.unread).length}
                  </span>
                </button>
                
                {showMessages && (
                  <div className="absolute right-0 mt-2 w-96 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 flex flex-col">
                    {!selectedConversation ? (
                      // Conversations List
                      <>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Messages</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                          {conversations.map((conversation) => (
                            <div
                              key={conversation.id}
                              onClick={() => setSelectedConversation(conversation)}
                              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-3">
                                      {conversation.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {conversation.name}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {conversation.lastMessage}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-400">{conversation.time}</p>
                                  {conversation.unread && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-auto"></div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      // Individual Conversation
                      <>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                          <button
                            onClick={() => setSelectedConversation(null)}
                            className="mr-3 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                          >
                            <ArrowLeft size={16} />
                          </button>
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-3">
                            {selectedConversation.name.charAt(0)}
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {selectedConversation.name}
                          </h3>
                        </div>
                        
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '300px' }}>
                          {selectedConversation.messages.map((message: any) => (
                            <div
                              key={message.id}
                              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.isOwn
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                }`}
                              >
                                <p className="text-sm">{message.text}</p>
                                <p className={`text-xs mt-1 ${
                                  message.isOwn ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                  {message.time}
                                </p>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                        
                        {/* Message Input */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey && newMessage.trim() && !isSending) {
                                  e.preventDefault();
                                  sendMessage();
                                }
                              }}
                              placeholder={isSending ? "Sending..." : "Type a message..."}
                              disabled={isSending}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
                              autoComplete="off"
                            />
                            <button
                              onClick={sendMessage}
                              disabled={!newMessage.trim() || isSending}
                              className={`px-4 py-2 rounded-md transition-colors ${
                                newMessage.trim() && !isSending
                                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {isSending ? (
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-2 border-t-blue-500 rounded-full animate-spin"></div>
                              ) : (
                                <Send size={16} />
                              )}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="avatar-professional w-8 h-8">
                    <span className="text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">View profile</p>
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          onViewChange('profile');
                          setShowUserMenu(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <UserIcon size={16} className="mr-2" />
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          onViewChange('connections');
                          setShowUserMenu(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      >
                        <Users size={16} className="mr-2" />
                        My Network
                      </button>
                      <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                onViewChange('feed');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition-colors ${
                currentView === 'feed'
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/50 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Home size={18} />
              <span>Feed</span>
            </button>
            <button
              onClick={() => {
                onViewChange('connections');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition-colors ${
                currentView === 'connections'
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/50 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Users size={18} />
              <span>Network</span>
            </button>
            <button
              onClick={() => {
                onViewChange('jobs');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition-colors ${
                currentView === 'jobs'
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/50 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Briefcase size={18} />
              <span>Jobs</span>
            </button>
            <button
              onClick={() => {
                onViewChange('profile');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition-colors ${
                currentView === 'profile'
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/50 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <UserIcon size={18} />
              <span>Profile</span>
            </button>
            
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-3 mb-3">
                <div className="avatar-professional w-10 h-10">
                  <span className="text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-gray-200">{user.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                </div>
              </div>
              
              {/* Theme Toggle Mobile */}
              <button
                onClick={() => {
                  toggleDarkMode();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md flex items-center space-x-2 transition-colors"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md flex items-center space-x-2 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;