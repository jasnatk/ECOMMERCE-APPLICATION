import express from 'express';
import { sellerSignup, sellerLogin, getSellerProfile, sellerLogout, checkSeller } from "../controllers/sellerController.js"
import authSeller from "../middleware/authSeller.js"
const router = express.Router();

router.post('/signup', sellerSignup);
router.post('/login', sellerLogin);
router.get('/profile', authSeller, getSellerProfile);
router.post('/logout', authSeller, sellerLogout);
router.post('/check', checkSeller);

export default router;
