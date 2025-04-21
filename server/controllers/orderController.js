import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

export const createOrder = async (req, res) => {
  try {
    const { products, address, paymentMethod, totalAmount } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }

    // Fetch name and price from Product model for each product
    const enrichedProducts = await Promise.all(
      products.map(async (item) => {
        const productDoc = await Product.findById(item.product).select("name price");
        if (!productDoc) {
          throw new Error(`Product not found with ID: ${item.product}`);
        }

        return {
          product: item.product,
          seller: item.seller,
          quantity: item.quantity,
          name: productDoc.name,
          price: productDoc.price,
        };
      })
    );

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


// Get all orders for the logged-in user

export const getMyOrders = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .populate("products.product", "name price image") // populate name, price, image
        .populate("products.seller", "storeName") // optional
        .lean();
  
      res.status(200).json({ orders });
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
  };
  
// Get a specific order by ID (User/Admin)
export const getOrderById = async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId); 
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json(order);
    } catch (err) {
      console.error("Error fetching order:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };

// Cancel an order (User)
export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user._id.toString() !== req.user.id) {
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

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

// Update order status (Admin)
export const updateSellerProductStatus = async (req, res) => {
    try {
      const { orderId, productIndex, status } = req.body;
      const sellerId = req.user.id;
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      // Verify the product at the given index belongs to the seller
      const product = order.products[productIndex];
      if (!product || product.seller.toString() !== sellerId) {
        return res.status(403).json({ message: "Product not found or unauthorized" });
      }
  
      // Update the product status
      order.products[productIndex].status = status;
      await order.save();
  
      res.status(200).json({ message: "Product status updated successfully", order });
    } catch (error) {
      res.status(500).json({ message: "Error updating product status", error: error.message });
    }
  };
// Get orders that include products sold by the logged-in seller


export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.seller.id;

    const allOrders = await Order.find({ 'products.seller': sellerId })
      .sort({ createdAt: -1 })
      .lean();
      
      
    const filteredOrders = allOrders
      .map(order => {
        const sellerProducts = order.products.filter(
          p => p?.seller?.toString() === sellerId
        );
        
        
        // Only return the order if there are matching products
        if (sellerProducts.length === 0) return null;

        return {
          ...order,
          products: sellerProducts,
        };
      })
      .filter(order => order !== null); // remove nulls

    res.status(200).json(filteredOrders);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ message: "Server error fetching seller orders", error: error.message });
  }
};
