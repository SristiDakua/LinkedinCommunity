import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Post } from '../types';

interface CreatePostProps {
  onPostCreated: (post: Post) => void;
  onClose?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, onClose }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setLoading(true);
    
    try {
      const newPost: Post = {
        id: Date.now().toString(),
        content: content.trim(),
        authorId: user.id,
        authorName: user.name,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
        type: 'text' as const
      };

      // Save to localStorage
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      posts.unshift(newPost);
      localStorage.setItem('posts', JSON.stringify(posts));

      onPostCreated(newPost);
      setContent('');
      onClose?.(); // Close modal if onClose is provided
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="professional-card">
      {onClose && (
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Create a post</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="text-gray-500 dark:text-gray-400 text-xl">×</span>
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="avatar-professional w-12 h-12 flex-shrink-0">
              <span className="text-lg">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <div className="status-online absolute -bottom-1 -right-1"></div>
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</span>
                  <span className="text-gray-500 dark:text-gray-400">•</span>
                  <select className="text-sm text-gray-600 dark:text-gray-300 bg-transparent border-0 focus:ring-0 cursor-pointer dark:bg-gray-800">
                    <option value="anyone" className="dark:bg-gray-800">Anyone</option>
                    <option value="connections" className="dark:bg-gray-800">Connections only</option>
                    <option value="connections-of-connections" className="dark:bg-gray-800">Connections of connections</option>
                  </select>
                </div>
              </div>
              
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to talk about?"
                className="w-full border-none resize-none focus:ring-0 focus:outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 text-lg leading-relaxed min-h-[120px] bg-transparent"
                maxLength={3000}
              />
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white text-xs">📷</span>
                    </div>
                    <span className="text-sm font-medium">Photo</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 group"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white text-xs">🎥</span>
                    </div>
                    <span className="text-sm font-medium">Video</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 group"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-white text-xs">📄</span>
                    </div>
                    <span className="text-sm font-medium">Document</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {content.length}/3,000
                  </span>
                  <button
                    type="submit"
                    disabled={!content.trim() || loading}
                    className={`px-6 py-2 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 ${
                      content.trim() && !loading
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Send size={16} />
                    )}
                    <span>{loading ? 'Posting...' : 'Post'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;