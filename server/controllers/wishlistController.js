import { Types } from 'mongoose';
import Wishlist from '../models/wishlistModel.js';
import Product from '../models/productModel.js';

// Get wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user_id: req.user.id }).populate('products.product_id');
    if (!wishlist) {
      return res.status(200).json({ products: [], message: 'Wishlist is empty' });
    }
    res.status(200).json({ data: wishlist, message: 'Wishlist fetched successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user_id: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({
        user_id: req.user.id,
        products: [{ product_id: productId, quantity }],
      });
    } else {
      const exists = wishlist.products.some(p => p.product_id.toString() === productId);
      if (exists) {
        return res.status(409).json({ message: 'Product already in wishlist' });
      }
      wishlist.products.push({ product_id: productId, quantity });
    }

    await wishlist.save();
    res.status(200).json({ message: 'Product added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product to wishlist', error: error.message });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const wishlist = await Wishlist.findOne({ user_id: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const initialLength = wishlist.products.length;
    wishlist.products = wishlist.products.filter(p => p.product_id.toString() !== productId);

    if (wishlist.products.length === initialLength) {
      return res.status(404).json({ message: 'Product not found in wishlist' });
    }

    await wishlist.save();
    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing product from wishlist', error: error.message });
  }
};
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user_id: req.user.id });

    if (!wishlist) {
      // Create wishlist and add product
      wishlist = new Wishlist({
        user_id: req.user.id,
        products: [{ product_id: productId }],
      });
      await wishlist.save();
      return res.status(200).json({ message: "Product added to wishlist" });
    }

    // Check if product exists
    const index = wishlist.products.findIndex(
      (p) => p.product_id.toString() === productId
    );

    if (index > -1) {
      // Product exists — remove it
      wishlist.products.splice(index, 1);
      await wishlist.save();
      return res.status(200).json({ message: "Product removed from wishlist" });
    } else {
      // Product doesn't exist — add it
      wishlist.products.push({ product_id: productId });
      await wishlist.save();
      return res.status(200).json({ message: "Product added to wishlist" });
    }
  } catch (error) {
    res.status(500).json({ message: "Toggle error", error: error.message });
  }
};
