import express from 'express';
import { sellerSignup, sellerLogin, sellerProfile, sellerLogout, checkSeller,getProductsBySeller, updateSellerProfile } from "../controllers/sellerController.js"
import upload from "../middleware/multer.js";
import { uploadSellerProfilePic } from "../controllers/sellerController.js";
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
router.put("/profile", authSeller, updateSellerProfile);
router.post("/upload-profile-pic", authSeller, upload.single("profilePic"), uploadSellerProfilePic);
router.get("/all", async (req, res) => {
    try {
      const sellers = await Seller.find().select("-password"); 
      res.json({ sellers });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch sellers" });
    }
  });

export default router;