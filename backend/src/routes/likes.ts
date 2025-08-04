import express from 'express';
import {
  toggleLike,
  getPostLikes,
  getLikeStatus
} from '../controllers/likeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.post('/:postId', toggleLike);
router.get('/:postId', getPostLikes);
router.get('/:postId/status', getLikeStatus);

export default router;
