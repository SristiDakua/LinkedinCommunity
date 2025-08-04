import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { experienceSchema, educationSchema, skillSchema, IExperience, IEducation, ISkill } from './ProfileSchemas.js';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  bio: string;
  headline?: string;
  location?: string;
  profilePicture?: string;
  bannerImage?: string;
  website?: string;
  experience: IExperience[];
  education: IEducation[];
  skills: ISkill[];
  connections: number;
  followers: number;
  following: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    trim: true,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  headline: {
    type: String,
    trim: true,
    maxlength: [120, 'Headline cannot be more than 120 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  profilePicture: {
    type: String,
    default: null
  },
  bannerImage: {
    type: String,
    default: null
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  experience: [experienceSchema],
  education: [educationSchema],
  skills: [skillSchema],
  connections: {
    type: Number,
    default: 0
  },
  followers: {
    type: Number,
    default: 0
  },
  following: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export const User = mongoose.model<IUser>('User', userSchema);
