import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { ShoppingCart, ChevronDown } from "lucide-react";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        const response = await axiosInstance.get("order/sellerorders");
        console.log("API Response:", response.data); // Debug
        // Handle direct array response
        const sanitizedOrders = Array.isArray(response.data)
          ? response.data.map((order) => ({
              ...order,
              products: Array.isArray(order.products) ? order.products : [],
            }))
          : [];
        setOrders(sanitizedOrders);
        console.log("Sanitized Orders:", sanitizedOrders); // Debug
      } catch (err) {
        console.error("Error fetching seller orders:", err);
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
      const response = await axiosInstance.put("/order/seller-product-status", {
        orderId,
        productIndex,
        status,
      });
      toast.success("Product status updated successfully");
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
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-600 animate-pulse">Loading Orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Order Management</h1>
        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">No Orders Found</h2>
            <p className="text-gray-500 mt-2">You haven't received any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleOrderDetails(order._id)}
                  className="w-full flex justify-between items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
                >
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-800">Order #{order._id.slice(-6)}</h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Total: ₹{order.amountTotal.toLocaleString()}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                        expandedOrder === order._id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>
                {expandedOrder === order._id && (
                  <div className="p-6 bg-white animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-2">Order Details</h4>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Buyer:</span>{" "}
                          {order.user?.name || "Unknown"} ({order.user?.email || "N/A"})
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Status:</span> {order.status}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Payment:</span> {order.paymentStatus} via{" "}
                          {order.paymentMethod}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-md font-semibold text-gray-800 mb-2">Shipping Address</h4>
                        <p className="text-sm text-gray-600">{order.address?.name || "N/A"}</p>
                        <p className="text-sm text-gray-600">
                          {order.address?.line1 || ""}, {order.address?.line2 || ""}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.address?.city || ""}, {order.address?.state || ""}{" "}
                          {order.address?.postal_code || ""}
                        </p>
                        <p className="text-sm text-gray-600">{order.address?.country || "N/A"}</p>
                        <p className="text-sm text-gray-600">{order.address?.phone || "N/A"}</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-800 mb-4">Your Products</h4>
                      <div className="space-y-4">
                        {order.products?.length > 0 ? (
                          order.products.map((product, index) => (
                            <div
                              key={index}
                              className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg"
                            >
                              <img
                                src={product.image || "https://via.placeholder.com/100"}
                                alt={product.name}
                                className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg border border-gray-200"
                                onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
                              />
                              <div className="flex-1">
                                <h5 className="text-md font-semibold text-gray-800">{product.name}</h5>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Quantity:</span> {product.quantity}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Price:</span> ₹
                                  {product.price.toLocaleString()}
                                </p>
                                <div className="mt-2">
                                  <label className="text-sm font-medium text-gray-600">Status:</label>
                                  <select
                                    value={product.status || "pending"}
                                    onChange={(e) =>
                                      handleStatusChange(order._id, index, e.target.value)
                                    }
                                    className="ml-2 p-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No products found in this order.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;