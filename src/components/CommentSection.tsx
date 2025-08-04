import React, { useState, useEffect } from 'react';import { Send } from 'lucide-react';import { useAuth } from '../contexts/AuthContext';import { Comment } from '../types';interface CommentSectionProps {  postId: string;  onCommentCountChange: (count: number) => void;}const CommentSection: React.FC<CommentSectionProps> = ({ postId, onCommentCountChange }) => {  const [comments, setComments] = useState<Comment[]>([]);  const [newComment, setNewComment] = useState('');  const [loading, setLoading] = useState(false);  const { user } = useAuth();

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = () => {
    try {
      const storedComments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]') as Comment[];
      setComments(storedComments);
      onCommentCountChange(storedComments.length);
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setLoading(true);

    try {
      const comment: Comment = {
        id: Date.now().toString(),
        content: newComment.trim(),
        author: {
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          headline: user.headline,
          location: user.location,
          profilePicture: user.profilePicture,
          bannerImage: '',
          website: '',
          connections: user.connections || 0,
          followers: user.followers || 0,
          following: user.following || 0,
          createdAt: new Date().toISOString()
        },
        post: postId,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedComments = [...comments, comment];
      setComments(updatedComments);
      localStorage.setItem(`comments_${postId}`, JSON.stringify(updatedComments));
      onCommentCountChange(updatedComments.length);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="border-t border-gray-100 bg-gray-50">
      {/* Comments List */}
      {comments.length > 0 && (
        <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-3">
              <div className="avatar-professional w-8 h-8 flex-shrink-0">
                <span className="text-sm">
                  {comment.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-professional-primary text-sm">
                      {comment.author.name}
                    </span>
                    <span className="text-professional-muted text-xs">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-professional-secondary text-sm leading-relaxed">
                    {comment.content}
                  </p>
                </div>
                <div className="flex items-center space-x-4 mt-2 px-3">
                  <button className="text-professional-muted hover:text-blue-600 transition-colors text-xs">
                    Like
                  </button>
                  <button className="text-professional-muted hover:text-blue-600 transition-colors text-xs">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment */}
      <div className="px-6 py-4">
        <form onSubmit={handleSubmitComment}>
          <div className="flex items-start space-x-3">
            <div className="avatar-professional w-8 h-8 flex-shrink-0">
              <span className="text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-4 py-2 pr-12 bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || loading}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors ${
                    newComment.trim() && !loading
                      ? 'text-blue-600 hover:bg-blue-50'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentSection;
