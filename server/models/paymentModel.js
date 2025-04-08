import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: String, required: true },  // Stripe session ID
    status: { type: String, required: true },     // e.g. success, canceled
    amount: { type: Number, required: true },     // Amount paid
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Use default export to export the model
export default mongoose.model("Payment", paymentSchema);
