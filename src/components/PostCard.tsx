import React, { useState } from 'react';
import { Clock, Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [commentsCount] = useState(post.comments || 0);
  const [showComments, setShowComments] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleLike = async () => {
    try {
      setLiked(!liked);
      setLikesCount(prev => liked ? prev - 1 : prev + 1);
      
      // TODO: API call to toggle like
      // await apiService.toggleLike(post.id);
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update
      setLiked(liked);
      setLikesCount(prev => liked ? prev + 1 : prev - 1);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'LinkedIn Post',
          text: post.content,
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="professional-card hover-lift">
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="avatar-professional w-12 h-12 relative">
              <span className="text-lg">
                {post.authorName.charAt(0).toUpperCase()}
              </span>
              <div className="status-online absolute -bottom-1 -right-1"></div>
            </div>
            <div>
              <h3 className="text-professional-primary hover:text-blue-600 cursor-pointer transition-colors">
                {post.authorName}
              </h3>
              <p className="text-professional-muted">Software Engineer • 1st</p>
              <div className="flex items-center space-x-1 text-professional-muted">
                <Clock size={12} />
                <span>{formatDate(post.createdAt)}</span>
                <span>•</span>
                <span>🌍</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
              <MoreHorizontal size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Post Content */}
        <div className="text-professional-secondary leading-relaxed mb-4">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <div className="mb-4 -mx-6">
            <div className="grid grid-cols-1 gap-0">
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Post content"
                  className="w-full object-cover max-h-96 hover:scale-105 transition-transform duration-500 cursor-pointer"
                />
              ))}
            </div>
          </div>
        )}

        {/* Engagement Stats */}
        {(likesCount > 0 || commentsCount > 0) && (
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 mb-4">
            <div className="flex items-center space-x-4">
              {likesCount > 0 && (
                <button className="flex items-center space-x-1 text-professional-muted hover:text-blue-600 transition-colors">
                  <div className="flex -space-x-1">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                      👍
                    </div>
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                      ❤️
                    </div>
                  </div>
                  <span className="text-sm font-medium">{likesCount}</span>
                </button>
              )}
            </div>
            <div className="flex items-center space-x-4 text-professional-muted">
              {commentsCount > 0 && (
                <button
                  onClick={toggleComments}
                  className="text-sm hover:text-blue-600 transition-colors"
                >
                  {commentsCount} comment{commentsCount !== 1 ? 's' : ''}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 flex-1 justify-center ${
              liked
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 font-medium'
                : 'text-professional-muted hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600'
            }`}
          >
            <Heart size={20} className={liked ? 'fill-current' : ''} />
            <span>Like</span>
          </button>

          <button
            onClick={toggleComments}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-professional-muted hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 transition-all duration-200 flex-1 justify-center"
          >
            <MessageCircle size={20} />
            <span>Comment</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-professional-muted hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-blue-600 transition-all duration-200 flex-1 justify-center"
          >
            <Share2 size={20} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 dark:border-gray-700 p-6">
          <div className="text-center text-professional-muted">
            <MessageCircle size={24} className="mx-auto mb-2 opacity-50" />
            <p>Comments will appear here</p>
            <p className="text-sm">Comment functionality coming soon!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;