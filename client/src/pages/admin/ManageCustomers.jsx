import React, { useState, useEffect } from 'react';
import { FiUserX, FiUserMinus, FiUsers, FiPackage, FiShoppingBag, FiList, FiBox, FiX } from 'react-icons/fi';
import { axiosInstance } from '../../config/axiosInstance';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AdminHeader } from '../../Components/admin/AdminHeader';

// Sidebar Component (Copied from AdminOrders for consistency)
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
        className={`fixed inset-y-0 left-0 z-30 w-56 bg-gray-900 text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:sticky md:top-0 md:h-screen transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={() => setIsOpen(false)} className="md:hidden">
            <FiX className="text-2xl" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center p-2 rounded-lg hover:bg-gray-700 ${index === 0 ? 'mt-3' : ''}`}
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

// ManageCustomers Component
export const ManageCustomers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axiosInstance.get('/admin/users');
        const users = Array.isArray(res.data.users) ? res.data.users : [];
        setCustomers(users);
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          (err.response?.status === 500
            ? 'Server error'
            : err.response?.status === 401 || err.response?.status === 403
            ? 'Unauthorized'
            : 'Failed to load customers');
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Handle deactivate user
  const handleDeactivate = async (userId) => {
    try {
      await axiosInstance.put(`/admin/deactivate/${userId}`);
      setCustomers(
        customers.map((customer) =>
          customer._id === userId ? { ...customer, isActive: false } : customer
        )
      );
      toast.success('User deactivated successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to deactivate user';
      toast.error(msg);
    }
  };

  // Handle delete user
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axiosInstance.delete(`/admin/delete/${userId}`);
        setCustomers(customers.filter((customer) => customer._id !== userId));
        toast.success('User deleted successfully');
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to delete user';
        toast.error(msg);
      }
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
      >
        <div className="text-base sm:text-lg font-semibold text-gray-700 dark:text-white animate-pulse">
          Loading Customers...
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
            onClick={() => window.location.reload()}
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
              <FiUsers className="mr-2 text-xl sm:text-2xl" /> Manage Customers
            </h1>
            {customers.length === 0 ? (
              <div className="text-center py-8 sm:py-16 text-gray-600 dark:text-gray-300">
                <FiUsers className="w-8 sm:w-10 h-8 sm:h-10 mx-auto mb-4" />
                <p className="text-base sm:text-lg">No customers found.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs sm:text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold uppercase text-gray-600 dark:text-gray-300 w-[120px] sm:w-[150px]">
                          Name
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold uppercase text-gray-600 dark:text-gray-300 w-[150px] sm:w-[200px]">
                          Email
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold uppercase text-gray-600 dark:text-gray-300 w-[100px] sm:w-[120px] hidden sm:table-cell">
                          Phone
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold uppercase text-gray-600 dark:text-gray-300 w-[150px] sm:w-[200px] hidden md:table-cell">
                          Address
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold uppercase text-gray-600 dark:text-gray-300 w-[80px]">
                          Status
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold uppercase text-gray-600 dark:text-gray-300 w-[100px]">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {customers.map((customer) => (
                        <tr key={customer._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td
                            className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 dark:text-white truncate max-w-[120px] sm:max-w-[150px]"
                            title={customer.name}
                          >
                            {customer.name}
                          </td>
                          <td
                            className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-[200px]"
                            title={customer.email}
                          >
                            {customer.email}
                          </td>
                          <td
                            className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 dark:text-white truncate max-w-[100px] sm:max-w-[120px] hidden sm:table-cell"
                            title={customer.phoneNumber || 'N/A'}
                          >
                            {customer.phoneNumber || 'N/A'}
                          </td>
                          <td
                            className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-[200px] hidden md:table-cell"
                            title={customer.address || 'N/A'}
                          >
                            {customer.address || 'N/A'}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 dark:text-white">
                            {customer.isActive ? (
                              <span className="px-2 py-1 text-xs sm:text-sm text-green-700 bg-green-100 dark:bg-green-700 dark:text-white rounded">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs sm:text-sm text-red-700 bg-red-100 dark:bg-red-700 dark:text-white rounded">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-900 dark:text-white flex space-x-2">
                            <button
                              onClick={() => handleDeactivate(customer._id)}
                              className={`p-1 sm:p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs sm:text-sm ${
                                !customer.isActive ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              title="Deactivate"
                              disabled={!customer.isActive}
                            >
                              <FiUserMinus size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(customer._id)}
                              className="p-1 sm:p-2 bg-red-500 hover:bg-red-600 text-white rounded text-xs sm:text-sm"
                              title="Delete"
                            >
                              <FiUserX size={16} />
                            </button>
                          </td>
                        </tr>
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

export default ManageCustomers;