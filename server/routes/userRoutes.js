import express from 'express';
import upload from "../middleware/multer.js";
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
import { authUser } from '../middleware/authUser.js'; 
import { uploadProfilePic } from "../controllers/userController.js";

const router = express.Router();

// User Routes
router.post('/signup', userSignUp);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get("/check-user",authUser,checkUser)
router.get('/profile', authUser, getUserProfile);
router.put('/editprofile', authUser, updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/change-password', authUser, changePassword);
router.post("/upload-profile-pic", authUser, upload.single("profilePic"), uploadProfilePic);

export default router;
