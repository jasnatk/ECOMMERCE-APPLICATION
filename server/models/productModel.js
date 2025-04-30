
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: ["Men", "Women", "Kids"],
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    seller: { type: mongoose.Types.ObjectId, ref: "Seller", required: true },
    rating: {type: Number, default: 0,
    },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);