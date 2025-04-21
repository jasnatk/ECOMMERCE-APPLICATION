import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";
import { toast } from "react-hot-toast";
import { useFetch } from "../../hooks/useFetch";
import { motion, AnimatePresence } from "framer-motion";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productDetails, isLoading, error] = useFetch(`/product/productDetails/${id}`);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    price: "",
    description: "",
    images: [], // Array of { url, public_id }
  });
  const [newImages, setNewImages] = useState([]);
  const fallbackImage = "https://via.placeholder.com/100?text=No+Image";

  useEffect(() => {
    if (productDetails) {
      setUpdatedProduct({
        name: productDetails.name,
        price: productDetails.price,
        description: productDetails.description,
        images: productDetails.images || [],
      });
    }
  }, [productDetails]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleDeleteImage = (imgToRemove) => {
    setUpdatedProduct((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.url !== imgToRemove.url),
    }));
  };

  const handleDeleteNewImage = (indexToRemove) => {
    setNewImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", updatedProduct.name);
      formData.append("price", updatedProduct.price);
      formData.append("description", updatedProduct.description);
      newImages.forEach((image) => formData.append("images", image));
      formData.append("existingImages", JSON.stringify(updatedProduct.images));

      await axiosInstance.put(`/product/update-product/${id}`, formData);
      toast.success("Product updated successfully", { duration: 4000 });
      navigate(`/seller/products`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product", { duration: 4000 });
    }
  };

  if (isLoading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white"
      >
        <p className="text-lg">Loading product details...</p>
      </motion.div>
    );
  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white"
      >
        <p className="text-lg">Error fetching product details.</p>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-6 flex items-center justify-center"
    >
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold text-center text-white mb-8"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Edit Product
        </motion.h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 space-y-6">
          {/* Product Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <input
              type="text"
              id="name"
              name="name"
              value={updatedProduct.name}
              onChange={handleInputChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 peer transition-all duration-300"
              required
              placeholder=" "
            />
            <label
              htmlFor="name"
              className="absolute left-3 top-3 text-gray-500 transition-all duration-300 transform peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-blue-600 peer-valid:-top-6 peer-valid:text-sm"
            >
              Product Name
            </label>
          </motion.div>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative"
          >
            <input
              type="number"
              id="price"
              name="price"
              value={updatedProduct.price}
              onChange={handleInputChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 peer transition-all duration-300"
              required
              placeholder=" "
            />
            <label
              htmlFor="price"
              className="absolute left-3 top-3 text-gray-500 transition-all duration-300 transform peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-blue-600 peer-valid:-top-6 peer-valid:text-sm"
            >
              Price (₹)
            </label>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative"
          >
            <textarea
              id="description"
              name="description"
              value={updatedProduct.description}
              onChange={handleInputChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 peer transition-all duration-300 resize-none"
              rows="4"
              placeholder=" "
            />
            <label
              htmlFor="description"
              className="absolute left-3 top-3 text-gray-500 transition-all duration-300 transform peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-6 peer-focus:text-sm peer-focus:text-blue-600 peer-valid:-top-6 peer-valid:text-sm"
            >
              Description
            </label>
          </motion.div>

          {/* Upload New Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <label className="block text-gray-800 font-semibold mb-2" htmlFor="images">
              Upload New Images
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-all duration-300">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16V8m0 0L3 12m4-4l4 4m6 4v-8m0 0l-4-4m4 4l-4 4"
                    />
                  </svg>
                  <p className="mt-1 text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, or GIF (Max 5 images)</p>
                </div>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </motion.div>

          {/* Current Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h3 className="text-gray-800 font-semibold mb-2">Current Images</h3>
            <div className="flex flex-wrap gap-4">
              <AnimatePresence>
                {updatedProduct.images?.map((img, index) => (
                  <motion.div
                    key={`existing-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative"
                  >
                    <img
                      src={img.url || fallbackImage}
                      alt={`product-image-${index}`}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      onError={(e) => (e.target.src = fallbackImage)}
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => handleDeleteImage(img)}
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      aria-label={`Delete image ${index + 1}`}
                    >
                      ✕
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* New Images Preview */}
          {newImages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3 className="text-gray-800 font-semibold mb-2">New Images</h3>
              <div className="flex flex-wrap gap-4">
                <AnimatePresence>
                  {newImages.map((file, index) => (
                    <motion.div
                      key={`new-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`new-image-${index}`}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => handleDeleteNewImage(index)}
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        aria-label={`Delete new image ${index + 1}`}
                      >
                        ✕
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="flex justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm font-medium"
              aria-label="Save product changes"
            >
              Save Changes
            </motion.button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditProduct;