import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types';
import { apiService } from '../services/api';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, bio: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token and get current user
    const token = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');
    
    if (token) {
      // Set token in API service
      apiService.setToken(token);
      
      // If we have stored user data, use it immediately
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          setUser({
            id: userData.id || 'local-user',
            name: userData.name || 'User',
            email: userData.email || 'user@example.com',
            bio: userData.bio || 'Welcome to Professional Network!',
            headline: userData.headline || '',
            location: userData.location || '',
            profilePicture: userData.profilePicture || '',
            connections: userData.connections || 0,
            followers: userData.followers || 0,
            following: userData.following || 0
          });
          setLoading(false);
          return;
        } catch (parseError) {
          console.error('Error parsing stored user data:', parseError);
        }
      }
      
      // Try to get fresh user data from API
      apiService.getMe()
        .then((response: any) => {
          if (response.success && response.user) {
            const apiUser = response.user || response.data?.user;
            const userData = {
              id: apiUser.id,
              name: apiUser.name,
              email: apiUser.email,
              bio: apiUser.bio,
              headline: apiUser.headline || '',
              location: apiUser.location || '',
              profilePicture: apiUser.profilePicture || '',
              connections: apiUser.connections || 0,
              followers: apiUser.followers || 0,
              following: apiUser.following || 0
            };
            setUser(userData);
            // Update stored user data
            localStorage.setItem('userData', JSON.stringify(userData));
          } else {
            // Invalid token, clear auth data
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
          }
        })
        .catch((error: any) => {
          console.error('Error fetching current user:', error);
          // Keep the stored user data if API fails
          if (!storedUserData) {
            localStorage.removeItem('authToken');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login(email, password);
      
      if (response.success && response.token && response.user) {
        localStorage.setItem('authToken', response.token);
        apiService.setToken(response.token);
        
        const user = response.user as any;
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          headline: user.headline || '',
          location: user.location || '',
          profilePicture: user.profilePicture || '',
          connections: user.connections || 0,
          followers: user.followers || 0,
          following: user.following || 0
        };
        
        setUser(userData);
        // Store user data for persistence
        localStorage.setItem('userData', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, bio: string): Promise<boolean> => {
    try {
      const response = await apiService.register(name, email, password, bio);
      
      if (response.success && response.token && response.user) {
        localStorage.setItem('authToken', response.token);
        apiService.setToken(response.token);
        
        const user = response.user as any;
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          headline: user.headline || '',
          location: user.location || '',
          profilePicture: user.profilePicture || '',
          connections: user.connections || 0,
          followers: user.followers || 0,
          following: user.following || 0
        };
        
        setUser(userData);
        // Store user data for persistence
        localStorage.setItem('userData', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    apiService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};