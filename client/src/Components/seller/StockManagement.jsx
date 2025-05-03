import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const Stock = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();
  const fallbackImage = "https://via.placeholder.com/100?text=No+Image";

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/seller/me");
      const fetchedProducts = res.data.products || [];
      // Validate products
      const validProducts = fetchedProducts.filter(
        (product) => product && product._id && typeof product._id === "string"
      );
      console.log("Fetched valid product IDs:", validProducts.map((p) => p._id));
      setProducts(validProducts);
      if (fetchedProducts.length !== validProducts.length) {
        toast.error("Some products were invalid and skipped");
      }
    } catch (err) {
      toast.error("Failed to load products");
      console.error("Error fetching products:", err);
    }
  };

  const validateProduct = async (productId) => {
    try {
      await axiosInstance.get(`/product/productDetails/${productId}`);
      return true;
    } catch (err) {
      console.error(`Error validating product ${productId}:`, err);
      return false;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let data = [...products];

    if (search.trim()) {
      data = data.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    data.sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortKey] - b[sortKey];
      } else {
        return b[sortKey] - a[sortKey];
      }
    });

    setFiltered(data);
    setCurrentPage(1);
  }, [products, search, sortKey, sortOrder]);

  const handleDelete = (productId) => {
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl flex flex-col gap-4 border border-white/30 max-w-sm mx-auto"
      >
        <h3 className="text-xl font-bold text-gray-800">Confirm Deletion</h3>
        <p className="text-gray-600">
          Are you sure you want to delete this product?
        </p>
        <div className="flex justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-1.5 text-sm bg-gray-200 text-gray-800 rounded-full"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={async () => {
              const deletingToast = toast.loading("Deleting...");
              try {
                await axiosInstance.delete(`/product/remove-product/${productId}`);
                toast.dismiss(deletingToast);
                toast.success("Product deleted successfully");
                toast.dismiss(t.id);
                fetchProducts();
              } catch (err) {
                toast.dismiss(deletingToast);
                toast.error("Failed to delete");
                console.error("Error deleting product:", err);
              }
            }}
            className="px-4 py-1.5 text-sm bg-red-500 text-white rounded-full"
          >
            Delete
          </motion.button>
        </div>
      </motion.div>
    ), { duration: Infinity });
  };

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-900 py-24 px-4 sm:px-6 lg:px-14">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-6">
          Stock Management
        </h2>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-full w-full sm:w-1/2 lg:w-1/3 bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base"
          />
          <div className="flex gap-2 w-full sm:w-auto justify-center">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="px-3 py-2 rounded-full bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base"
            >
              <option value="price">Price</option>
              <option value="stock">Stock</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 rounded-full bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base"
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>

        {paginated.length === 0 ? (
          <div className="text-center text-white/80 text-base sm:text-lg">
            No products found.
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <AnimatePresence>
              {paginated.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/20 rounded-2xl p-4 sm:p-5 border border-white/30 flex flex-col hover:bg-white/30 transition-colors duration-200"
                >
                  <img
                    src={product.images?.[0]?.url || fallbackImage}
                    alt={product.name}
                    className="w-full h-32 sm:h-40 lg:h-48 object-contain rounded-lg mb-3 border border-white/20"
                    onError={(e) => (e.target.src = fallbackImage)}
                  />
                  <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                    {product.name}
                  </h3>
                  <p className="text-white/80 text-sm sm:text-base">
                    ₹{product.price}
                  </p>
                  <p className="text-white/80 text-sm sm:text-base">
                    Stock: {product.stock}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={async () => {
                        console.log("Validating product ID:", product._id);
                        const isValid = await validateProduct(product._id);
                        if (isValid) {
                          console.log("Navigating to EditStock for product ID:", product._id);
                          navigate(`/seller/products/edit-stock/${product._id}`);
                        } else {
                          toast.error("Product not found, please refresh");
                          console.error("Product validation failed for ID:", product._id);
                        }
                      }}
                      className="flex-1 px-3 py-1.5 bg-green-500 text-white rounded-full hover:bg-green-600 text-xs sm:text-sm transition-colors duration-200"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 text-xs sm:text-sm transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 rounded-full text-sm sm:text-base ${
                  currentPage === i + 1
                    ? "bg-white text-indigo-600 font-semibold"
                    : "bg-white/20 text-white hover:bg-white/30"
                } transition-colors duration-200`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stock;