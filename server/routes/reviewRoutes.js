import express from "express";
import {
  addReview,
  getProductReviews,
  deleteReview,
  getAverageRating,
  markHelpful,
  reportReview,

} from "../controllers/reviewController.js";
import { authUser } from "../middleware/authUser.js";


const router = express.Router();

router.post("/add-review", authUser , addReview);
router.get("/product/:productId", getProductReviews);
router.delete("/:reviewId", authUser , deleteReview);
router.get("/average-rating/:productId", getAverageRating);
router.post("/:reviewId/helpful", authUser, markHelpful); 
router.post("/:reviewId/report", authUser, reportReview);


export default router;