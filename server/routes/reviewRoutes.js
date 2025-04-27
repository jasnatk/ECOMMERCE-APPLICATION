import express from "express";
import { authUser } from "../middleware/authUser.js";
import { 
    addReview, 
    deleteReview, 
    getAverageRating, 
    getProductReviews 
} from "../controllers/reviewController.js";

const router = express.Router();

// Add review 
router.post("/add-review", authUser, addReview);

// Delete review 
router.delete("/delete-review/:reviewId", authUser, deleteReview);

// Get product reviews
router.get("/product/:productId", getProductReviews);

// Get product average rating
router.get("/avg-rating/:productId", getAverageRating);

export default router
