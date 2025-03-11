import express from 'express';
import { registerSeller, updateSellerProfile } from '../controllers/sellerController.js';
import { authSeller } from '../middleware/authSeller.js'; // Authentication middleware

const router = express.Router();

// Register a new seller
router.post('/register', registerSeller);

// Seller updates their profile (protected route)
router.put('/profile', authSeller, updateSellerProfile);

export default router;

