import dotenv from 'dotenv';
import { connectDB } from '../utils/database.js';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';

// Load env vars
dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    
    console.log('✅ Cleared existing data');
    
    // Create demo users
    const demoUsers = [
      {
        name: 'Demo User',
        email: 'demo@example.com',
        password: 'demo123',
        bio: 'Welcome to Professional Network! This is a demo account to help you explore the platform.'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'jane123',
        bio: 'Full-stack developer passionate about React and Node.js. Love building scalable web applications.'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'john123',
        bio: 'Product manager with 5+ years of experience. Interested in user experience and agile methodologies.'
      }
    ];
    
    const users = await User.create(demoUsers);
    console.log('✅ Created demo users');
    
    // Create demo posts
    const demoPosts = [
      {
        content: 'Just joined Professional Network! Excited to connect with fellow developers and share insights about modern web development. Looking forward to engaging discussions! 💻✨',
        author: users[0]._id
      },
      {
        content: 'Building amazing web applications with React and TypeScript! The developer experience keeps getting better every day. 🚀',
        author: users[0]._id
      },
      {
        content: 'Had a great day working on a new feature for our app. There\'s nothing quite like the satisfaction of solving a complex problem with clean, elegant code.',
        author: users[1]._id
      },
      {
        content: 'Thoughts on the future of web development: WebAssembly, edge computing, and modern development tools are going to revolutionize how we build applications.',
        author: users[1]._id
      },
      {
        content: 'Product management tip: Always validate your assumptions with real user data. What you think users want and what they actually need can be very different things.',
        author: users[2]._id
      }
    ];
    
    await Post.create(demoPosts);
    console.log('✅ Created demo posts');
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('\nDemo credentials:');
    console.log('Email: demo@example.com | Password: demo123');
    console.log('Email: jane@example.com | Password: jane123');
    console.log('Email: john@example.com | Password: john123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
