// routes/paymentRoutes.js
import express from "express";
import { createCheckoutSession, sessionStatus } from "../controllers/paymentController.js";
import { authUser } from "../middleware/authUser.js";

const router = express.Router();

// Create checkout session
router.post("/create-checkout-session", authUser, createCheckoutSession);

// Check payment status
router.get("/session-status",authUser, sessionStatus);

export default router;
