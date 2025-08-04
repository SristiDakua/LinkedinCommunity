import { Response } from 'express';
import { Like } from '../models/Like.js';
import { Post } from '../models/Post.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Like/Unlike a post
// @route   POST /api/likes/:postId
// @access  Private
export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = (req.user! as any)._id;
    const { type = 'like' } = req.body;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if user already liked the post
    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      // Unlike the post
      await existingLike.deleteOne();
      await Post.findByIdAndUpdate(postId, { $inc: { likes: -1 } });

      res.status(200).json({
        success: true,
        message: 'Post unliked successfully',
        liked: false
      });
    } else {
      // Like the post
      const like = await Like.create({
        user: userId,
        post: postId,
        type
      });

      await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 } });

      res.status(201).json({
        success: true,
        data: like,
        message: 'Post liked successfully',
        liked: true
      });
    }
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling like'
    });
  }
};

// @desc    Get post likes
// @route   GET /api/likes/:postId
// @access  Private
export const getPostLikes = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const likes = await Like.find({ post: postId })
      .populate('user', 'name profilePicture headline')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Like.countDocuments({ post: postId });

    res.status(200).json({
      success: true,
      data: likes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get post likes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching post likes'
    });
  }
};

// @desc    Check if user liked a post
// @route   GET /api/likes/:postId/status
// @access  Private
export const getLikeStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = (req.user! as any)._id;

    const like = await Like.findOne({ user: userId, post: postId });

    res.status(200).json({
      success: true,
      liked: !!like,
      type: like?.type || null
    });
  } catch (error) {
    console.error('Get like status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking like status'
    });
  }
};
