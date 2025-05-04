import React, { useState, useEffect } from 'react';
import { FiUserX, FiUserMinus, FiUsers } from 'react-icons/fi';
import { axiosInstance } from '../../config/axiosInstance';
import toast from 'react-hot-toast';
import { Sidebar } from '../../Components/admin/AdminDashboard';
import { AdminHeader } from '../../Components/admin/AdminHeader';

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
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-700 dark:text-white animate-pulse">
          Loading Customers...
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
          <h1 className="text-2xl font-bold text-purple-700 dark:text-white flex items-center mb-6">
                      <FiUsers className="mr-2" /> Manage Customers
                    </h1>
          {customers.length === 0 ? (
            <div className="text-center py-4 text-gray-600 dark:text-gray-300">
              No customers found.
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider truncate">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider truncate">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider truncate hidden sm:table-cell">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider truncate hidden md:table-cell">
                      Address
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider truncate">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider truncate">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {customers.map((customer) => (
                    <tr key={customer._id}>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white truncate max-w-[150px]">
                        {customer.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white truncate max-w-[200px]">
                        {customer.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white truncate max-w-[120px] hidden sm:table-cell">
                        {customer.phoneNumber || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white truncate max-w-[200px] hidden md:table-cell">
                        {customer.address || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white truncate">
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white flex space-x-2">
                        <button
                          onClick={() => handleDeactivate(customer._id)}
                          className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                          title="Deactivate"
                          disabled={!customer.isActive}
                        >
                          <FiUserMinus />
                        </button>
                        <button
                          onClick={() => handleDelete(customer._id)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                          title="Delete"
                        >
                          <FiUserX />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};