import express from "express";
import Stripe from "stripe";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payment/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "User authentication failed" });
    }

    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products are required" });
    }

    // Validate and enrich products
    const validatedProducts = await Promise.all(
      products.map(async (product) => {
        const productId = product._id || product.productId; // Handle both _id and productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
          throw new Error(`Invalid product ID: ${productId}`);
        }
        const productDoc = await Product.findById(productId).select("name price image seller");
        if (!productDoc) {
          throw new Error(`Product not found: ${productId}`);
        }
        if (!mongoose.Types.ObjectId.isValid(product.sellerId) || product.sellerId !== productDoc.seller.toString()) {
          console.warn(`Invalid or mismatched sellerId for product ${productId}. Using seller from Product model.`);
        }
        return {
          _id: productId,
          productId: productId,
          name: product.name || productDoc.name,
          price: parseFloat(product.price) || productDoc.price,
          image: product.image || productDoc.image || "https://via.placeholder.com/100",
          sellerId: productDoc.seller.toString(), // Use seller from Product model
          quantity: product.quantity || 1,
          description: product.description || "No description",
        };
      })
    );

    const line_items = validatedProducts.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.name,
          description: product.description,
          images: [product.image],
          metadata: {
            sellerId: product.sellerId,
            mongoProductId: product._id,
          },
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity: product.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.CLIENT_DOMAIN}/user/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_DOMAIN}/user/payment-cancel`,
      shipping_address_collection: {
        allowed_countries: ["IN", "US", "CA"],
      },
      billing_address_collection: "required",
      customer_email: req.user.email,
      metadata: {
        userId: req.user.id,
        shouldClearCartFrontend: true,
        products: JSON.stringify(
          validatedProducts.map((p) => ({
            _id: p.productId,
            sellerId: p.sellerId,
          }))
        ),
      },
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe session creation error:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to create Stripe session", error: error.message });
  }
});

// GET /api/payment/session/:sessionId
router.get("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data.price.product", "customer_details"],
    });

    return res.status(200).json({ session });
  } catch (error) {
    console.error("Stripe session fetch error:", error.message);
    res.status(500).json({ message: "Failed to fetch session", error: error.message });
  }
});

export default router;