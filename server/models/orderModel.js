// import mongoose from "mongoose";



// const orderSchema = new Schema({
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//     },
    
//     products: [
//         {
//             product: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "Product",
//                 required: true,
//             },
//             quantity: {
//                 type: Number,
//                 required: true,
//             },
//         }
//     ],

//     totalAmount: {
//         type: Number,
//         required: true,
//     },

//     status: {
//         type: String,
//         enum: ["pending", "shipped", "delivered", "cancelled"],
//         default: "pending",
//     },

//     paymentMethod: {
//         type: String,
//         enum: ["cod", "card", "paypal"],
//         required: true,
//     },

//     address: {
//         type: String,
//         required: true,
//     },
// }, { timestamps: true });

// const Order = mongoose.model("Order", orderSchema);
// export default Order;