// backend/controllers/reviewController.js
import mongoose from "mongoose";
import Product from "../models/productModel.js";
import { Review } from "../models/reviewModel.js";

export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Please provide a rating between 1 and 5" });
    }

    const review = await Review.findOneAndUpdate(
      { user: userId, product: productId },
      { rating, comment },
      { new: true, upsert: true, runValidators: true }
    );

    // Update product's average rating
    const reviews = await Review.find({ product: productId });
    const totalReviews = reviews.length;
    const averageRating = totalReviews
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;
    product.rating = averageRating;
    product.numReviews = totalReviews;
    await product.save();

    res.status(201).json({ data: review, message: "Review added successfully" });
  } catch (error) {
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