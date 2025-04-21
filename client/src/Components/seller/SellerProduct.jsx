import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const fallbackImage = "https://via.placeholder.com/100?text=No+Image";

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/seller/me");
      setProducts(res.data.products || []);
    } catch (err) {
      toast.error("Failed to load products", { duration: 4000 });
    }
  };

  const handleDelete = (productId) => {
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl flex flex-col gap-6 border border-white/30 max-w-md mx-auto"
        role="alertdialog"
        aria-labelledby="delete-confirm-title"
        aria-describedby="delete-confirm-desc"
      >
        <h3 id="delete-confirm-title" className="text-2xl font-bold text-gray-800">
          Confirm Deletion
        </h3>
        <p id="delete-confirm-desc" className="text-gray-600 leading-relaxed">
          Are you sure you want to delete this product? This action is permanent and cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toast.dismiss(t.id)}
            className="px-6 py-2 text-sm bg-gray-200/80 text-gray-800 rounded-full hover:bg-gray-300/80 transition-all duration-300 backdrop-blur-sm"
            aria-label="Cancel deletion"
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
                toast.success("Product deleted successfully", { duration: 4000 });
                toast.dismiss(t.id);
                fetchProducts();
              } catch (err) {
                toast.dismiss(deletingToast);
                toast.error(err.response?.data?.message || "Failed to delete", { duration: 4000 });
              }
            }}
            className="px-6 py-2 text-sm bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full hover:from-red-600 hover:to-pink-700 transition-all duration-300"
            aria-label="Confirm deletion"
          >
            Delete
          </motion.button>
        </div>
      </motion.div>
    ), {
      duration: Infinity,
      style: { background: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(8px)" },
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-900 p-6 flex items-center justify-center"
    >
      <div className="max-w-6xl w-full bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="flex justify-between items-center mb-8">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold text-white"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Your Products
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/seller/products/new")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm font-medium"
            aria-label="Add new product"
          >
            + Add Product
          </motion.button>
        </div>

        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-white/80"
          >
            <p className="text-lg">No products found.</p>
            <p className="mt-2">Add a new product to get started!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/seller/products/new")}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Add Product
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-300 flex flex-col"
                  role="article"
                  aria-labelledby={`product-${product._id}-name`}
                >
                  <img
                    src={product.images?.[0]?.url || fallbackImage}
                    alt={product.name || "Product"}
                    className="w-full h-48 object-contain rounded-xl border border-white/20 mb-4"
                    onError={(e) => {
                      console.warn(
                        `Failed to load image for ${product.name}: ${product.images?.[0]?.url}`
                      );
                      e.target.src = fallbackImage;
                    }}
                  />
                  <h3
                    id={`product-${product._id}-name`}
                    className="text-xl font-semibold text-white truncate"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {product.name}
                  </h3>
                  <p className="text-white/80 mt-2">
                    <span className="font-medium">Price:</span> ₹{product.price?.toLocaleString()}
                  </p>
                  <div className="mt-4 flex gap-3 flex-wrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/seller/products/edit/${product._id}`)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-full hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 text-sm font-medium"
                      aria-label={`Edit ${product.name}`}
                    >
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full hover:from-red-600 hover:to-pink-700 transition-all duration-300 text-sm font-medium"
                      aria-label={`Delete ${product.name}`}
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SellerProducts;