// src/pages/admin/ManageSellers.jsx

import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiUsers } from "react-icons/fi";
import { AdminHeader } from "../../Components/admin/AdminHeader";
import { Sidebar } from "../../Components/admin/AdminDashboard";

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

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
      >
        <div className="text-xl font-semibold text-gray-700 dark:text-white animate-pulse">
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
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex bg-gray-100 dark:bg-gray-900"
    >
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 pt-16 lg:ml-64">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        <main className="p-6">
          <h1 className="text-2xl font-bold text-purple-700 dark:text-white flex items-center mb-6">
            <FiUsers className="mr-2" /> All Sellers
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Joined On</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sellers.length > 0 ? (
                    sellers.map((seller) => (
                      <tr key={seller._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{seller.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{seller.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {new Date(seller.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {seller.isVerified ? (
                            <span className="px-2 py-1 text-green-700 bg-green-100 dark:bg-green-700 dark:text-white rounded">Verified</span>
                          ) : (
                            <span className="px-2 py-1 text-yellow-700 bg-yellow-100 dark:bg-yellow-700 dark:text-white rounded">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-gray-600 dark:text-gray-300">
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
    </motion.div>
  );
};
export default ManageSellers