import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { ShoppingCart, ChevronDown } from "lucide-react";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        const response = await axiosInstance.get("order/sellerorders");
        const sanitizedOrders = Array.isArray(response.data)
          ? response.data.map((order) => ({
              ...order,
              products: Array.isArray(order.products) ? order.products : [],
            }))
          : [];
        setOrders(sanitizedOrders);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders. Please try again.");
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchSellerOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleStatusChange = async (orderId, productIndex, status) => {
    try {
      await axiosInstance.put("/order/seller-product-status", {
        orderId,
        productIndex,
        status,
      });
      toast.success("Product status updated");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                products: order.products.map((p, idx) =>
                  idx === productIndex ? { ...p, status } : p
                ),
              }
            : order
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-semibold text-white/90 animate-pulse"
        >
          Loading Orders...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-900">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border border-white/20"
        >
          <h2 className="text-3xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-white/80">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-300 text-sm font-medium"
          >
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="pt-24 min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-900 p-6 flex items-center justify-center"
    >
      <div className="max-w-6xl w-full bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold text-white "
          >
            Order Management
          </motion.h1>
        </div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-white/80"
          >
            <ShoppingCart className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg">No orders received yet.</p>
            <p className="mt-2">You'll see orders once customers start purchasing!</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30"
              >
                <button
                  onClick={() => toggleOrderDetails(order._id)}
                  className="flex justify-between items-center w-full text-left"
                >
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Order #{order._id.slice(-6)}
                    </h3>
                    <p className="text-sm text-white/70">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-6 h-6 text-white transition-transform ${
                      expandedOrder === order._id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {expandedOrder === order._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/90">
                        <div>
                          <h4 className="font-semibold mb-2">Order Details</h4>
                          <p>Buyer: {order.user?.name || "Unknown"} ({order.user?.email || "N/A"})</p>
                          <p>Status: {order.status}</p>
                          <p>Payment: {order.paymentStatus} via {order.paymentMethod}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Shipping Address</h4>
                          <p>{order.address?.name || "N/A"}</p>
                          <p>{order.address?.line1}, {order.address?.line2}</p>
                          <p>{order.address?.city}, {order.address?.state} {order.address?.postal_code}</p>
                          <p>{order.address?.country}</p>
                          <p>{order.address?.phone}</p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-semibold mb-4 text-white">Products</h4>
                        <div className="space-y-4">
                          {order.products.map((product, idx) => (
                            <div
                              key={idx}
                              className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-white/10 rounded-xl"
                            >
                              <img
                                src={product.image || "https://via.placeholder.com/100"}
                                alt={product.name}
                                className="w-24 h-24 object-cover rounded-xl border border-white/30"
                                onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
                              />
                              <div className="flex-1 text-white/90">
                                <h5 className="font-semibold">{product.name}</h5>
                                <p>Quantity: {product.quantity}</p>
                                <p>Price: ₹{product.price.toLocaleString()}</p>

                                <div className="mt-2">
                                  <label className="text-sm mr-2">Status:</label>
                                  <select
                                    value={product.status || "pending"}
                                    onChange={(e) =>
                                      handleStatusChange(order._id, idx, e.target.value)
                                    }
                                    className="p-1 bg-white/20 rounded-md border border-white/30 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SellerOrders;
