import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const EditStock = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stockToAdd, setStockToAdd] = useState("");
  const [currentStock, setCurrentStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState("");

  useEffect(() => {
    // Validate product ID
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      toast.error("Invalid product ID", { duration: 4000 });
      navigate("/seller/products/stock");
      return;
    }

    console.log("Product ID in EditStock:", id); // Debug ID

    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/product/productDetails/${id}`);
        console.log("API response in EditStock:", res.data); // Debug response
        const product = res.data.data || res.data; // Handle response structure
        setCurrentStock(product.stock || 0);
        setProductName(product.name || "Product");
      } catch (err) {
        console.error("Error fetching product:", err.response?.data, err.message);
        toast.error("Failed to fetch product", { duration: 4000 });
        navigate("/seller/products/stock"); // Redirect on error
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (stockToAdd < 0) {
      toast.error("Cannot add negative stock", { duration: 4000 });
      return;
    }
    try {
      await axiosInstance.put(`/product/update-stock/${id}`, { stock: Number(stockToAdd) });
      toast.success("Stock updated successfully", { duration: 4000 });
      navigate("/seller/products/stock");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update stock", { duration: 4000 });
    }
  };

  if (loading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white"
      >
        <p className="text-lg">Loading...</p>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 p-4 sm:p-6 md:p-8 flex items-center justify-center"
    >
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-white/20">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl sm:text-3xl font-bold text-center text-purple-800 mb-6 sm:mb-8"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Add Stock - {productName}
        </motion.h2>
        <div className="mb-6 text-center text-gray-600 text-sm sm:text-base">
          <p>Current Stock: {currentStock}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <input
              type="number"
              id="stock"
              value={stockToAdd}
              onChange={(e) => setStockToAdd(e.target.value)}
              className="w-full p-3 sm:p-4 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 peer transition-all duration-300 text-sm sm:text-base"
              required
              min={0}
              placeholder=" "
            />
            <label
              htmlFor="stock"
              className="absolute left-3 top-3 sm:top-4 text-gray-500 transition-all duration-300 transform peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm sm:peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-xs sm:peer-focus:text-sm peer-focus:text-blue-600 peer-valid:-top-6 peer-valid:text-xs sm:peer-valid:text-sm"
            >
              Additional Stock Quantity
            </label>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base font-medium"
              aria-label="Add stock"
            >
              Add Stock
            </motion.button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditStock;