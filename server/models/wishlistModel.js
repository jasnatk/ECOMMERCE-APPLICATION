import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const WishlistSchema = new Schema(
  {
    user_id: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },

    products: [
      {
        product_id: {
          type: Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Wishlist = mongoose.model('Wishlist', WishlistSchema);
export default Wishlist;
