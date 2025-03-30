import mongoose from "mongoose";


const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        unique:true,
    },

    description: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
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

    image: {
        type: String,
        required: true,
    },

    seller: { type: mongoose.Types.ObjectId, ref: "Seller"  }

  

}, { timestamps: true }); 



export default mongoose.model("Product", productSchema);
