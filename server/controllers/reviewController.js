import mongoose from "mongoose";
import Product from "../models/productModel.js";
import {Review} from "../models/reviewModel.js";

export const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.id;

        // Validate if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Please provide a rating between 1 and 5" });
        }

        // Create or update the review
        const review = await Review.findOneAndUpdate(
            { userId, productId },
            { rating, comment },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(201).json({ data: review, message: "Review added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ productId })
            .populate("userId", "name")
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

        const review = await Review.findOneAndDelete({ _id: reviewId, userId });

        if (!review) {
            return res.status(404).json({ message: "Review not found or unauthorized" });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const getAverageRating = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ productId });

        const totalReviews = reviews.length;
        const averageRating = totalReviews
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            : 0;

        res.status(200).json({ data: averageRating, message: "Average rating fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
