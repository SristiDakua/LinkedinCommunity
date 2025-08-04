import mongoose from 'mongoose';

export interface ILike extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  type: 'like' | 'love' | 'insightful' | 'celebrate' | 'support' | 'funny';
  createdAt: Date;
}

const likeSchema = new mongoose.Schema<ILike>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Post is required']
  },
  type: {
    type: String,
    enum: ['like', 'love', 'insightful', 'celebrate', 'support', 'funny'],
    default: 'like'
  }
}, {
  timestamps: true
});

// Ensure user can only like a post once
likeSchema.index({ user: 1, post: 1 }, { unique: true });

// Populate user when querying likes
likeSchema.pre(/^find/, function(this: mongoose.Query<any, any>) {
  this.populate({
    path: 'user',
    select: 'name profilePicture'
  });
});

export const Like = mongoose.model<ILike>('Like', likeSchema);
