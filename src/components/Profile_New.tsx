import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Mail, Edit3, Save, X, Camera, Plus, Building, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Post } from '../types';
import PostCard from './PostCard';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', bio: '' });

  useEffect(() => {
    if (user) {
      setEditData({ name: user.name, bio: user.bio });
      loadUserPosts();
    }
  }, [user]);

  const loadUserPosts = () => {
    if (!user) return;
    
    try {
      const allPosts = JSON.parse(localStorage.getItem('posts') || '[]') as Post[];
      const userPosts = allPosts.filter(post => post.authorId === user.id);
      setPosts(userPosts);
    } catch (error) {
      console.error('Error loading user posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = () => {
    if (!user) return;
    
    try {
      // Update user data in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: any) => 
        u.id === user.id ? { ...u, name: editData.name, bio: editData.bio } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Update current user data
      const updatedUserData = { ...user, name: editData.name, bio: editData.bio };
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      
      setEditing(false);
      window.location.reload(); // Refresh to update the auth context
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Not logged in</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Cover & Header */}
      <div className="professional-card mb-6 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-48 bg-linkedin-gradient relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-800/20"></div>
          <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
            <Camera size={20} />
          </button>
        </div>
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6">
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <div className="avatar-professional w-32 h-32 border-4 border-white shadow-lg">
                <span className="text-4xl">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <div className="status-online absolute -bottom-2 -right-2 w-8 h-8"></div>
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-gray-100 hover:bg-gray-50 transition-colors">
                <Camera size={16} className="text-gray-600" />
              </button>
            </div>
            
            <div className="flex-1 md:ml-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  {editing ? (
                    <div className="space-y-3 mb-4">
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="text-2xl font-bold text-professional-primary bg-transparent border-b-2 border-blue-500 focus:outline-none"
                      />
                      <textarea
                        value={editData.bio}
                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                        rows={2}
                        className="w-full text-professional-muted bg-transparent border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        placeholder="Professional headline"
                      />
                    </div>
                  ) : (
                    <div className="mb-4">
                      <h1 className="text-3xl font-bold text-professional-primary mb-2">{user.name}</h1>
                      <p className="text-xl text-professional-secondary mb-1">Senior Software Engineer</p>
                      <p className="text-professional-muted">{user.bio || 'Professional bio not set'}</p>
                      <div className="flex items-center space-x-4 mt-3 text-professional-muted">
                        <div className="flex items-center space-x-1">
                          <MapPin size={16} />
                          <span>San Francisco, CA</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Building size={16} />
                          <span>Tech Corp</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-blue-600">500+ connections</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  {editing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <Save size={16} />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setEditData({ name: user.name, bio: user.bio });
                        }}
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <X size={16} />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn-secondary">Message</button>
                      <button className="btn-primary">Connect</button>
                      <button
                        onClick={() => setEditing(true)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Edit3 size={20} className="text-gray-600" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3 mt-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  <span>Open to work</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                  <Plus size={16} />
                  <span>Add section</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="professional-card mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-professional-primary">About</h2>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Edit3 size={18} className="text-gray-600" />
            </button>
          </div>
          <p className="text-professional-secondary leading-relaxed">
            Passionate software engineer with 5+ years of experience building scalable web applications. 
            Expertise in React, Node.js, and cloud technologies. Always eager to learn new technologies 
            and contribute to innovative projects that make a difference.
          </p>
        </div>
      </div>

      {/* Experience Section */}
      <div className="professional-card mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-professional-primary">Experience</h2>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Plus size={18} className="text-gray-600" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-professional-primary">Senior Software Engineer</h3>
                <p className="text-professional-secondary">Tech Corp • Full-time</p>
                <p className="text-professional-muted text-sm">Jan 2022 - Present • 2 yrs 11 mos</p>
                <p className="text-professional-muted text-sm">San Francisco, CA</p>
                <p className="text-professional-secondary mt-2">
                  Leading a team of 5 developers in building modern web applications. Increased system performance by 40% 
                  and reduced deployment time by 60% through implementing CI/CD pipelines.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building size={24} className="text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-professional-primary">Software Engineer</h3>
                <p className="text-professional-secondary">StartupXYZ • Full-time</p>
                <p className="text-professional-muted text-sm">Jun 2020 - Dec 2021 • 1 yr 7 mos</p>
                <p className="text-professional-muted text-sm">Remote</p>
                <p className="text-professional-secondary mt-2">
                  Developed and maintained React applications serving 100k+ users. Collaborated with cross-functional 
                  teams to deliver features that increased user engagement by 25%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="professional-card mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-professional-primary">Education</h2>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Plus size={18} className="text-gray-600" />
            </button>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap size={24} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-professional-primary">Bachelor of Science in Computer Science</h3>
              <p className="text-professional-secondary">University of Technology</p>
              <p className="text-professional-muted text-sm">2016 - 2020</p>
              <p className="text-professional-secondary mt-2">
                Graduated Summa Cum Laude with focus on Software Engineering and Algorithms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="professional-card mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-professional-primary">Skills</h2>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Plus size={18} className="text-gray-600" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL', 'Git'].map((skill) => (
              <div key={skill} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-medium text-professional-secondary">{skill}</span>
                <button className="text-blue-600 hover:text-blue-700">
                  <Plus size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="professional-card mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-professional-primary">Activity</h2>
              <p className="text-professional-muted">{posts.length} posts</p>
            </div>
            <button className="btn-secondary">Create a post</button>
          </div>
          
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-500 text-2xl">📝</span>
              </div>
              <p className="text-professional-muted">No posts yet</p>
              <p className="text-professional-muted text-sm">Start sharing your thoughts with your network!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.slice(0, 3).map((post) => (
                <div key={post.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="text-professional-secondary">{post.content.slice(0, 100)}...</p>
                  <div className="flex items-center space-x-4 mt-2 text-professional-muted text-sm">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {posts.length > 3 && (
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  See all activity →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
