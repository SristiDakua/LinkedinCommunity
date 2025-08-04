export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  headline?: string;
  location?: string;
  profilePicture?: string;
  bannerImage?: string;
  website?: string;
  connections: number;
  followers: number;
  following: number;
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  likes: number;
  comments: number;
  shares: number;
  images?: string[];
  type: 'text' | 'image' | 'video' | 'document';
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  bio: string;
  headline?: string;
  location?: string;
  profilePicture?: string;
  connections: number;
  followers: number;
  following: number;
}

export interface Connection {
  id: string;
  requester: User;
  recipient: User;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  createdAt: string;
}

export interface Like {
  id: string;
  user: User;
  post: string;
  type: 'like' | 'love' | 'insightful' | 'celebrate' | 'support' | 'funny';
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  post: string;
  parentComment?: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
}