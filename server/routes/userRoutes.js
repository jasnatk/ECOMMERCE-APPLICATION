import express from 'express';
import { 
  userSignUp,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  changePassword,checkUser
} from '../controllers/userController.js';
import { authUser } from '../middleware/authUser.js'; // Authentication middleware

const router = express.Router();

// User Routes
router.post('/register', userSignUp);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', authUser, getUserProfile);
router.put('/profile', authUser, updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/change-password', authUser, changePassword);
router.get("/check-user",authUser,checkUser)

export default router;
