// import mongoose from 'mongoose';

// const { Schema, Types } = mongoose;

// const ProductItemSchema = new Schema({
//     product_id: {
//         type: Types.ObjectId,
//         ref: 'Product'
//     },
//     SKU: {
//         type: String,
//         required: true,
//     },

//     qty_in_stock: {
//         type: Number,
//         required: true,
//     },

//     price: {
//         type: Number,
//         required: true,
//     },

//     variations: [{
//         type: Types.ObjectId,
//         ref: 'VariationOption',
//     }],
// });

//  const ProductItem = mongoose.model('ProductItem', ProductItemSchema);
// export default ProductItem;