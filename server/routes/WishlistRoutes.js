import express from "express";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/whishlistController.js";
import { authUser } from "../middleware/authUser.js";

const router = express.Router();

router.get("/", authUser, getWishlist);
router.post("/add",authUser , addToWishlist);
router.delete("/remove",authUser , removeFromWishlist);

export default router;
