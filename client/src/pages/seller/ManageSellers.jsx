import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiUsers, FiPackage, FiShoppingBag, FiList, FiBox, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { AdminHeader } from "../../Components/admin/AdminHeader";

// Sidebar Component (unchanged)
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

// Updated ManageSellers Component
const ManageSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await axiosInstance.get("/admin/sellers");
        setSellers(res.data.sellers || []);
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to fetch sellers";
        toast.error(msg);
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  const handleVerifySeller = async (sellerId) => {
    try {
      const res = await axiosInstance.put(`/admin/sellers/${sellerId}/verify`);
      setSellers((prevSellers) =>
        prevSellers.map((seller) =>
          seller._id === sellerId ? { ...seller, isVerified: res.data.seller.isVerified } : seller
        )
      );
      toast.success(res.data.message);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update seller verification";
      toast.error(msg);
    }
  };

  const handleBlockSeller = async (sellerId) => {
    try {
      const res = await axiosInstance.put(`/admin/sellers/${sellerId}/block`);
      setSellers((prevSellers) =>
        prevSellers.map((seller) =>
          seller._id === sellerId ? { ...seller, isBlocked: res.data.seller.isBlocked, isVerified: res.data.seller.isVerified } : seller
        )
      );
      toast.success(res.data.message);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to toggle block status";
      toast.error(msg);
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
          Loading Sellers...
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
              <FiUsers className="mr-2 text-xl sm:text-2xl" /> All Sellers
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y text-xs sm:text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left font-semibold uppercase text-gray-600 dark:text-gray-300 w-[150px] sm:w-[200px]">
                        Name
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left font-semibold uppercase text-gray-600 dark:text-gray-300 w-[200px] sm:w-[250px]">
                        Email
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left font-semibold uppercase text-gray-600 dark:text-gray-300 w-[120px]">
                        Phone Number
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left font-semibold uppercase text-gray-600 dark:text-gray-300 w-[100px]">
                        Status
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left font-semibold uppercase text-gray-600 dark:text-gray-300 w-[200px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sellers.length > 0 ? (
                      sellers.map((seller) => (
                        <tr key={seller._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td
                            className="px-4 sm:px-6 py-4 text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-[200px]"
                            title={seller.name}
                          >
                            {seller.name}
                          </td>
                          <td
                            className="px-4 sm:px-6 py-4 text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-[250px]"
                            title={seller.email}
                          >
                            {seller.email}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-gray-900 dark:text-white">
                            {seller.phoneNumber || 'N/A'}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-gray-900 dark:text-white">
                            {seller.isBlocked ? (
                              <span className="px-2 py-1 text-xs sm:text-sm text-red-700 bg-red-100 dark:bg-red-700 dark:text-white rounded">
                                Blocked
                              </span>
                            ) : seller.isVerified ? (
                              <span className="px-2 py-1 text-xs sm:text-sm text-green-700 bg-green-100 dark:bg-green-700 dark:text-white rounded">
                                Verified
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs sm:text-sm text-yellow-700 bg-yellow-100 dark:bg-yellow-700 dark:text-white rounded">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-gray-900 dark:text-white flex gap-2">
                            <button
                              onClick={() => handleVerifySeller(seller._id)}
                              className={`px-2 sm:px-3 py-1 rounded text-white text-xs sm:text-sm ${
                                seller.isVerified || seller.isBlocked
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-green-500 hover:bg-green-600'
                              }`}
                              disabled={seller.isVerified || seller.isBlocked}
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleBlockSeller(seller._id)}
                              className={`px-2 sm:px-3 py-1 rounded text-white text-xs sm:text-sm ${
                                seller.isBlocked
                                  ? 'bg-blue-500 hover:bg-blue-600'
                                  : 'bg-red-500 hover:bg-red-600'
                              }`}
                            >
                              {seller.isBlocked ? 'Unblock' : 'Block'}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-8 text-gray-600 dark:text-gray-300 text-sm sm:text-base"
                        >
                          No sellers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageSellers;