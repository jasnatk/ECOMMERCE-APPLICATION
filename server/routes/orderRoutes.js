import express from "express";
import { authAdmin } from "../middleware/authAdmin.js";
import { authUser } from "../middleware/authUser.js";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus
} from "../controllers/orderController.js";

const router = express.Router();

// User routes
router.post("/create-order", authUser, createOrder);
router.get("/my-orders", authUser, getMyOrders);
router.get("/:id", authUser, getOrderById);
router.put("/:id/cancel", authUser, cancelOrder);

// Admin routes
router.get("/", authAdmin, getAllOrders);
router.put("/:id/status", authAdmin, updateOrderStatus);

export default router;
