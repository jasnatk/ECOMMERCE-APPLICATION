import Order from "../models/orderModel.js";

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const { products, address, paymentMethod, totalAmount } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "No products provided" });
        }

        const order = new Order({
            user: req.user.id, // The logged-in user placing the order
            products,
            address,
            paymentMethod,
            totalAmount,
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
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

// Get a specific order by ID (User/Admin)
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Ensure the user is either the owner of the order or an admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized to view this order" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Error fetching order", error: error.message });
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
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
};
