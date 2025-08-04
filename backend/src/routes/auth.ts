import express from 'express';
import {
  register,
  login,
  getMe,
  registerValidation,
  loginValidation
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', protect, getMe);

export default router;
