// import Review from "../models/reviewModel.js";
// import Product from "../models/productModel.js";

// // Get all reviews for a product
// export const getReviewsForProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const reviews = await Review.find({ product: req.params.productId });
//     res.status(200).json(reviews);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching reviews", error: error.message });
//   }
// };

// // Create a new review for a product
// export const createReview = async (req, res) => {
//   try {
//     const { rating, comment } = req.body;

//     // Check if product exists
//     const product = await Product.findById(req.params.productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Create the review
//     const newReview = new Review({
//       user: req.user.id,  // Assumes req.user is populated via authentication middleware
//       product: req.params.productId,
//       rating,
//       comment,
//     });

//     await newReview.save();

//     // Optionally, you could also update the product's average rating here
//     res.status(201).json({ message: "Review created successfully", review: newReview });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating review", error: error.message });
//   }
// };

// // Delete a review
// export const deleteReview = async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.reviewId);
//     if (!review) {
//       return res.status(404).json({ message: "Review not found" });
//     }

//     // Check if the user is the one who created the review
//     if (review.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: "You can only delete your own reviews" });
//     }

//     // Delete the review
//     await review.remove();
//     res.status(200).json({ message: "Review deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting review", error: error.message });
//   }
// };
