import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../config/axiosInstance';
import { FiPackage, FiChevronDown, FiChevronUp, FiUsers, FiShoppingBag, FiList, FiBox, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AdminHeader } from '../../Components/admin/AdminHeader';
import { Link } from 'react-router-dom';

// Sidebar Component (Copied from AdminDashboard for consistency)
export const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { to: '/admin/admindashboard', label: 'Dashboard', icon: <FiList /> },
    { to: '/admin/manage-sellers', label: 'Sellers', icon: <FiShoppingBag /> },
    { to: '/admin/products', label: 'Products', icon: <FiBox /> },
    { to: '/admin/orders', label: 'Orders', icon: <FiPackage /> },
    { to: '/admin/users', label: 'Customers', icon: <FiUsers /> },
  ];

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-30 w-56 bg-gray-900 text-white pt-4 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:sticky md:top-0 md:h-screen transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={() => setIsOpen(false)} className="md:hidden">
            <FiX className="text-2xl" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center p-2 rounded-lg hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <span className="ml-1 mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

// OrderDetails Component
const OrderDetails = ({ order }) => {
  return (
    <td colSpan="6" className="bg-gray-100 dark:bg-gray-800 p-4 sm:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Products Table */}
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Products</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 sm:px-6 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[60px] sm:w-[80px]">
                    Image
                  </th>
                  <th className="px-4 sm:px-6 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[120px] sm:w-[200px]">
                    Name
                  </th>
                  <th className="px-4 sm:px-6 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[80px]">
                    Quantity
                  </th>
                  <th className="px-4 sm:px-6 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[80px]">
                    Price
                  </th>
                  <th className="px-4 sm:px-6 py-2 text-left text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-[100px]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {order.products.map((product, index) => (
                  <tr key={index}>
                    <td className="px-4 sm:px-6 py-2 whitespace-nowrap">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-12 sm:w-16 h-12 sm:h-16 object-contain rounded border border-gray-300 dark:border-gray-600" />
                      ) : (
                        <span className="text-xs sm:text-sm text-gray-900 dark:text-white">N/A</span>
                      )}
                    </td>
                    <td
                      className="px-4 sm:px-6 py-2 text-xs sm:text-sm text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-[200px]"
                      title={product.name}
                    >
                      {product.name}
                    </td>
                    <td className="px-4 sm:px-6 py-2 text-xs sm:text-sm text-gray-900 dark:text-white">{product.quantity}</td>
                    <td className="px-4 sm:px-6 py-2 text-xs sm:text-sm text-gray-900 dark:text-white">₹{product.price.toFixed(2)}</td>
                    <td className="px-4 sm:px-6 py-2 text-xs sm:text-sm text-gray-900 dark:text-white">{product.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Info */}
        <div>
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Order Information</h4>
          <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 space-y-2">
            <p>
              <strong>Address:</strong><br />
              {order.address?.name}, {order.address?.email}, {order.address?.phoneNumber}<br />
              {order.address?.line1}, {order.address?.line2}<br />
              {order.address?.city}, {order.address?.state}, {order.address?.postal_code}, {order.address?.country}
            </p>
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

// OrderRow Component
const OrderRow = ({ order, handleReviewOrder, toggleDetails, isExpanded }) => {
  return (
    <>
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
        <td
          className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 dark:text-white truncate max-w-[100px] sm:max-w-[150px]"
          title={order._id}
        >
          {order._id}
        </td>
        <td
          className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-[200px]"
          title={order.user?.name || 'N/A'}
        >
          {order.user?.name || 'N/A'}
        </td>
        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 dark:text-white">₹{order.amountTotal.toFixed(2)}</td>
        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 dark:text-white">{order.status}</td>
        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 dark:text-white">{order.products.length}</td>
        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm flex items-center space-x-2">
          <button
            onClick={() => handleReviewOrder(order._id)}
            disabled={order.reviewedByAdmin}
            className={`px-2 sm:px-3 py-1 rounded text-white text-xs sm:text-sm ${
              order.reviewedByAdmin ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {order.reviewedByAdmin ? 'Reviewed' : 'Review'}
          </button>
          <button
            onClick={() => toggleDetails(order._id)}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            {isExpanded ? <FiChevronUp size={16} sm:size={20} /> : <FiChevronDown size={16} sm:size={20} />}
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

// AdminOrders Component
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
        <div className="text-base sm:text-lg font-semibold text-gray-700 dark:text-white animate-pulse">
          Loading Orders...
        </div>
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
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded shadow text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Error</h2>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm sm:text-base"
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 dark:bg-gray-900 flex"
    >
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 pt-16 transition-all duration-300 flex justify-center">
        <div className="w-full max-w-[90%] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
          <AdminHeader setSidebarOpen={setSidebarOpen} />
          <main className="p-4 sm:p-6 md:p-8">
            <h1 className="text-xl sm:text-2xl font-bold text-purple-700 dark:text-white mb-4 sm:mb-6 flex items-center justify-center">
              <FiPackage className="mr-2 text-xl sm:text-2xl" /> All Orders
            </h1>
            {orders.length === 0 ? (
              <div className="text-center py-8 sm:py-16 text-gray-600 dark:text-gray-300">
                <FiPackage className="w-8 sm:w-10 h-8 sm:h-10 mx-auto mb-4" />
                <p className="text-base sm:text-lg">No orders found.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs sm:text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold uppercase text-gray-600 dark:text-gray-300 w-[100px] sm:w-[150px]">
                          Order ID
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold uppercase text-gray-600 dark:text-gray-300 w-[120px] sm:w-[200px]">
                          Customer
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold uppercase text-gray-600 dark:text-gray-300 w-[80px]">
                          Total
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold uppercase text-gray-600 dark:text-gray-300 w-[100px]">
                          Status
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold uppercase text-gray-600 dark:text-gray-300 w-[80px]">
                          Items
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold uppercase text-gray-600 dark:text-gray-300 w-[120px]">
                          Actions
                        </th>
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
      </div>
    </motion.div>
  );
};

export default AdminOrders;