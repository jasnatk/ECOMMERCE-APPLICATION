import express from "express";

import { authAdmin } from "../middleware/authAdmin.js";
import upload from "../middleware/multer.js"
import {
    deleteProduct,
    updateProduct,
    createProduct,
    getAllProducts,
    getProductDetails,
    getProductsBySeller
   
} from "../controllers/productController.js";

const router = express.Router();

// Public routes
router.get("/productList", getAllProducts);
router.get("/productDetails/:productId", getProductDetails);
router.get("/products/seller/:sellerId", getProductsBySeller);
// Protected routes (only admin can manage products)
router.post("/create-product", upload.single("image"),authAdmin, createProduct);
router.put("/update-product/:productId", authAdmin, upload.single("image"), updateProduct);
router.delete("/remove-product/:productId", authAdmin, deleteProduct);

export default router;
