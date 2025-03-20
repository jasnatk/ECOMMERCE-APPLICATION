import Wishlist from "../models/wishlistModel.js"
import Product from "../models/productModel.js"

// Get all products in the wishlist of the authenticated user
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user_id: req.user.id }).populate("products.product_id");
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist", error: error.message });
  }
};

// Add a product to the wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find or create the user's wishlist
    let wishlist = await Wishlist.findOne({ user_id: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({
        user_id: req.user.id,
        products: [{ product_id: productId, quantity }],
      });
    } else {
      // Check if product is already in the wishlist
      const existingProduct = wishlist.products.find(p => p.product_id.toString() === productId);
      if (existingProduct) {
        return res.status(400).json({ message: "Product is already in your wishlist" });
      }
      wishlist.products.push({ product_id: productId, quantity });
    }

    await wishlist.save();
    res.status(200).json({ message: "Product added to wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Error adding product to wishlist", error: error.message });
  }
};

// Remove a product from the wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    // Find the wishlist for the authenticated user
    const wishlist = await Wishlist.findOne({ user_id: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Check if the product is in the wishlist
    const productIndex = wishlist.products.findIndex(p => p.product_id.toString() === productId);
    if (productIndex === -1) {
      return res.status(400).json({ message: "Product not found in your wishlist" });
    }

    // Remove the product from the wishlist
    wishlist.products.splice(productIndex, 1);
    await wishlist.save();

    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Error removing product from wishlist", error: error.message });
  }
};
