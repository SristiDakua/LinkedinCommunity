import express from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
  postValidation
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router
  .route('/')
  .get(getPosts)
  .post(postValidation, createPost);

router
  .route('/:id')
  .get(getPost)
  .put(postValidation, updatePost)
  .delete(deletePost);

router.get('/user/:userId', getUserPosts);

export default router;
