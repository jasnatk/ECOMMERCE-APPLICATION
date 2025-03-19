import { Cart } from "../models/cartModel.js";
import Product from "../models/productModel.js";

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart) {
      return res.status(200).json({ message: "Cart is empty", items: [] });
    }
    res.status(200).json({ data: cart, message: "Cart fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Validate product existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find user's cart or create a new one
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Check if product already exists in cart
    const productExists = cart.products.some((item) => item.productId.equals(productId));
    if (productExists) {
      return res.status(400).json({ message: "Product already in cart" });
    }

    // Add product to cart
    cart.products.push({ productId, quantity, price: product.price });
    cart.calculateTotalPrice();
    await cart.save();

    res.status(200).json({ data: cart, message: "Product added to cart" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Remove the product from the cart
    cart.products = cart.products.filter((item) => !item.productId.equals(productId));
    cart.calculateTotalPrice();
    await cart.save();

    res.status(200).json({ data: cart, message: "Product removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Clear the entire cart
export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
