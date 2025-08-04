import mongoose from 'mongoose';

export interface IPost extends mongoose.Document {
  content: string;
  author: mongoose.Types.ObjectId;
  likes: number;
  comments: number;
  shares: number;
  images?: string[];
  type: 'text' | 'image' | 'video' | 'document';
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema<IPost>({
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [3000, 'Content cannot be more than 3000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  images: [{
    type: String
  }],
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'document'],
    default: 'text'
  }
}, {
  timestamps: true
});

// Always populate author when querying posts
postSchema.pre(/^find/, function(this: mongoose.Query<any, any>) {
  this.populate({
    path: 'author',
    select: 'name bio headline profilePicture'
  });
});

export const Post = mongoose.model<IPost>('Post', postSchema);
