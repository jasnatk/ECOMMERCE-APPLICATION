// import Cart from "../models/cartModel.js";
// import Product from "../models/productModel.js";

// // Get user's cart
// export const getCart = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user.id }).populate("items.product", "name price");
//     if (!cart) {
//       return res.status(200).json({ message: "Cart is empty", items: [] });
//     }
//     res.status(200).json(cart);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // Add item to cart
// export const addToCart = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;

//     const product = await Product.findById(productId);
//     if (!product) return res.status(404).json({ message: "Product not found" });

//     let cart = await Cart.findOne({ user: req.user.id });

//     if (!cart) {
//       cart = new Cart({ user: req.user.id, items: [] });
//     }

//     // Check if product already exists in cart
//     const existingItem = cart.items.find((item) => item.product.toString() === productId);
//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       cart.items.push({ product: productId, quantity });
//     }

//     await cart.save();
//     res.status(200).json({ message: "Product added to cart", cart });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // Remove item from cart
// export const removeFromCart = async (req, res) => {
//   try {
//     const { productId } = req.body;
//     let cart = await Cart.findOne({ user: req.user.id });

//     if (!cart) return res.status(404).json({ message: "Cart not found" });

//     cart.items = cart.items.filter((item) => item.product.toString() !== productId);
//     await cart.save();

//     res.status(200).json({ message: "Product removed from cart", cart });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

// // Clear the entire cart
// export const clearCart = async (req, res) => {
//   try {
//     let cart = await Cart.findOne({ user: req.user.id });

//     if (!cart) return res.status(404).json({ message: "Cart not found" });

//     cart.items = [];
//     await cart.save();

//     res.status(200).json({ message: "Cart cleared successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };
