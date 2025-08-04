import React, { useState, useEffect } from 'react';
import { MapPin, Edit3, Save, X, Camera, Plus, GraduationCap, Phone, Mail, Globe, MessageCircle, UserPlus, Briefcase, Trash2, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Post } from '../types';

interface Experience {
  id: string;
  title: string;
  company: string;
  type: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
  grade?: string;
  activities?: string;
}

interface ContactInfo {
  phone: string;
  email: string;
  website: string;
  address: string;
}

interface UserProfile {
  about: string;
  headline: string;
  location: string;
  contactInfo: ContactInfo;
  experiences: Experience[];
  education: Education[];
  skills: string[];
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  
  // Profile data state
  const [profile, setProfile] = useState<UserProfile>({
    about: '',
    headline: '',
    location: '',
    contactInfo: {
      phone: '',
      email: user?.email || '',
      website: '',
      address: ''
    },
    experiences: [],
    education: [],
    skills: []
  });

  // Edit forms state
  const [editForms, setEditForms] = useState({
    basic: { name: '', headline: '', location: '' },
    about: '',
    contact: { phone: '', email: '', website: '', address: '' },
    newExperience: {
      title: '', company: '', type: 'Full-time', startDate: '', endDate: '', 
      current: false, location: '', description: ''
    },
    newEducation: {
      institution: '', degree: '', field: '', startDate: '', endDate: '', description: '',
      grade: '', activities: '', startYear: '', endYear: ''
    }
  });

  // Separate state for new skill
  const [newSkill, setNewSkill] = useState('');

