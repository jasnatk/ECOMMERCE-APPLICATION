import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  try {
    const { products, address, paymentMethod, totalAmount } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }

    // Validate and enrich products
    const enrichedProducts = await Promise.all(
      products.map(async (item) => {
        if (!mongoose.Types.ObjectId.isValid(item.productId)) {
          throw new Error(`Invalid product ID: ${item.productId}`);
        }
        const productDoc = await Product.findById(item.productId).select("name price image");
        if (!productDoc) {
          throw new Error(`Product not found with ID: ${item.productId}`);
        }
        if (!mongoose.Types.ObjectId.isValid(item.seller)) {
          throw new Error(`Invalid seller ID: ${item.seller}`);
        }

        return {
          productId: item.productId,
          seller: item.seller,
          quantity: item.quantity,
          name: productDoc.name,
          price: productDoc.price,
          image: productDoc.image,
        };
      })
    );

    // Validate totalAmount
    const calculatedTotal = enrichedProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return res.status(400).json({ message: "Total amount mismatch" });
    }

    const order = new Order({
      user: req.user.id,
      products: enrichedProducts,
      address,
      paymentMethod,
      amountTotal: totalAmount,
    });

    const createdOrder = await order.save();
    res.status(201).json({ message: "Order created successfully", order: createdOrder });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    // Fetch orders and pre-filter products with valid productId
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    // Clean orders by filtering valid productId values
    const cleanedOrders = await Promise.all(
      orders.map(async (order) => {
        const validProducts = await Promise.all(
          order.products.map(async (product) => {
            if (!mongoose.Types.ObjectId.isValid(product.productId)) {
              console.warn(`Invalid productId in order ${order._id}: ${product.productId}`);
              return null;
            }
            const productDoc = await Product.findById(product.productId).select("name price image");
            if (!productDoc) {
              console.warn(`Product not found for ID in order ${order._id}: ${product.productId}`);
              return null;
            }
            return {
              ...product,
              productId: productDoc, // Replace productId with populated data
            };
          })
        );
        return {
          ...order,
          products: validProducts.filter((p) => p !== null),
        };
      })
    );

    // Populate seller data
    const populatedOrders = await Order.populate(cleanedOrders, {
      path: "products.seller",
      select: "storeName",
    });

    res.status(200).json({ orders: populatedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).lean();
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Filter valid products
    const validProducts = await Promise.all(
      order.products.map(async (product) => {
        if (!mongoose.Types.ObjectId.isValid(product.productId)) {
         
          return null;
        }
        const productDoc = await Product.findById(product.productId).select("name price image");
        if (!productDoc) {
          console.warn(`Product not found for ID in order ${order._id}: ${product.productId}`);
          return null;
        }
        return {
          ...product,
          productId: productDoc,
        };
      })
    );

    const cleanedOrder = {
      ...order,
      products: validProducts.filter((p) => p !== null),
    };

    // Populate seller
    const populatedOrder = await Order.populate(cleanedOrder, {
      path: "products.seller",
      select: "storeName",
    });

    res.status(200).json(populatedOrder);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to cancel this order" });
    }
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Only pending orders can be canceled" });
    }
    order.status = "cancelled";
    await order.save();
    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error canceling order", error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    const cleanedOrders = await Promise.all(
      orders.map(async (order) => {
        const validProducts = await Promise.all(
          order.products.map(async (product) => {
            if (!mongoose.Types.ObjectId.isValid(product.productId)) {
              console.warn(`Invalid productId in order ${order._id}: ${product.productId}`);
              return null;
            }
            const productDoc = await Product.findById(product.productId).select("name price image");
            if (!productDoc) {
              console.warn(`Product not found for ID in order ${order._id}: ${product.productId}`);
              return null;
            }
            return {
              ...product,
              productId: productDoc,
            };
          })
        );
        return {
          ...order,
          products: validProducts.filter((p) => p !== null),
        };
      })
    );

    const populatedOrders = await Order.populate(cleanedOrders, [
      { path: "user", select: "name email" },
      { path: "products.seller", select: "storeName" },
    ]);

    res.status(200).json(populatedOrders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

export const updateSellerProductStatus = async (req, res) => {
  try {
    const { orderId, productIndex, status } = req.body;
    const sellerId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const product = order.products[productIndex];
    if (!product || product.seller.toString() !== sellerId) {
      return res.status(403).json({ message: "Product not found or unauthorized" });
    }

    order.products[productIndex].status = status;
    await order.save();

    res.status(200).json({ message: "Product status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating product status", error: error.message });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.seller.id;

    const allOrders = await Order.find({ "products.seller": sellerId })
      .sort({ createdAt: -1 })
      .lean();

    const cleanedOrders = await Promise.all(
      allOrders.map(async (order) => {
        const validProducts = await Promise.all(
          order.products
            .filter((p) => p?.seller?.toString() === sellerId)
            .map(async (product) => {
              if (!mongoose.Types.ObjectId.isValid(product.productId)) {
                console.warn(`Invalid productId in order ${order._id}: ${product.productId}`);
                return null;
              }
              const productDoc = await Product.findById(product.productId).select("name price image");
              if (!productDoc) {
                console.warn(`Product not found for ID in order ${order._id}: ${product.productId}`);
                return null;
              }
              return {
                ...product,
                productId: productDoc,
              };
            })
        );
        const filteredProducts = validProducts.filter((p) => p !== null);
        if (filteredProducts.length === 0) return null;
        return {
          ...order,
          products: filteredProducts,
        };
      })
    );

    const populatedOrders = await Order.populate(cleanedOrders.filter((o) => o !== null), {
      path: "products.seller",
      select: "storeName",
    });

    res.status(200).json(populatedOrders);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ message: "Server error fetching seller orders", error: error.message });
  }
};