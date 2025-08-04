import mongoose from 'mongoose';

export interface IComment extends mongoose.Document {
  content: string;
  author: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  parentComment?: mongoose.Types.ObjectId; // For nested replies
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema<IComment>({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Post is required']
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });

// Populate author when querying comments
commentSchema.pre(/^find/, function(this: mongoose.Query<any, any>) {
  this.populate({
    path: 'author',
    select: 'name profilePicture'
  });
});

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
