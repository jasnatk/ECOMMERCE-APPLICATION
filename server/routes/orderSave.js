import express from "express";
import Stripe from "stripe";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.get("/paymentsuccess", async (req, res) => {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ message: "Session ID missing" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items.data.price.product", "customer_details"],
    });

    const existingOrder = await Order.findOne({ stripeSessionId: session.id });
    if (existingOrder) {
      return res
        .status(200)
        .json({ message: "Order already exists", orderId: existingOrder._id });
    }

    const metadataProducts = JSON.parse(session.metadata.products || "[]");

    const customer = session.customer_details;
    const address = {
      name: customer.name,
      email: customer.email,
      phone: customer.phone || customer.phoneNumber,
      line1: customer.address?.line1,
      line2: customer.address?.line2,
      city: customer.address?.city,
      state: customer.address?.state,
      postal_code: customer.address?.postal_code,
      country: customer.address?.country,
    };

    // Combine line items with metadataProducts
    const products = session.line_items.data.map((item, index) => {
      const productData = item.price.product;
      const mongoInfo = metadataProducts[index];

      return {
        productId: mongoInfo?._id,
        name: productData.name,
        quantity: item.quantity,
        price: item.price.unit_amount / 100,
        image:
          productData.images && productData.images.length > 0
            ? productData.images[0]
            : "https://via.placeholder.com/100",
        seller: mongoInfo?.sellerId,
      };
    });

    // Update stock for each product
    for (const product of products) {
      const productDoc = await Product.findById(product.productId);
      if (!productDoc) {
        throw new Error(`Product not found: ${product.productId}`);
      }
      if (productDoc.stock < product.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }
      productDoc.stock -= product.quantity;
      await productDoc.save();
    }

    const order = new Order({
      user: session.metadata.userId,
      stripeSessionId: session.id,
      status: "pending",
      amountTotal: session.amount_total / 100,
      currency: session.currency,
      products: products || [],
      address,
      paymentMethod: "Card,Stripe",
      paymentStatus: session.payment_status,
    });

    await order.save();

    const user = await User.findById(session.metadata.userId);
    user.cart = [];
    await user.save();

    return res
      .status(200)
      .json({ message: "Order saved and stock updated", orderId: order._id });
  } catch (error) {
    console.error("Error saving order or updating stock:", error);
    res.status(500).json({
      message: "Failed to save order or update stock",
      error: error.message,
    });
  }
});

export default router;