import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user?.id) {
      return res.status(401).json({ message: "User authentication failed" });
    }

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
        unit_amount: Math.round(parseFloat(product.price) * 100),
      },
      quantity: product.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.CLIENT_DOMAIN}/user/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.CLIENT_DOMAIN}/user/payment-cancel`,
      metadata: {
        userId: req.user.id, // Add user ID
        shouldClearCartFrontend: true,
      },
    });
    

    return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe session creation error:", error.message);
    return res.status(500).json({ message: "Failed to create Stripe session", error: error.message });
  }
});

// GET /api/payment/session/:sessionId
router.get("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer_details"],
    });

    return res.status(200).json({
      session,
    });
  } catch (error) {
    console.error("Stripe session fetch error:", error.message);
    res.status(500).json({ message: "Failed to fetch session", error: error.message });
  }
});


export default router;
