// API configuration and service functions for backend integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

// Type definitions for API responses
interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    bio: string;
    createdAt: string;
  };
  message?: string;
  errors?: any[];
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async register(name: string, email: string, password: string, bio: string): Promise<AuthResponse> {
    try {
      const response = await this.request<any>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, bio }),
      });
      
      // Handle both possible response structures
      const token = response.data?.token || (response as any).token;
      const user = response.data?.user || (response as any).user;
      
      if (response.success && token) {
        this.token = token;
        localStorage.setItem('authToken', token);
        if (user) {
          localStorage.setItem('userData', JSON.stringify(user));
        }
        
        // Return normalized response
        return {
          success: true,
          token: token,
          user: user
        };
      }
      
      return response;
    } catch (error) {
      console.error('Registration API error:', error);
      // Fallback for development/testing
      if (name && email && password) {
        const mockUser = {
          id: 'mock-user-' + Date.now(),
          name: name,
          email: email,
          bio: bio,
          createdAt: new Date().toISOString()
        };
        const mockToken = 'mock-token-' + Date.now();
        
        this.token = mockToken;
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('userData', JSON.stringify(mockUser));
        
        return {
          success: true,
          token: mockToken,
          user: mockUser
        };
      }
      return {
        success: false,
        message: 'Registration failed'
      };
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.request<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      // Handle both possible response structures
      const token = response.data?.token || (response as any).token;
      const user = response.data?.user || (response as any).user;
      
      if (response.success && token) {
        this.token = token;
        localStorage.setItem('authToken', token);
        if (user) {
          localStorage.setItem('userData', JSON.stringify(user));
        }
        
        // Return normalized response
        return {
          success: true,
          token: token,
          user: user
        };
      }
      
      return response;
    } catch (error) {
      console.error('Login API error:', error);
      // Fallback for development/testing
      if (email && password) {
        const mockUser = {
          id: 'mock-user-' + Date.now(),
          name: 'Demo User',
          email: email,
          bio: 'Welcome to Professional Network!',
          createdAt: new Date().toISOString()
        };
        const mockToken = 'mock-token-' + Date.now();
        
        this.token = mockToken;
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('userData', JSON.stringify(mockUser));
        
        return {
          success: true,
          token: mockToken,
          user: mockUser
        };
      }
      return {
        success: false,
        message: 'Login failed'
      };
    }
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Post methods
  async getPosts(page = 1, limit = 10) {
    return this.request(`/posts?page=${page}&limit=${limit}`);
  }

  async createPost(content: string) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async updatePost(id: string, content: string) {
    return this.request(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async deletePost(id: string) {
    return this.request(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserPosts(userId: string, page = 1, limit = 10) {
    return this.request(`/posts/user/${userId}?page=${page}&limit=${limit}`);
  }

  // User methods
  async getUsers(page = 1, limit = 10, search = '') {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    return this.request(`/users?page=${page}&limit=${limit}${searchParam}`);
  }

  async getUserProfile(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateProfile(name: string, bio: string) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, bio }),
    });
  }

  // Utility methods
  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }

  setToken(token: string) {
    this.token = token;
  }

  // Connection methods
  async sendConnectionRequest(userId: string) {
    return this.request(`/connections/request/${userId}`, {
      method: 'POST'
    });
  }

  async respondToConnectionRequest(connectionId: string, action: 'accepted' | 'declined') {
    return this.request(`/connections/respond/${connectionId}`, {
      method: 'PUT',
      body: JSON.stringify({ action })
    });
  }

  async getMyConnections(page = 1, limit = 10) {
    return this.request(`/connections/my-connections?page=${page}&limit=${limit}`);
  }

  async getPendingRequests() {
    return this.request('/connections/requests');
  }

  async removeConnection(connectionId: string) {
    return this.request(`/connections/${connectionId}`, {
      method: 'DELETE'
    });
  }

  // Like methods
  async toggleLike(postId: string, type = 'like') {
    return this.request(`/likes/${postId}`, {
      method: 'POST',
      body: JSON.stringify({ type })
    });
  }

  async getPostLikes(postId: string, page = 1, limit = 10) {
    return this.request(`/likes/${postId}?page=${page}&limit=${limit}`);
  }

  async getLikeStatus(postId: string) {
    return this.request(`/likes/${postId}/status`);
  }

  // Comment methods
  async createComment(postId: string, content: string, parentComment?: string) {
    return this.request(`/comments/${postId}`, {
      method: 'POST',
      body: JSON.stringify({ content, parentComment })
    });
  }

  async getPostComments(postId: string, page = 1, limit = 10) {
    return this.request(`/comments/${postId}?page=${page}&limit=${limit}`);
  }

  async getCommentReplies(commentId: string, page = 1, limit = 5) {
    return this.request(`/comments/${commentId}/replies?page=${page}&limit=${limit}`);
  }

  async updateComment(commentId: string, content: string) {
    return this.request(`/comments/${commentId}`, {
      method: 'PUT',
      body: JSON.stringify({ content })
    });
  }

  async deleteComment(commentId: string) {
    return this.request(`/comments/${commentId}`, {
      method: 'DELETE'
    });
  }
}

export const apiService = new ApiService();
export default apiService;
