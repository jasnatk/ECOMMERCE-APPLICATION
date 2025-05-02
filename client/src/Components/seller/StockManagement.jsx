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
  const itemsPerPage = 6;

  const navigate = useNavigate();
  const fallbackImage = "https://via.placeholder.com/100?text=No+Image";

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/seller/me");
      setProducts(res.data.products || []);
    } catch (err) {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let data = [...products];

    if (search.trim()) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
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
    setCurrentPage(1); // reset on search/sort change
  }, [products, search, sortKey, sortOrder]);

  const handleDelete = (productId) => {
    toast.custom((t) => (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl flex flex-col gap-6 border border-white/30 max-w-md mx-auto"
      >
        <h3 className="text-2xl font-bold text-gray-800">Confirm Deletion</h3>
        <p className="text-gray-600">
          Are you sure you want to delete this product?
        </p>
        <div className="flex justify-end gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toast.dismiss(t.id)}
            className="px-6 py-2 text-sm bg-gray-200 text-gray-800 rounded-full"
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
              }
            }}
            className="px-6 py-2 text-sm bg-red-500 text-white rounded-full"
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
    <div className="pt-24 min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20">
        <h2 className="text-4xl font-bold text-white text-center mb-6">
          Stock Management
        </h2>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between text-white items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-full w-full md:w-1/3"
          />

          <div className="flex gap-2">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="px-3 py-2 rounded-full"
            >
              <option value="price">Price</option>
              <option value="stock">Stock</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 rounded-full"
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {paginated.length === 0 ? (
          <div className="text-center text-white/80">
            No products found.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {paginated.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/20 rounded-2xl p-5 border border-white/30 flex flex-col"
                >
                  <img
                    src={product.images?.[0]?.url || fallbackImage}
                    alt={product.name}
                    className="w-full h-48 object-contain rounded-xl mb-4 border border-white/20 bg-white/10"
                    onError={(e) => (e.target.src = fallbackImage)}
                  />
                  <h3 className="text-xl font-semibold text-white">
                    {product.name}
                  </h3>
                  <p className="text-white/80 mt-1">₹{product.price}</p>
                  <p className="text-white/80">Stock: {product.stock}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => navigate("update")}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 text-sm"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-full ${
                  currentPage === i + 1
                    ? "bg-white text-indigo-600 font-semibold"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
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
