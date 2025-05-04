// src/pages/admin/AdminOrders.jsx

import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../config/axiosInstance';
import { FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AdminHeader } from '../../Components/admin/AdminHeader';
import { Sidebar } from '../../Components/admin/AdminDashboard';

const OrderDetails = ({ order }) => {
  return (
    <td colSpan="6" className="bg-gray-100 dark:bg-gray-800 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Products Table */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Products</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {order.products.map((product, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-contain rounded" />
                      ) : 'N/A'}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{product.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{product.quantity}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">${product.price.toFixed(2)}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{product.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Info */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Order Information</h4>
          <div className="text-sm text-gray-700 dark:text-gray-200 space-y-2">
            <p><strong>Address:</strong><br />{order.address?.name}, {order.address?.email}, {order.address?.phone}<br />{order.address?.line1}, {order.address?.line2}<br />{order.address?.city}, {order.address?.state}, {order.address?.postal_code}, {order.address?.country}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
            <p><strong>Currency:</strong> {order.currency}</p>
            <p><strong>Stripe Session ID:</strong> {order.stripeSessionId || 'N/A'}</p>
            <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Reviewed by Admin:</strong> {order.reviewedByAdmin ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </td>
  );
};

const OrderRow = ({ order, handleReviewOrder, toggleDetails, isExpanded }) => {
  return (
    <>
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{order._id}</td>
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{order.user?.name || 'N/A'}</td>
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">${order.amountTotal.toFixed(2)}</td>
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{order.status}</td>
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{order.products.length}</td>
        <td className="px-6 py-4 text-sm flex items-center space-x-2">
          <button
            onClick={() => handleReviewOrder(order._id)}
            disabled={order.reviewedByAdmin}
            className={`px-2 py-1 rounded text-white ${order.reviewedByAdmin ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {order.reviewedByAdmin ? 'Reviewed' : 'Review'}
          </button>
          <button
            onClick={() => toggleDetails(order._id)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
          </button>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <OrderDetails order={order} />
        </tr>
      )}
    </>
  );
};

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('order/');
      const sanitized = Array.isArray(res.data)
        ? res.data.map(order => ({ ...order, products: order.products || [] }))
        : [];
      setOrders(sanitized);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 500
          ? 'Server error'
          : err.response?.status === 401 || err.response?.status === 403
          ? 'Unauthorized'
          : 'Failed to load orders');
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewOrder = async (orderId) => {
    try {
      await axiosInstance.put(`order/${orderId}/review`);
      setOrders(prev => prev.map(o => (o._id === orderId ? { ...o, reviewedByAdmin: true } : o)));
      toast.success('Order reviewed');
    } catch (err) {
      toast.error('Failed to review order');
    }
  };

  const toggleDetails = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
      >
        <div className="text-xl font-semibold text-gray-700 dark:text-white animate-pulse">Loading Orders...</div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Error</h2>
          <p className="text-gray-700 dark:text-gray-200">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 pt-16 lg:ml-64">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        <main className="p-6">
          <h1 className="text-2xl font-bold text-purple-700 dark:text-white flex items-center mb-6">
            <FiPackage className="mr-2" /> All Orders
          </h1>
          {orders.length === 0 ? (
            <div className="text-center py-16 text-gray-600 dark:text-gray-300">
              <FiPackage className="w-10 h-10 mx-auto mb-4" />
              No orders found.
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-left text-gray-600 dark:text-gray-300">Order ID</th>
                      <th className="px-6 py-3 text-xs font-semibold text-left text-gray-600 dark:text-gray-300">Customer</th>
                      <th className="px-6 py-3 text-xs font-semibold text-left text-gray-600 dark:text-gray-300">Total</th>
                      <th className="px-6 py-3 text-xs font-semibold text-left text-gray-600 dark:text-gray-300">Status</th>
                      <th className="px-6 py-3 text-xs font-semibold text-left text-gray-600 dark:text-gray-300">Items</th>
                      <th className="px-6 py-3 text-xs font-semibold text-left text-gray-600 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {orders.map(order => (
                      <OrderRow
                        key={order._id}
                        order={order}
                        handleReviewOrder={handleReviewOrder}
                        toggleDetails={toggleDetails}
                        isExpanded={expandedOrderId === order._id}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </motion.div>
  );
};
