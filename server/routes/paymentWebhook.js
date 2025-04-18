// paymentWebhookRouter.js
import express from "express";
import Stripe from "stripe";
import { Cart } from "../models/cartModel.js";
import Order from "../models/orderModel.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 👇 Apply express.raw only for this POST route
router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const userId = session.metadata.userId;
      const address = session.customer_details?.address?.line1 || "N/A";

      const cart = await Cart.findOne({ userId });
      if (!cart || cart.products.length === 0) {
        console.log("Cart is empty for user:", userId);
        return res.status(400).json({ message: "Cart is empty" });
      }

      const products = cart.products.map((item) => ({
        product: item.productId,
        seller: item.sellerId,
        quantity: item.quantity,
        price: item.price,
      }));

      await Order.create({
        user: userId,
        products,
        totalAmount: cart.totalPrice,
        paymentMethod: "card",
        address,
      });

      cart.products = [];
      cart.totalPrice = 0;
      await cart.save();

      console.log("Order created for user:", userId);
    } catch (err) {
      console.error("Error creating order from webhook:", err);
      return res.status(500).send("Webhook server error");
    }
  }

  res.status(200).json({ received: true });
});

export default router;
