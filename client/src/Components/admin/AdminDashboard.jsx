import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiUsers, FiShoppingBag, FiList, FiBox, FiX, FiUserPlus, FiUserX, FiUserMinus } from 'react-icons/fi';
import { axiosInstance } from '../../config/axiosInstance';
import toast from 'react-hot-toast';
import { AdminHeader } from './AdminHeader';

// StatsCard Component
const StatsCard = ({ title, value, icon, color }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center justify-center h-32 w-full border border-gray-200">
    <div className={`text-3xl ${color} mb-2`}>{icon}</div>
    <div className="text-center">
      <div className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</div>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

// Sidebar Component (from first code)
export const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { to: '/admin/admindashboard', label: 'Dashboard', icon: <FiList /> },
    { to: '/admin/manage-sellers', label: 'Sellers', icon: <FiShoppingBag /> },
    { to: '/admin/products', label: 'Products', icon: <FiBox /> },
    { to: '/admin/orders', label: 'Orders', icon: <FiPackage /> },
    { to: '/admin/users', label: 'Customers', icon: <FiUsers/> },
  ];

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-8 border-b border-gray-700">
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
              <span className="mr-3">{item.icon}</span>
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

// RecentOrdersTable Component
const RecentOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const res = await axiosInstance.get('order/');
        const sanitized = Array.isArray(res.data)
          ? res.data
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
              .map(order => ({
                id: order._id,
                customer: order.user?.name || 'N/A',
                total: order.amountTotal.toFixed(2),
                status: order.status,
              }))
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

    fetchRecentOrders();
  }, []);

  if (loading) {
    return <div className="text-center py-4 text-gray-600 dark:text-gray-300">Loading recent orders...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600 dark:text-red-400">{error}</div>;
  }

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Recent Orders
      </h2>
      {orders.length === 0 ? (
        <div className="text-center py-4 text-gray-600 dark:text-gray-300">No recent orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ₹{order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// AdminDashboard Component
export const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [sellerCount, setSellerCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch orders
        const orderRes = await axiosInstance.get('order/');
        const orders = Array.isArray(orderRes.data) ? orderRes.data : [];
        setOrderCount(orders.length);
        // Calculate total sales by summing amountTotal
        const salesSum = orders.reduce((sum, order) => sum + (order.amountTotal || 0), 0);
        setTotalSales(salesSum.toFixed(2));

        // Fetch sellers
        const sellerRes = await axiosInstance.get('/admin/sellers');
        const sellers = Array.isArray(sellerRes.data.sellers) ? sellerRes.data.sellers : [];
        setSellerCount(sellers.length);

        // Fetch customers
        const customerRes = await axiosInstance.get('/admin/users');
        const customers = Array.isArray(customerRes.data.users) ? customerRes.data.users : [];
        setCustomerCount(customers.length);
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          (err.response?.status === 500
            ? 'Server error'
            : err.response?.status === 401 || err.response?.status === 403
            ? 'Unauthorized'
            : 'Failed to load dashboard stats');
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-700 dark:text-white animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Error</h2>
          <p className="text-gray-700 dark:text-gray-200">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 md:ml-64 pt-16 transition-all duration-300">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        <main className="p-6">
          <h1 className="text-2xl font-bold text-purple-700 dark:text-white mb-6">
            DASHBOARD
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Sales"
              value={`₹${totalSales}`}
              icon={<span>₹</span>}
              color="text-green-600"
            />
            <StatsCard
              title="Orders"
              value={orderCount}
              icon={<FiPackage />}
              color="text-blue-600"
            />
            <StatsCard
              title="Customers"
              value={customerCount}
              icon={<FiUsers />}
              color="text-purple-600"
            />
            <StatsCard
              title="All Sellers"
              value={sellerCount}
              icon={<FiShoppingBag />}
              color="text-green-600"
            />
          </div>
          <RecentOrdersTable />
        </main>
      </div>
    </div>
  );
};