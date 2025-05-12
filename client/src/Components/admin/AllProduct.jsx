import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiUsers, FiShoppingBag, FiList, FiBox, FiX } from 'react-icons/fi';

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

// AllProduct Component
const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product/productList`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setProducts(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 pt-16 transition-all duration-300 flex justify-center">
        <div className="w-full max-w-[90%] sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
          <main className="p-4 sm:p-6 md:p-8">
            <h1 className="text-xl sm:text-2xl font-bold text-purple-700 dark:text-white mb-4 sm:mb-6 flex items-center justify-center">
              <FiBox className="mr-2 text-xl sm:text-2xl" /> All Products
            </h1>

            {loading && (
              <p className="text-base sm:text-lg text-gray-_relay_600 dark:text-gray-200 animate-pulse text-center">
                Loading products...
              </p>
            )}

            {error && (
              <div className="text-base sm:text-lg text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 p-4 rounded-lg text-center">
                Error: {error}
                <button
                  onClick={() => {
                    setLoading(true);
                    setError(null);
                    fetchProducts();
                  }}
                  className="ml-4 text-blue-600 dark:text-blue-400 underline text-sm sm:text-base"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && (
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">
                  All Products
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full table-fixed text-xs sm:text-sm">
                    <caption className="sr-only">List of all products</caption>
                    <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                      <tr>
                        <th scope="col" className="px-2 sm:px-4 py-2 text-left font-semibold uppercase text-xs sm:text-sm w-[60px] sm:w-[80px]">
                          Image
                        </th>
                        <th scope="col" className="px-2 sm:px-4 py-2 text-left font-semibold uppercase text-xs sm:text-sm w-[120px] sm:w-[200px]">
                          Name
                        </th>
                        <th scope="col" className="px-2 sm:px-4 py-2 text-left font-semibold uppercase text-xs sm:text-sm w-[80px]">
                          Price
                        </th>
                        <th scope="col" className="px-2 sm:px-4 py-2 text-left font-semibold uppercase text-xs sm:text-sm w-[100px] sm:w-[120px]">
                          Category
                        </th>
                        <th scope="col" className="px-2 sm:px-4 py-2 text-left font-semibold uppercase text-xs sm:text-sm w-[60px]">
                          Stock
                        </th>
                        <th scope="col" className="px-2 sm:px-4 py-2 text-left font-semibold uppercase text-xs sm:text-sm w-[120px] sm:w-[200px]">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-2 sm:px-4 py-6 text-center text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                            No products found
                          </td>
                        </tr>
                      ) : (
                        products.map((product) => (
                          <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-2 sm:px-4 py-2">
                              {product.images?.[0]?.url ? (
                                <img
                                  src={product.images[0].url}
                                  alt={product.name}
                                  className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded border border-gray-300 dark:border-gray-600"
                                  onError={(e) => (e.target.src = '/placeholder.jpg')}
                                />
                              ) : (
                                <img
                                  src="/placeholder.jpg"
                                  alt="No image available"
                                  className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded border border-gray-300 dark:border-gray-600"
                                />
                              )}
                            </td>
                            <td
                              className="px-2 sm:px-4 py-2 text-gray-800 dark:text-white truncate text-xs sm:text-sm max-w-[120px] sm:max-w-[200px]"
                              title={product.name}
                            >
                              {product.name}
                            </td>
                            <td className="px-2 sm:px-4 py-2 text-gray-800 dark:text-white text-xs sm:text-sm">
                              ₹{product.price.toFixed(2)}
                            </td>
                            <td
                              className="px-2 sm:px-4 py-2 text-gray-800 dark:text-white text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[120px]"
                              title={product.category}
                            >
                              {product.category}
                            </td>
                            <td className="px-2 sm:px-4 py-2 text-gray-800 dark:text-white text-xs sm:text-sm">
                              {product.stock}
                            </td>
                            <td
                              className="px-2 sm:px-4 py-2 text-gray-800 dark:text-white text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[200px]"
                              title={product.description}
                            >
                              {product.description}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllProduct;