import express from "express";
import { authAdmin } from "../middleware/authAdmin.js";
import { authUser } from "../middleware/authUser.js";

import {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    getSellerOrders,
    updateSellerProductStatus
} from "../controllers/orderController.js";
import authSeller from "../middleware/authSeller.js";

const router = express.Router();

// User routes
router.post("/create-order", authUser, createOrder);
router.get("/my-orders", authUser, getMyOrders);
router.get("/sellerorders",authSeller, getSellerOrders);
router.put("/seller-product-status", authSeller, updateSellerProductStatus);
router.get("/:orderId", authUser, getOrderById);
router.put("/:id/cancel", authUser, cancelOrder);
router.get("/", authAdmin, getAllOrders);


export default router;
