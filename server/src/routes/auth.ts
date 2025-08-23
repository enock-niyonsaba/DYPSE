import { Router } from 'express';
import { register, login, logout, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middlewares/auth';
import { uploadRegistrationFiles } from '../services/fileUploadService';

const router = Router();

// Public routes
router.post('/register', uploadRegistrationFiles, register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

export default router;
