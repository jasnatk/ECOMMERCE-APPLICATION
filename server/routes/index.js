import express from "express"
import userRouter from './userRoutes.js'
import sellerRouter from "./sellerRoutes.js"
import adminRouter from './adminRoutes.js'
import productRouter from './productRoutes.js'
import cartRouter from './cartRoutes.js'
import reviewRouter from './reviewRoutes.js'
import orderRouter from './orderRoutes.js'
import WishlistRouter from './WishlistRoutes.js'
import categoryRouter from './categoryRoutes.js'
import paymentRouter from "./payment.js";


const router = express.Router();

router.use("/user", userRouter);
router.use('/seller', sellerRouter);
router.use('/admin', adminRouter);
router.use('/product', productRouter);
router.use('/cart', cartRouter);
router.use('/review', reviewRouter);
router.use('/order', orderRouter);
router.use('/wishlist', WishlistRouter);
router.use('/categories', categoryRouter);
router.use("/payment", paymentRouter);




export default router