import express from "express";

import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import {authAdmin} from "../middleware/authAdmin.js";
import Seller from '../models/sellerModel.js';
import {
  adminLogout,
  getAdminProfile,
  adminSignUp,
  adminLogin,
  checkAdmin
} from '../controllers/adminController.js';

const router = express.Router();

// Public routes
router.post('/signup', adminSignUp);
router.post('/login', adminLogin);

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
    const sellers = await Seller.find();  // Change User to Seller
    res.json({ sellers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching sellers", error });
  }
});


router.post('/logout', adminLogout);
router.get('/profile', getAdminProfile);
router.get("/check-admin", checkAdmin);

export default router;
