import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String },
      seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
    },
  ],
  address: {
    name: String,
    email: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postal_code: String,
    country: String,
  },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: "pending" },
  amountTotal: { type: Number, required: true },
  currency: { type: String, default: "inr" },
  stripeSessionId: { type: String },
  status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  reviewedByAdmin: { type: Boolean, default: false }, 

});

const Order = mongoose.model("Order", orderSchema);

export default Order ;
