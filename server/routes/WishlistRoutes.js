import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
} from "../controllers/wishlistController.js";
import { authUser } from "../middleware/authUser.js";

const router = express.Router();

// Get all wishlist items
router.get("/getAll", authUser, getWishlist);

// Add item to wishlist
router.post("/add", authUser, addToWishlist);

// Remove item from wishlist using product ID in URL
router.delete("/remove/:productId", authUser, removeFromWishlist);
// allows users to add or remove a product by clicking a heart icon 
router.put("/toggle/:productId", authUser, toggleWishlist);


export default router;