  // Modal states
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showAddSectionMenu, setShowAddSectionMenu] = useState(false);

  // Event handlers
  const handleConnect = () => {
    alert('Connection request sent! In a full app, this would send a connection request.');
  };

  const handleMessage = () => {
    alert('Message feature! In a full app, this would open the messaging interface.');
  };

  const handleCreatePost = () => {
    if (!user) return;
    
    const postContent = prompt('What\'s on your mind?');
    if (postContent && postContent.trim()) {
      const newPost: Post = {
        id: Date.now().toString(),
        content: postContent.trim(),
        authorId: user.id,
        authorName: user.name,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
        type: 'text'
      };
      setPosts(prev => [newPost, ...prev]);
      alert('Post created successfully!');
    }
  };

  const handleAddDetails = () => {
    setShowAddSectionMenu(!showAddSectionMenu);
  };

  const addSectionOptions = [
    { 
      label: 'Add Experience', 
      icon: '💼',
      description: 'Share your work experience and achievements',
      action: () => {
        setShowAddExperience(true);
        setShowAddSectionMenu(false);
      }
    },
    { 
      label: 'Add Education', 
      icon: '🎓',
      description: 'Add your educational background and qualifications',
      action: () => {
        setShowAddEducation(true);
        setShowAddSectionMenu(false);
      }
    },
    { 
      label: 'Add Skills', 
      icon: '⚡',
      description: 'Showcase your skills and expertise',
      action: () => {
        setShowAddSkill(true);
        setShowAddSectionMenu(false);
      }
    },
    { 
      label: 'Edit Contact Info', 
      icon: '📞',
      description: 'Update your contact information and social links',
      action: () => {
        setShowContactInfo(true);
        setShowAddSectionMenu(false);
      }
    },
    { 
      label: 'Add Certifications', 
      icon: '🏆',
      description: 'Display your professional certifications',
      action: () => {
        alert('Certifications feature coming soon!');
        setShowAddSectionMenu(false);
      }
    },
    { 
      label: 'Add Projects', 
      icon: '🚀',
      description: 'Showcase your personal and professional projects',
      action: () => {
        alert('Projects feature coming soon!');
        setShowAddSectionMenu(false);
      }
    },
    { 
      label: 'Add Languages', 
      icon: '🌍',
      description: 'Add languages you speak and proficiency levels',
      action: () => {
        alert('Languages feature coming soon!');
        setShowAddSectionMenu(false);
      }
    },
    { 
      label: 'Add Volunteer Experience', 
      icon: '❤️',
      description: 'Share your volunteer work and community involvement',
      action: () => {
        alert('Volunteer Experience feature coming soon!');
        setShowAddSectionMenu(false);
      }
    }
  ];

  const handleSaveAbout = () => {
    const updatedProfile = { ...profile, about: editForms.about };
    setProfile(updatedProfile);
    saveProfileData(updatedProfile);
    setEditing(null);
  };

  // Load profile data
  useEffect(() => {
    if (user) {
      loadProfileData();
      loadUserPosts();
    }
  }, [user]);

  // Handle clicking outside add section dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.add-section-dropdown')) {
        setShowAddSectionMenu(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowAddSectionMenu(false);
      }
    };

    if (showAddSectionMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [showAddSectionMenu]);

  const loadProfileData = () => {
    if (!user) return;
    
    const savedProfile = localStorage.getItem(`profile_${user.id}`);
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      setEditForms(prev => ({
        ...prev,
        basic: { 
          name: user.name, 
          headline: parsedProfile.headline, 
          location: parsedProfile.location 
        },
        about: parsedProfile.about,
        contact: parsedProfile.contactInfo
      }));
    } else {
      // Initialize with default data
      const defaultProfile: UserProfile = {
        about: user.bio || '',
        headline: 'Software Engineer',
        location: 'San Francisco, CA',
        contactInfo: {
          phone: '',
          email: user.email,
          website: '',
          address: ''
        },
        experiences: [
          {
            id: '1',
            title: 'Senior Software Engineer',
            company: 'Tech Corp',
            type: 'Full-time',
            startDate: '2022-01',
            endDate: '',
            current: true,
            location: 'San Francisco, CA',
            description: 'Leading a team of developers in building modern web applications.'
          }
        ],
        education: [
          {
            id: '1',
            institution: 'University of Technology',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: '2016',
            endDate: '2020',
            description: 'Graduated Summa Cum Laude with focus on Software Engineering.'
          }
        ],
        skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker']
      };
      setProfile(defaultProfile);
      saveProfileData(defaultProfile);
    }
  };

  const saveProfileData = (profileData: UserProfile) => {
    if (!user) return;
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(profileData));
  };

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

  // Event handlers
  const handleSaveBasicInfo = () => {
    if (!user) return;
    
    const updatedProfile = {
      ...profile,
      headline: editForms.basic.headline,
      location: editForms.basic.location
    };
    setProfile(updatedProfile);
    saveProfileData(updatedProfile);
    setEditing(null);
  };

  const handleSaveContact = () => {
    const updatedProfile = { ...profile, contactInfo: editForms.contact };
    setProfile(updatedProfile);
    saveProfileData(updatedProfile);
    setShowContactInfo(false);
  };

  const handleAddExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      ...editForms.newExperience
    };
    const updatedProfile = {
      ...profile,
      experiences: [...profile.experiences, newExp]
    };
    setProfile(updatedProfile);
    saveProfileData(updatedProfile);
    setShowAddExperience(false);
    setEditForms(prev => ({
      ...prev,
      newExperience: {
        title: '', company: '', type: 'Full-time', startDate: '', endDate: '', 
        current: false, location: '', description: ''
      }
    }));
  };

  const handleAddEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      ...editForms.newEducation
    };
    const updatedProfile = {
      ...profile,
      education: [...profile.education, newEdu]
    };
    setProfile(updatedProfile);
    saveProfileData(updatedProfile);
    setShowAddEducation(false);
    setEditForms(prev => ({
      ...prev,
      newEducation: {
        institution: '', degree: '', field: '', startDate: '', endDate: '', description: '',
        grade: '', activities: '', startYear: '', endYear: ''
      }
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const updatedProfile = {
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      };
      setProfile(updatedProfile);
      saveProfileData(updatedProfile);
      setNewSkill('');
      setShowAddSkill(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedProfile = {
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    };
    setProfile(updatedProfile);
    saveProfileData(updatedProfile);
  };

  const handleRemoveExperience = (expId: string) => {
    const updatedProfile = {
      ...profile,
      experiences: profile.experiences.filter(exp => exp.id !== expId)
    };
    setProfile(updatedProfile);
    saveProfileData(updatedProfile);
  };

  const handleRemoveEducation = (eduId: string) => {
    const updatedProfile = {
      ...profile,
      education: profile.education.filter(edu => edu.id !== eduId)
    };
    setProfile(updatedProfile);
    saveProfileData(updatedProfile);
  };

  if (!user) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Not logged in</h2>
          <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
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
      <div className="professional-card mb-6">
        {/* Cover Photo */}
        <div className="h-48 bg-linkedin-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-800/20"></div>
          <button 
            onClick={() => console.log('Cover photo upload')}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          >
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
              <button 
                onClick={() => console.log('Profile photo upload')}
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <Camera size={16} className="text-gray-600" />
              </button>
            </div>
            
            <div className="flex-1 md:ml-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  {editing === 'basic' ? (
                    <div className="space-y-3 mb-4">
                      <input
                        type="text"
                        value={editForms.basic.name}
                        onChange={(e) => setEditForms(prev => ({
                          ...prev,
                          basic: { ...prev.basic, name: e.target.value }
                        }))}
                        className="text-2xl font-bold text-gray-900 dark:text-gray-100 bg-transparent border-b-2 border-blue-500 focus:outline-none dark:bg-gray-800"
                        placeholder="Your name"
                      />
                      <input
                        type="text"
                        value={editForms.basic.headline}
                        onChange={(e) => setEditForms(prev => ({
                          ...prev,
                          basic: { ...prev.basic, headline: e.target.value }
                        }))}
                        className="w-full text-lg text-gray-700 dark:text-gray-300 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                        placeholder="Professional headline"
                      />
                      <input
                        type="text"
                        value={editForms.basic.location}
                        onChange={(e) => setEditForms(prev => ({
                          ...prev,
                          basic: { ...prev.basic, location: e.target.value }
                        }))}
                        className="w-full text-gray-600 dark:text-gray-400 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
                        placeholder="Location"
                      />
                    </div>
                  ) : (
                    <div className="mb-4">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{user.name}</h1>
                      <p className="text-xl text-gray-700 dark:text-gray-300 mb-1">{profile.headline}</p>
                      <div className="flex items-center space-x-4 mt-3 text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <MapPin size={16} />
                          <span>{profile.location}</span>
                        </div>
                        <button
                          onClick={() => setShowContactInfo(true)}
                          className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          <Mail size={16} />
                          <span>Contact info</span>
                        </button>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium text-blue-600 dark:text-blue-400">{user.connections || 500}+ connections</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-3">
                  {editing === 'basic' ? (
                    <>
                      <button
                        onClick={handleSaveBasicInfo}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-colors flex items-center space-x-2"
                      >
                        <Save size={16} />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditing(null);
                          setEditForms(prev => ({
                            ...prev,
                            basic: { 
                              name: user.name, 
                              headline: profile.headline, 
                              location: profile.location 
                            }
                          }));
                        }}
                        className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full font-medium transition-colors flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <X size={16} />
                        <span>Cancel</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={handleMessage}
                        className="border border-blue-600 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full font-medium transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center space-x-2"
                      >
                        <MessageCircle size={16} />
                        <span>Message</span>
                      </button>
                      <button 
                        onClick={handleConnect}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-colors flex items-center space-x-2"
                      >
                        <UserPlus size={16} />
                        <span>Connect</span>
                      </button>
                      <button
                        onClick={() => setEditing('basic')}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Edit3 size={20} className="text-gray-600 dark:text-gray-400" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3 mt-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
                  <span>Open to work</span>
                </button>
                
                {/* Add Section Dropdown */}
                <div className="relative add-section-dropdown">
                  <button 
                    onClick={handleAddDetails}
                    className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      showAddSectionMenu ? 'bg-gray-50 dark:bg-gray-700' : ''
                    }`}
                  >
                    <Plus size={16} />
                    <span>Add section</span>
                    <ChevronDown size={16} className={`transform transition-transform ${showAddSectionMenu ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showAddSectionMenu && (
                    <div className="dropdown-menu z-[9999] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 sticky top-0">
                          <div className="flex items-center space-x-2">
                            <Plus size={16} className="text-blue-500" />
                            <span>Add to profile</span>
                          </div>
                        </div>
                        <div className="p-2 space-y-1">
                          {addSectionOptions.map((option, index) => (
                            <button
                              key={index}
                              onClick={option.action}
                              className="w-full flex items-start space-x-3 px-3 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 group border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                            >
                              <span className="text-2xl flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">{option.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {option.label}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                                  {option.description}
                                </div>
                              </div>
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <ChevronDown size={12} className="text-gray-600 dark:text-gray-300 rotate-[-90deg]" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="professional-card mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">About</h2>
            <button 
              onClick={() => setEditing('about')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Edit3 size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          {editing === 'about' ? (
            <div className="space-y-4">
              <textarea
                value={editForms.about}
                onChange={(e) => setEditForms(prev => ({ ...prev, about: e.target.value }))}
                rows={6}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none dark:bg-gray-800 dark:text-gray-100"
                placeholder="Write about yourself..."
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveAbout}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(null);
                    setEditForms(prev => ({ ...prev, about: profile.about }));
                  }}
                  className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {profile.about || 'Add information about yourself to help others understand your background and experience.'}
            </p>
          )}
        </div>
      </div>

      {/* Experience Section */}
      <div className="professional-card mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Experience</h2>
            <button 
              onClick={() => setShowAddExperience(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Plus size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="space-y-6">
            {profile.experiences.map((exp) => (
              <div key={exp.id} className="flex items-start space-x-4 group">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{exp.title}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{exp.company} • {exp.type}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                        {exp.current ? ' Present' : ` ${new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{exp.location}</p>
                      {exp.description && (
                        <p className="text-gray-700 dark:text-gray-300 mt-2">{exp.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveExperience(exp.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="professional-card mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Education</h2>
            <button 
              onClick={() => setShowAddEducation(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Plus size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="space-y-6">
            {profile.education.map((edu) => (
              <div key={edu.id} className="flex items-start space-x-4 group">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{edu.degree} in {edu.field}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{edu.institution}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{edu.startDate} - {edu.endDate}</p>
                      {edu.description && (
                        <p className="text-gray-700 dark:text-gray-300 mt-2">{edu.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveEducation(edu.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="professional-card mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Skills</h2>
            <button 
              onClick={() => setShowAddSkill(true)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Plus size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {profile.skills.map((skill) => (
              <div key={skill} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group">
                <span className="font-medium text-gray-800 dark:text-gray-200">{skill}</span>
                <button 
                  onClick={() => handleRemoveSkill(skill)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                >
                  <X size={14} className="text-red-500" />
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Activity</h2>
              <p className="text-gray-600 dark:text-gray-400">{posts.length} posts</p>
            </div>
            <button 
              onClick={handleCreatePost}
              className="border border-blue-600 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full font-medium transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              Create a post
            </button>
          </div>
          
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-500 dark:text-blue-400 text-2xl">📝</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">No posts yet</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">Start sharing your thoughts with your network!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.slice(0, 3).map((post) => (
                <div key={post.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="text-gray-700 dark:text-gray-300">{post.content.slice(0, 100)}...</p>
                  <div className="flex items-center space-x-4 mt-2 text-gray-500 dark:text-gray-400 text-sm">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {posts.length > 3 && (
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  See all activity →
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contact Info Modal */}
      {showContactInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contact Info</h3>
                <button
                  onClick={() => setShowContactInfo(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone size={16} className="inline mr-2" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={editForms.contact.phone}
                  onChange={(e) => setEditForms(prev => ({
                    ...prev,
                    contact: { ...prev.contact, phone: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail size={16} className="inline mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={editForms.contact.email}
                  onChange={(e) => setEditForms(prev => ({
                    ...prev,
                    contact: { ...prev.contact, email: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Globe size={16} className="inline mr-2" />
                  Website
                </label>
                <input
                  type="url"
                  value={editForms.contact.website}
                  onChange={(e) => setEditForms(prev => ({
                    ...prev,
                    contact: { ...prev.contact, website: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin size={16} className="inline mr-2" />
                  Address
                </label>
                <input
                  type="text"
                  value={editForms.contact.address}
                  onChange={(e) => setEditForms(prev => ({
                    ...prev,
                    contact: { ...prev.contact, address: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="City, State, Country"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSaveContact}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowContactInfo(false)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Experience Modal */}
      {showAddExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add Experience</h3>
                <button
                  onClick={() => setShowAddExperience(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    value={editForms.newExperience.title}
                    onChange={(e) => setEditForms(prev => ({
                      ...prev,
                      newExperience: { ...prev.newExperience, title: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Ex: Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company *</label>
                  <input
                    type="text"
                    value={editForms.newExperience.company}
                    onChange={(e) => setEditForms(prev => ({
                      ...prev,
                      newExperience: { ...prev.newExperience, company: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Ex: Microsoft"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Employment type</label>
                  <select
                    value={editForms.newExperience.type}
                    onChange={(e) => setEditForms(prev => ({
                      ...prev,
                      newExperience: { ...prev.newExperience, type: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={editForms.newExperience.location}
                    onChange={(e) => setEditForms(prev => ({
                      ...prev,
                      newExperience: { ...prev.newExperience, location: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Ex: San Francisco, CA"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editForms.newExperience.current}
                    onChange={(e) => setEditForms(prev => ({
                      ...prev,
                      newExperience: { ...prev.newExperience, current: e.target.checked }
                    }))}
                    className="mr-2"
                  />
                  <span className="text-gray-700 dark:text-gray-300">I am currently working in this role</span>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start date</label>
                  <input
                    type="month"
                    value={editForms.newExperience.startDate}
                    onChange={(e) => setEditForms(prev => ({
                      ...prev,
                      newExperience: { ...prev.newExperience, startDate: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                {!editForms.newExperience.current && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End date</label>
                    <input
                      type="month"
                      value={editForms.newExperience.endDate}
                      onChange={(e) => setEditForms(prev => ({
                        ...prev,
                        newExperience: { ...prev.newExperience, endDate: e.target.value }
                      }))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  value={editForms.newExperience.description}
                  onChange={(e) => setEditForms(prev => ({
                    ...prev,
                    newExperience: { ...prev.newExperience, description: e.target.value }
                  }))}
                  rows={4}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Describe your role and achievements..."
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleAddExperience}
                  disabled={!editForms.newExperience.title || !editForms.newExperience.company}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAddExperience(false)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Education Modal */}
      {showAddEducation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add Education</h3>
                <button
                  onClick={() => setShowAddEducation(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">School *</label>
                  <input
                    type="text"
                    value={editForms.newEducation.institution}
                    onChange={(e) => setEditForms(prev => ({
                      ...prev,
                      newEducation: { ...prev.newEducation, institution: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Ex: Harvard University"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Degree</label>
                  <input
                    type="text"
                    value={editForms.newEducation.degree}
                    onChange={(e) => setEditForms(prev => ({
                      ...prev,
                      newEducation: { ...prev.newEducation, degree: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="Ex: Bachelor's degree"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Field of study</label>
                <input
                  type="text"
                  value={editForms.newEducation.field}
                  onChange={(e) => setEditForms(prev => ({
                    ...prev,
                    newEducation: { ...prev.newEducation, field: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Ex: Computer Science"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start year</label>
                  <input
                    type="number"
                    value={editForms.newEducation.startYear}
                    onChange={(e) => setEditForms(prev => ({
                      ...prev,
                      newEducation: { ...prev.newEducation, startYear: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="2019"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End year</label>
                  <input
                    type="number"
                    value={editForms.newEducation.endYear}
                    onChange={(e) => setEditForms(prev => ({
                      ...prev,
                      newEducation: { ...prev.newEducation, endYear: e.target.value }
                    }))}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="2023"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grade</label>
                <input
                  type="text"
                  value={editForms.newEducation.grade}
                  onChange={(e) => setEditForms(prev => ({
                    ...prev,
                    newEducation: { ...prev.newEducation, grade: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Ex: 3.8 GPA or First Class"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Activities and societies</label>
                <textarea
                  value={editForms.newEducation.activities}
                  onChange={(e) => setEditForms(prev => ({
                    ...prev,
                    newEducation: { ...prev.newEducation, activities: e.target.value }
                  }))}
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Ex: Computer Science Club, Dean's List"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleAddEducation}
                  disabled={!editForms.newEducation.institution}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowAddEducation(false)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Skill Modal */}
      {showAddSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add Skill</h3>
                <button
                  onClick={() => setShowAddSkill(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skill *</label>
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Ex: JavaScript, Python, Leadership"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSkill();
                    }
                  }}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Add Skill
                </button>
                <button
                  onClick={() => setShowAddSkill(false)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
