import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const EditStock = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(true);
  const [productName, setProductName] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/product/${id}`);
        setStock(res.data.stock || 0);
        setProductName(res.data.name || "Product");
      } catch (err) {
        toast.error("Failed to fetch product", { duration: 4000 });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/product/update-stock/${id}`, { stock });
      toast.success("Stock updated successfully", { duration: 4000 });
      navigate("/seller/stock");
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
      className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-6 flex items-center justify-center"
    >
      <div className="max-w-md w-full bg-white backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold text-center text-purple-800 mb-8"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Update Stock - {productName}
        </motion.h2>
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 peer transition-all duration-300"
              required
              min={0}
              placeholder=" "
            />
            <label
              htmlFor="stock"
              className="absolute left-3 top-3 text-gray-500 transition-all duration-300 transform peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-blue-600 peer-valid:-top-6 peer-valid:text-sm"
            >
              Stock Quantity
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
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm font-medium"
              aria-label="Update stock"
            >
              Update
            </motion.button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditStock;