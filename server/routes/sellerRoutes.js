import express from 'express';
import { sellerSignup, sellerLogin, sellerProfile, sellerLogout, checkSeller,getProductsBySeller } from "../controllers/sellerController.js"
import authSeller from "../middleware/authSeller.js"
import { getSellerStats } from "../controllers/sellerController.js";

const router = express.Router();

router.post('/signup', sellerSignup);
router.post('/login', sellerLogin);
router.get('/profile', authSeller, sellerProfile);
router.post('/logout', authSeller, sellerLogout);
router.get('/check-seller', authSeller, checkSeller);
router.get("/stats",authSeller, getSellerStats);
router.get("/me", authSeller, getProductsBySeller );


export default router;