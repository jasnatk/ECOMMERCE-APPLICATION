import React, { useState, useEffect } from 'react';
import { FiBox } from 'react-icons/fi';
import { Sidebar } from './AdminDashboard';

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/product/productList');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 md:ml-64 pt-16 transition-all duration-300">
        <main className="p-4 md:p-8">
          <h1 className=" pb-6 text-2xl font-bold text-purple-700 dark:text-white flex items-center mb-6r">
            <FiBox className="mr-2 text-2xl md:text-2xl " />All Products
          </h1>

          {loading && (
            <p className="text-base text-gray-700 dark:text-gray-200 animate-pulse">
              Loading products...
            </p>
          )}

          {error && (
            <p className="text-base text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 p-4 rounded-lg">
              Error: {error}
            </p>
          )}

          {!loading && !error && (
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                All Products
              </h2>

              <table className="w-full table-fixed text-sm">
                <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <tr>
                    <th className="px-2 py-2 text-left font-semibold uppercase text-xs">Image</th>
                    <th className="px-2 py-2 text-left font-semibold uppercase text-xs">Name</th>
                    <th className="px-2 py-2 text-left font-semibold uppercase text-xs">Price</th>
                    <th className="px-2 py-2 text-left font-semibold uppercase text-xs">Category</th>
                    <th className="px-2 py-2 text-left font-semibold uppercase text-xs">Stock</th>
                    <th className="px-2 py-2 text-left font-semibold uppercase text-xs">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-2 py-6 text-center text-gray-600 dark:text-gray-300">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-2 py-2">
                          {product.images?.[0]?.url ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="h-12 w-12 object-cover rounded border border-gray-300 dark:border-gray-600"
                            />
                          ) : (
                            <div className="h-12 w-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-xs text-gray-500">
                              No Image
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-2 text-gray-800 dark:text-white truncate max-w-[120px]">
                          {product.name}
                        </td>
                        <td className="px-2 py-2 text-gray-800 dark:text-white">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-2 py-2 text-gray-800 dark:text-white">
                          {product.category}
                        </td>
                        <td className="px-2 py-2 text-gray-800 dark:text-white">
                          {product.stock}
                        </td>
                        <td className="px-2 py-2 text-gray-800 dark:text-white max-w-[160px] truncate">
                          {product.description}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AllProduct;
