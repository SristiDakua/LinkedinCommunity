import express from 'express';
import {
  getUserProfile,
  updateProfile,
  getUsers,
  updateProfileValidation
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.get('/', getUsers);
router.get('/:id', getUserProfile);
router.put('/profile', updateProfileValidation, updateProfile);

export default router;
