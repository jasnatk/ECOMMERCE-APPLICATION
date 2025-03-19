import express from "express";
import { getCart, addToCart, removeFromCart, clearCart } from "../controllers/cartController.js";
import { authUser } from "../middleware/authUser.js";

const router = express.Router();

router.get("/getCart", authUser, getCart);
router.post("/addToCart", authUser, addToCart);
router.put("/removeFromCart", authUser, removeFromCart);
router.delete("/clearCart", authUser, clearCart);

export default router;