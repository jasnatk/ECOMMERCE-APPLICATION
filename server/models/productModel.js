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

    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

  

}, { timestamps: true }); 



export default mongoose.model("Product", productSchema);
