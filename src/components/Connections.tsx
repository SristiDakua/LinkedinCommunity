import React, { useState, useEffect } from 'react';
import { User, UserPlus, UserCheck, MessageCircle } from 'lucide-react';
import { Connection, User as UserType } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Connections: React.FC = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [suggestions, setSuggestions] = useState<UserType[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'connections' | 'suggestions' | 'requests'>('connections');

  useEffect(() => {
    loadConnections();
    loadSuggestions();
    loadPendingRequests();
  }, []);

  const loadConnections = async () => {
    try {
      // TODO: API call to get connections
      // const response = await apiService.getMyConnections();
      // setConnections(response.data);
      
      // Mock data for now
      setConnections([]);
    } catch (error) {
      console.error('Error loading connections:', error);
    }
  };

  const loadSuggestions = async () => {
    try {
      // TODO: API call to get user suggestions
      // const response = await apiService.getUserSuggestions();
      // setSuggestions(response.data);
      
      // Mock data for now
      const mockSuggestions: UserType[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          bio: 'Product Manager at Tech Corp',
          headline: 'Product Manager • Startup Enthusiast',
          location: 'San Francisco, CA',
          connections: 500,
          followers: 250,
          following: 180,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Michael Chen',
          email: 'michael@example.com',
          bio: 'Senior Software Engineer specializing in React and Node.js',
          headline: 'Senior Software Engineer • React Expert',
          location: 'Seattle, WA',
          connections: 300,
          followers: 150,
          following: 120,
          createdAt: new Date().toISOString()
        }
      ];
      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    try {
      // TODO: API call to get pending requests
      // const response = await apiService.getPendingRequests();
      // setPendingRequests(response.data);
      
      // Mock data for now
      setPendingRequests([]);
    } catch (error) {
      console.error('Error loading pending requests:', error);
    }
  };

  const sendConnectionRequest = async (userId: string) => {
    try {
      // TODO: API call to send connection request
      // await apiService.sendConnectionRequest(userId);
      
      // Remove from suggestions
      setSuggestions(prev => prev.filter(u => u.id !== userId));
      alert('Connection request sent!');
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  const respondToRequest = async (connectionId: string, action: 'accepted' | 'declined') => {
    try {
      // TODO: API call to respond to request
      // await apiService.respondToConnectionRequest(connectionId, action);
      
      // Remove from pending requests
      setPendingRequests(prev => prev.filter(r => r.id !== connectionId));
      
      if (action === 'accepted') {
        loadConnections(); // Refresh connections
      }
    } catch (error) {
      console.error('Error responding to request:', error);
    }
  };

  const renderSuggestions = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {suggestions.map((suggestedUser) => (
        <div key={suggestedUser.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-white" size={32} />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg mb-1">
              {suggestedUser.name}
            </h3>
            <p className="text-gray-600 text-sm mb-2">{suggestedUser.headline}</p>
            <p className="text-gray-500 text-xs mb-4">{suggestedUser.location}</p>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {suggestedUser.bio}
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mb-4">
              <span>{suggestedUser.connections} connections</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => sendConnectionRequest(suggestedUser.id)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
              >
                <UserPlus size={16} />
                <span>Connect</span>
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <MessageCircle size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderConnections = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {connections.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <UserCheck size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No connections yet</h3>
          <p className="text-gray-600">Start connecting with people you know!</p>
        </div>
      ) : (
        connections.map((connection) => (
          <div key={connection.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            {/* Connection card content */}
          </div>
        ))
      )}
    </div>
  );

  const renderPendingRequests = () => (
    <div className="space-y-4">
      {pendingRequests.length === 0 ? (
        <div className="text-center py-12">
          <UserPlus size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
          <p className="text-gray-600">You're all caught up!</p>
        </div>
      ) : (
        pendingRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{request.requester.name}</h3>
                  <p className="text-gray-600 text-sm">{request.requester.headline}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => respondToRequest(request.id, 'accepted')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => respondToRequest(request.id, 'declined')}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Network</h1>
        <p className="text-gray-600">Manage your professional network</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('connections')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'connections'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Connections ({user?.connections || 0})
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'suggestions'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Suggestions ({suggestions.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'requests'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Requests ({pendingRequests.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'connections' && renderConnections()}
      {activeTab === 'suggestions' && renderSuggestions()}
      {activeTab === 'requests' && renderPendingRequests()}
    </div>
  );
};

export default Connections;
