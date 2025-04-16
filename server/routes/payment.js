import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


router.post("/create-checkout-session", async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products are required" });
    }

    const line_items = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.name,
          description: product.description || "No description",
        },
        unit_amount: Math.round(parseFloat(product.price) * 100), // convert to paisa
      },
      quantity: product.quantity || 1,
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

    return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe session error:", error.message);
    return res.status(500).json({ message: "Failed to create Stripe session" });
  }
});


export default router;