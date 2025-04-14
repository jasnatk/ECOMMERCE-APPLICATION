import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /payment/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { products, success_url, cancel_url } = req.body;

    const line_items = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.name,
          description: product.description,
        },
        unit_amount: product.price * 100, // in paisa
      },
      quantity: product.quantity,
    }));
 
    const successUrl = `${process.env.CLIENT_DOMAIN}/user/payment-success`;
    const cancelUrl = `${process.env.CLIENT_DOMAIN}/user/payment-cancel`;


    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe session error:", error.message);
    res.status(500).json({ message: "Failed to create Stripe session" });
  }
});

export default router;
