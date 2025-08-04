import { Response } from 'express';
import { Comment } from '../models/Comment.js';
import { Post } from '../models/Post.js';
import { AuthRequest } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

// @desc    Create comment
// @route   POST /api/comments/:postId
// @access  Private
export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { postId } = req.params;
    const { content, parentComment } = req.body;
    const userId = (req.user! as any)._id;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // If replying to a comment, check if parent comment exists
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found'
        });
      }
    }

    const comment = await Comment.create({
      content,
      author: userId,
      post: postId,
      parentComment: parentComment || null
    });

    // Increment post comment count
    await Post.findByIdAndUpdate(postId, { $inc: { comments: 1 } });

    // Populate author information
    await comment.populate('author', 'name profilePicture headline');

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating comment'
    });
  }
};

// @desc    Get post comments
// @route   GET /api/comments/:postId
// @access  Private
export const getPostComments = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get top-level comments (no parent comment)
    const comments = await Comment.find({ 
      post: postId, 
      parentComment: null 
    })
      .populate('author', 'name profilePicture headline')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Comment.countDocuments({ 
      post: postId, 
      parentComment: null 
    });

    res.status(200).json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get post comments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching comments'
    });
  }
};

// @desc    Get comment replies
// @route   GET /api/comments/:commentId/replies
// @access  Private
export const getCommentReplies = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    const replies = await Comment.find({ parentComment: commentId })
      .populate('author', 'name profilePicture headline')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: 1 }); // Oldest first for replies

    const total = await Comment.countDocuments({ parentComment: commentId });

    res.status(200).json({
      success: true,
      data: replies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get comment replies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching replies'
    });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:commentId
// @access  Private
export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { commentId } = req.params;
    const { content } = req.body;
    const userId = (req.user! as any)._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user owns the comment
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json({
      success: true,
      data: comment,
      message: 'Comment updated successfully'
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating comment'
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:commentId
// @access  Private
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = (req.user! as any)._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user owns the comment
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: commentId });

    // Delete the comment
    await comment.deleteOne();

    // Decrement post comment count
    await Post.findByIdAndUpdate(comment.post, { $inc: { comments: -1 } });

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting comment'
    });
  }
};

// Validation rules
export const commentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
];
