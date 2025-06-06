import express from "express";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { authAdmin } from "../middleware/authAdmin.js";
import { authUser } from "../middleware/authUser.js";
import Seller from '../models/sellerModel.js';
import upload from "../middleware/multer.js";
import { blockSeller } from "../controllers/sellerController.js";
import {
  adminLogout,
  getAdminProfile,
  adminSignUp,
  adminLogin,
  checkAdmin,
  deactivateUser,
  deleteUser,
  getAllUsers,
  verifySeller,
  updateAdminProfile,
  uploadAdminProfilePic,
} from '../controllers/adminController.js';

const router = express.Router();

// Public routes
router.post('/signup', adminSignUp);
router.post('/login', adminLogin);
router.post('/logout', adminLogout);
router.put("/profile", authAdmin, updateAdminProfile);
router.post("/upload-profile-pic", authAdmin, upload.single("profilePic"), uploadAdminProfilePic);
router.put('/sellers/:sellerId/block', blockSeller);
// Protected routes
router.use(authAdmin);

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("products");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({ isVerified: false }).populate("seller");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

router.put("/products/:id/verify", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error verifying product", error });
  }
});

router.get("/sellers", async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.json({ sellers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching sellers", error });
  }
});

router.get('/profile', getAdminProfile);
router.get("/check-admin", checkAdmin);

// Admin user management
router.get("/users", authUser, authAdmin, getAllUsers);
router.put('/deactivate/:id', authUser, authAdmin, deactivateUser);
router.delete('/delete/:id', authUser, authAdmin, deleteUser);
router.put('/sellers/:id/verify', authUser, authAdmin, verifySeller);

export default router;