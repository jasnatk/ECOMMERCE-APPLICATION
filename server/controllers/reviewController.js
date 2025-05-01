import mongoose from "mongoose";
import Product from "../models/productModel.js";
import { Review } from "../models/reviewModel.js";

export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Please provide a rating between 1 and 5" });
    }

    // Create or update review
    const review = await Review.findOneAndUpdate(
      { user: userId, product: productId },
      { rating, comment, updatedAt: new Date() },
      { new: true, upsert: true, runValidators: true }
    );

    // Update product's rating and numReviews
    const reviews = await Review.find({ product: productId });
    const totalReviews = reviews.length;
    const averageRating = totalReviews
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    product.rating = averageRating;
    product.numReviews = totalReviews;
    await product.save();

    res.status(201).json({
      message: "Review submitted successfully",
      data: review,
      reviewCount: product.numReviews,
    });
  } catch (error) {
    console.error("Error in addReview:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: reviews, message: "Product reviews fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const review = await Review.findOneAndDelete({ _id: reviewId, user: userId });

    if (!review) {
      return res.status(404).json({ message: "Review not found or unauthorized" });
    }

    // Update product's average rating
    const reviews = await Review.find({ product: review.product });
    const totalReviews = reviews.length;
    const averageRating = totalReviews
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;
    const product = await Product.findById(review.product);
    product.rating = averageRating;
    product.numReviews = totalReviews;
    await product.save();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getAverageRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId });

    const totalReviews = reviews.length;
    const averageRating = totalReviews
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    res.status(200).json({ data: averageRating, message: "Average rating fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id; // Assuming user is authenticated

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const hasVoted = review.helpful.includes(userId);
    if (hasVoted) {
      // Remove helpful vote
      review.helpful = review.helpful.filter((id) => id.toString() !== userId.toString());
      await review.save();
      return res.status(200).json({
        success: true,
        message: "Helpful vote removed",
        helpfulCount: review.helpful.length,
      });
    }

    // Add helpful vote
    review.helpful.push(userId);
    await review.save();

    res.status(200).json({
      success: true,
      message: "Review marked as helpful",
      helpfulCount: review.helpful.length,
    });
  } catch (error) {
    console.error("Error in markHelpful:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const reportReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    if (!reason) {
      return res.status(400).json({ message: "Please provide a reason for reporting" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user already reported this review
    const hasReported = review.reported.some(
      (report) => report.user.toString() === userId.toString()
    );
    if (hasReported) {
      return res.status(400).json({ message: "You have already reported this review" });
    }

    // Add report
    review.reported.push({
      user: userId,
      reason,
    });
    await review.save();

    res.status(200).json({
      success: true,
      message: "Review reported successfully",
    });
  } catch (error) {
    console.error("Error in reportReview:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};