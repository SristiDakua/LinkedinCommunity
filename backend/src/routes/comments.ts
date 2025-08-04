import express from 'express';
import {
  createComment,
  getPostComments,
  getCommentReplies,
  updateComment,
  deleteComment,
  commentValidation
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.post('/:postId', commentValidation, createComment);
router.get('/:postId', getPostComments);
router.get('/:commentId/replies', getCommentReplies);
router.put('/:commentId', commentValidation, updateComment);
router.delete('/:commentId', deleteComment);

export default router;
