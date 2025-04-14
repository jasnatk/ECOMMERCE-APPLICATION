import express from "express";
import authSeller from "../middleware/authSeller.js";
import upload from "../middleware/multer.js";
import {
  deleteProduct,
  updateProduct,
  createProduct,
  createMultipleProducts,
  getAllProducts,
  getProductDetails,
} from "../controllers/productController.js";

const router = express.Router();

// Public routes
router.get("/productList", getAllProducts);
router.get("/productDetails/:productId", getProductDetails);

// Protected routes (seller only)
router.post("/create-product", authSeller, upload.array("images", 5), createProduct);
router.post("/create-products", authSeller, upload.any(), createMultipleProducts);
router.put("/update-product/:productId", authSeller, upload.array("images", 5), updateProduct);
router.delete("/remove-product/:productId", authSeller, deleteProduct);

export default router;