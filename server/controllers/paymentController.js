import Stripe from "stripe";
import Payment from "../models/paymentModel.js"; // Import the Payment model

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const client_domain = process.env.CLIENT_DOMAIN;

// Create checkout session
export const createCheckoutSession = async (req, res, next) => {
  try {
    const { products } = req.body;

    const lineItems = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product?.productId?.name,
          images: [product?.productId?.image],
        },
        unit_amount: Math.round(product?.productId?.price * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${client_domain}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${client_domain}/payment/cancel`,
    });

    res.json({ success: true, sessionId: session.id ,url: session.url});
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message || "Internal server Error" });
  }
};

// Check payment status
export const sessionStatus = async (req, res) => {
  try {
    const sessionId = req.query.session_id;

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer"],
    });

    const products = session.line_items.data.map((item) => ({
      productId: item.price.product,
      quantity: item.quantity,
      price: item.amount_total ? item.amount_total / 100 : 0,
    }));

    // Optional: Get the user from your DB using session.customer if needed

    const payment = new Payment({
      user: req.user._id, // assuming authUser middleware sets req.user
      sessionId: session.id,
      status: session.payment_status, // e.g., 'paid'
      amount: session.amount_total ? session.amount_total / 100 : 0,
      products,
    });

    await payment.save();

    res.send({
      data: session,
      status: session.payment_status,
      customer_email: session.customer_details?.email,
      session_data: session,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      products,
    });
  } catch (error) {
    res.status(error?.statusCode || 500).json({ error: error.message || "Internal server error" });
  }
};
