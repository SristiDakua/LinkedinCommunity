import mongoose from 'mongoose';

export interface IConnection extends mongoose.Document {
  requester: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  createdAt: Date;
  updatedAt: Date;
}

const connectionSchema = new mongoose.Schema<IConnection>({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requester is required']
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'blocked'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Ensure unique connections between users
connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Populate users when querying connections
connectionSchema.pre(/^find/, function(this: mongoose.Query<any, any>) {
  this.populate({
    path: 'requester',
    select: 'name email bio profilePicture'
  }).populate({
    path: 'recipient',
    select: 'name email bio profilePicture'
  });
});

export const Connection = mongoose.model<IConnection>('Connection', connectionSchema);
