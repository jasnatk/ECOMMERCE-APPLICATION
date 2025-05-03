import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMenu, FiX, FiDollarSign, FiPackage, FiUsers, FiShoppingBag, FiBox, FiList } from 'react-icons/fi';
import { AdminHeader } from './AdminHeader';

// DarkMode Component
const DarkMode = () => {
  const [darkMode, setDarkMode] = useState(false);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
};

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

// Sidebar Component
const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { to: '/admin/admindashboard', label: 'Dashboard', icon: <FiList /> },
    { to: '/admin/manage-sellers', label: 'Sellers', icon: <FiUsers /> },
    { to: '/admin/products', label: 'Products', icon: <FiBox /> },
    { to: '/admin/orders', label: 'Orders', icon: <FiPackage /> },
    { to: '/admin/customers', label: 'Customers', icon: <FiUsers /> },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between p-8 border-b border-gray-700">
        <button onClick={() => setIsOpen(false)} className="lg:hidden">
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
  );
};


// RecentOrdersTable Component
const RecentOrdersTable = () => {
  const orders = [
    { id: '1234', customer: 'John Doe', total: '$150.00', status: 'Pending' },
    { id: '1235', customer: 'Jane Smith', total: '$89.99', status: 'Shipped' },
  ];

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Recent Orders
      </h2>
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
                  {order.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// AdminDashboard Component
export const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen  bg-gray-100 dark:bg-gray-900 flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 lg:ml-12  pt-16 transition-all duration-300">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        <main className="p-6 mt-">
          <h1 className="text-2xl font-bold text-purple-700 dark:text-white mb-6">
             DASHBOARD
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Sales"
              value="12,345"
              icon={<FiDollarSign />}
              color="text-green-600"
            />
            <StatsCard
              title="New Orders"
              value="24"
              icon={<FiPackage />}
              color="text-blue-600"
            />
            <StatsCard
              title="Customers"
              value="1,234"
              icon={<FiUsers />}
              color="text-purple-600"
            />
            <StatsCard
              title="All Sellers"
              value="32"
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