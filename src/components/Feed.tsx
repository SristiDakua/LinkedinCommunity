import React, { useState, useEffect } from 'react';
import { Post } from '../types';
import { useAuth } from '../contexts/AuthContext';
import CreatePost from './CreatePost';
import PostCard from './PostCard';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { user } = useAuth();

  const handlePhotoClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        // Handle photo upload
        console.log('Selected photos:', files);
        setShowCreatePost(true);
      }
    };
    input.click();
  };

  const handleVideoClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        // Handle video upload
        console.log('Selected video:', files[0]);
        setShowCreatePost(true);
      }
    };
    input.click();
  };

  const handleDocumentClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        // Handle document upload
        console.log('Selected document:', files[0]);
        setShowCreatePost(true);
      }
    };
    input.click();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API first
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/posts', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setPosts(data);
            return;
          }
        } catch (apiError) {
          console.log('API not available, falling back to localStorage');
        }
      }

      // Fallback to localStorage
      const storedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      setPosts(storedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      setError('Failed to load posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
    setShowCreatePost(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Quick Actions */}
      <div className="professional-card mb-6">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="avatar-professional w-12 h-12">
              <span className="text-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
              <div className="status-online absolute -bottom-1 -right-1"></div>
            </div>
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex-1 text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              What's on your mind, {user?.name?.split(' ')[0] || 'there'}?
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button 
              onClick={handlePhotoClick}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
            >
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-xs">📷</span>
              </div>
              <span className="font-medium">Photo</span>
            </button>
            <button 
              onClick={handleVideoClick}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 group"
            >
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-xs">🎥</span>
              </div>
              <span className="font-medium">Video</span>
            </button>
            <button 
              onClick={handleDocumentClick}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 group"
            >
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-xs">📄</span>
              </div>
              <span className="font-medium">Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* LinkedIn News / Trending */}
      <div className="professional-card mb-6">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-linkedin-gradient rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">in</span>
            </div>
            <h3 className="text-professional-primary font-semibold">LinkedIn News</h3>
          </div>
        </div>
        <div className="p-6 pt-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 -mx-2 px-2 py-2 rounded-lg transition-colors">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-professional-secondary font-medium">Remote work trends in 2024</p>
                <p className="text-professional-muted text-sm mt-1">2h ago • 1,247 readers</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 -mx-2 px-2 py-2 rounded-lg transition-colors">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-professional-secondary font-medium">AI in software development</p>
                <p className="text-professional-muted text-sm mt-1">4h ago • 892 readers</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 -mx-2 px-2 py-2 rounded-lg transition-colors">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-professional-secondary font-medium">Tech industry layoffs update</p>
                <p className="text-professional-muted text-sm mt-1">6h ago • 2,156 readers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="professional-card">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 dark:text-red-400 text-2xl">⚠️</span>
              </div>
              <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2">Something went wrong</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <button
                onClick={fetchPosts}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="professional-card">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-500 dark:text-blue-400 text-2xl">📝</span>
              </div>
              <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-2">No posts yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Be the first to share something with your network!</p>
              <button
                onClick={() => setShowCreatePost(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
              >
                Create Post
              </button>
            </div>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowCreatePost(false)}
        >
          <div 
            className="w-full max-w-lg transform transition-all duration-300 animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            <CreatePost
              onPostCreated={handlePostCreated}
              onClose={() => setShowCreatePost(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;