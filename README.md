# Professional Network - LinkedIn-Style Community Platform

A modern, full-stack professional networking platform built with React, TypeScript, Node.js, Express, and MongoDB. This application provides comprehensive social networking features similar to LinkedIn.

## 🚀 Live Demo

**GitHub Repository**: [https://github.com/SristiDakua/LinkedinCommunity](https://github.com/SristiDakua/LinkedinCommunity)

[View Live Application](https://your-vercel-deployment-url.vercel.app) *(Deploy from GitHub to get live URL)*

## ✨ Features

### 🔐 Authentication System
- **User Registration**: Create accounts with name, email, password, and bio
- **Secure Login**: JWT-based authentication with httpOnly cookies
- **Password Hashing**: bcrypt for secure password storage
- **Protected Routes**: Authenticated access to app features
- **Token Validation**: Middleware-protected API endpoints

### 📝 Social Features
- **Create Posts**: Share text-based posts with the community (500 char limit)
- **Post Feed**: View all posts with pagination support
- **Real-time Updates**: Instantly see new posts after creation
- **Post Management**: Edit and delete your own posts
- **User Posts**: View all posts from specific users

### 👤 User Profiles
- **Personal Profiles**: View and edit user information and bio
- **Profile Management**: Update name and bio with validation
- **User Discovery**: Browse and search for other users
- **Public Profiles**: View other users' profiles and posts

### 🎨 Design Features
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Professional UI**: LinkedIn-inspired clean and modern interface
- **Smooth Animations**: Hover effects and transitions throughout
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Comprehensive form validation and error messages

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **CORS** and **Helmet** for security
- **Rate limiting** for API protection

### Deployment
- **Frontend**: Vercel (recommended)
- **Backend**: Render or Railway
- **Database**: MongoDB Atlas
- **Repository**: GitHub

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local installation or MongoDB Atlas)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your values:
   ```env
   MONGODB_URI=mongodb://localhost:27017/professionalnetwork
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   PORT=3001
   CLIENT_URL=http://localhost:5173
   ```

4. **Start MongoDB** (if using local installation)
   ```bash
   mongod
   ```

5. **Seed the database** (optional - creates demo data)
   ```bash
   npm run seed
   ```

6. **Start backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to root directory**
   ```bash
   cd ..
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Credentials
After running the seed script, use these credentials:
- **Email**: `demo@example.com` | **Password**: `demo123`
- **Email**: `jane@example.com` | **Password**: `jane123`
- **Email**: `john@example.com` | **Password**: `john123`

## 📁 Project Structure

```
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   │   ├── authController.ts    # Authentication logic
│   │   │   ├── postController.ts    # Post CRUD operations
│   │   │   └── userController.ts    # User profile management
│   │   ├── middleware/      # Custom middleware
│   │   │   └── auth.ts      # JWT authentication middleware
│   │   ├── models/          # Mongoose schemas
│   │   │   ├── User.ts      # User model with password hashing
│   │   │   └── Post.ts      # Post model with author reference
│   │   ├── routes/          # Express route definitions
│   │   │   ├── auth.ts      # Auth routes (/register, /login)
│   │   │   ├── posts.ts     # Post routes (CRUD operations)
│   │   │   └── users.ts     # User routes (profiles, search)
│   │   ├── scripts/         # Utility scripts
│   │   │   └── seed.ts      # Database seeding script
│   │   ├── utils/           # Helper functions
│   │   │   ├── database.ts  # MongoDB connection setup
│   │   │   └── errors.ts    # Error handling utilities
│   │   └── server.ts        # Express app configuration
│   ├── .env.example         # Environment variables template
│   ├── package.json         # Backend dependencies
│   └── tsconfig.json        # TypeScript configuration
├── src/                     # React frontend
│   ├── components/          # React components
│   │   ├── AuthForm.tsx     # Login/Register form
│   │   ├── CreatePost.tsx   # Post creation component
│   │   ├── Feed.tsx         # Main feed display
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── PostCard.tsx     # Individual post display
│   │   └── Profile.tsx      # User profile page
│   ├── contexts/            # React Context providers
│   │   └── AuthContext.tsx  # Authentication context
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # App-wide type definitions
│   ├── App.tsx              # Main application component
│   └── main.tsx            # Application entry point
├── package.json             # Frontend dependencies
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md               # Project documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Posts
- `GET /api/posts` - Get all posts with pagination
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (protected)
- `PUT /api/posts/:id` - Update post (protected, owner only)
- `DELETE /api/posts/:id` - Delete post (protected, owner only)
- `GET /api/posts/user/:userId` - Get user's posts

### Users
- `GET /api/users` - Get all users with search
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile (protected)

### Health Check
- `GET /api/health` - Server health status

## 🔧 Database Schema

### User Model
```typescript
{
  name: string (required, 2-50 chars)
  email: string (required, unique, valid email)
  password: string (required, min 6 chars, hashed)
  bio: string (required, 10-500 chars)
  createdAt: Date
  updatedAt: Date
}
```

### Post Model
```typescript
{
  content: string (required, 1-500 chars)
  author: ObjectId (ref: User, required)
  createdAt: Date
  updatedAt: Date
}
```

## 🔧 Key Features Implementation

### Authentication Flow
- User registration with validation
- Secure login with error handling
- JWT token-based authentication
- Password hashing with bcrypt
- Protected route access

### Data Management
- MongoDB database with Mongoose ODM
- Context API for global state management
- Real-time data updates across components
- Input validation and sanitization

### Security Features
- Rate limiting for API protection
- CORS configuration
- Helmet for security headers
- JWT middleware for protected routes
- Input validation with express-validator

### Responsive Design
- Mobile-first approach
- Tailwind CSS utility classes
- Smooth animations and transitions
- Professional color scheme

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. **Create account on Render or Railway**

2. **Connect your GitHub repository**

3. **Set environment variables:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/professionalnetwork
   JWT_SECRET=your-production-jwt-secret
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   CLIENT_URL_PROD=https://your-frontend-url.vercel.app
   ```

4. **Build settings:**
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Root Directory: `/`

### Frontend Deployment (Vercel)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npx vercel --prod
   ```

3. **Environment variables** (if connecting to real backend):
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

### Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas account**
2. **Create a new cluster**
3. **Set up database user and network access**
4. **Get connection string and update environment variables**
5. **Run seed script on production database** (optional)

## 🔮 Future Enhancements

- **Image Support**: Add photo uploads for posts and profiles
- **Real-time Chat**: WebSocket-based messaging system
- **Advanced Features**: Post reactions, comments, connections
- **Search**: Enhanced user and post search functionality
- **Notifications**: Real-time notification system
- **Mobile App**: React Native implementation

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
