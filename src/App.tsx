import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import Feed from './components/Feed';
import Profile from './components/Profile';
import Connections from './components/Connections';
import Jobs from './components/Jobs';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'feed' | 'profile' | 'connections' | 'jobs' | 'auth'>('feed');

  useEffect(() => {
    // Initialize demo user if no users exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      const sampleUser = {
        id: 'sample-user',
        name: 'John Smith',
        email: 'john@example.com',
        password: 'password123',
        bio: 'Welcome to Professional Network! Advanced networking platform for connecting with industry peers.',
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('users', JSON.stringify([sampleUser]));
      
      // Add some sample posts
      const samplePosts = [
        {
          id: 'sample-post-2',
          content: 'Building amazing web applications with React and TypeScript! The developer experience keeps getting better every day. 🚀',
          authorId: 'sample-user',
          authorName: 'John Smith',
          createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
        },
        {
          id: 'sample-post-1',
          content: 'Just joined Professional Network! Excited to connect with fellow developers and share insights about modern web development. Looking forward to engaging discussions! 💻✨',
          authorId: 'sample-user',
          authorName: 'John Smith',
          createdAt: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
        }
      ];
      localStorage.setItem('posts', JSON.stringify(samplePosts));
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onSuccess={() => setCurrentView('feed')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors">
      {user ? (
        <>
          <Navbar currentView={currentView} onViewChange={setCurrentView} />
          <main className="pt-4">
            {currentView === 'feed' && <Feed />}
            {currentView === 'profile' && <Profile />}
            {currentView === 'connections' && <Connections />}
            {currentView === 'jobs' && <Jobs />}
          </main>
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <AuthForm onSuccess={() => setCurrentView('feed')} />
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;