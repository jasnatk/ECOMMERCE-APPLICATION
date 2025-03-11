// import Wishlist from "../models/wishlistModel.js"; // Assuming you have a Wishlist model
// import Product from "../models/productModel.js"; // Assuming you have a Product model

// // Get all products in the wishlist of the authenticated user
// export const getWishlist = async (req, res) => {
//   try {
//     const wishlist = await Wishlist.find({ user: req.user.id }).populate("products");
//     res.status(200).json(wishlist);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching wishlist", error: error.message });
//   }
// };

// // Add a product to the wishlist
// export const addToWishlist = async (req, res) => {
//   try {
//     const { productId } = req.body;

//     // Check if the product exists
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Check if the product is already in the user's wishlist
//     const existingWishlist = await Wishlist.findOne({ user: req.user.id });
//     if (existingWishlist) {
//       // If the wishlist already exists, add the product to it
//       if (existingWishlist.products.includes(productId)) {
//         return res.status(400).json({ message: "Product is already in your wishlist" });
//       }

//       existingWishlist.products.push(productId);
//       await existingWishlist.save();
//     } else {
//       // If no wishlist exists for the user, create a new one
//       const newWishlist = new Wishlist({
//         user: req.user.id,
//         products: [productId],
//       });
//       await newWishlist.save();
//     }

//     res.status(200).json({ message: "Product added to wishlist" });
//   } catch (error) {
//     res.status(500).json({ message: "Error adding product to wishlist", error: error.message });
//   }
// };

// // Remove a product from the wishlist
// export const removeFromWishlist = async (req, res) => {
//   try {
//     const { productId } = req.body;

//     // Find the wishlist for the authenticated user
//     const wishlist = await Wishlist.findOne({ user: req.user.id });
//     if (!wishlist) {
//       return res.status(404).json({ message: "Wishlist not found" });
//     }

//     // Check if the product is in the wishlist
//     if (!wishlist.products.includes(productId)) {
//       return res.status(400).json({ message: "Product not found in your wishlist" });
//     }

//     // Remove the product from the wishlist
//     wishlist.products = wishlist.products.filter(product => product.toString() !== productId);
//     await wishlist.save();

//     res.status(200).json({ message: "Product removed from wishlist" });
//   } catch (error) {
//     res.status(500).json({ message: "Error removing product from wishlist", error: error.message });
//   }
// };
