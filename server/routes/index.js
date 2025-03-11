import express from "express"
import userRouter from './userRoutes.js'
import sellerRouter from './sellerRoutes.js'
import adminRouter from './adminRoutes.js'
// import orderRouter from './orderRoutes.js'
// import paymentRouter from './paymentRoutes.js'
// import productRouter from './productRoutes.js'
// import reviewRouter from './reviewRoutes.js'
// import cartRouter from './cartRoutes.js'
// import categoryRouter from './categoryRoutes.js'
// import WishlistRouter from './WishlistRoutes.js'


const router = express.Router();

router.use("/user", userRouter);
router.use('/seller', sellerRouter);
router.use('/admin', adminRouter);
// router.use('/orders', orderRouter);
// router.use('/payments', paymentRouter);
// router.use('/products', productRouter);
// router.use('/reviews', reviewRouter);
// router.use('/cart', cartRouter);
// router.use('/categories', categoryRouter);
// router.use('/wishlist', WishlistRouter);



export default router