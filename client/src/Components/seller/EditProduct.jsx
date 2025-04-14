import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";
import { toast } from "react-hot-toast";
import { useFetch } from "../../hooks/useFetch";

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
  const fallbackImage = "https://via.placeholder.com/80?text=No+Image";

  useEffect(() => {
    if (productDetails) {
      setUpdatedProduct({
        name: productDetails.name,
        price: productDetails.price,
        description: productDetails.description,
        images: productDetails.images || [], // Keep as [{ url, public_id }]
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
      console.log("existingImages", updatedProduct.images);
console.log("existingImages (stringified)", JSON.stringify(updatedProduct.images));


      await axiosInstance.put(`/product/update-product/${id}`, formData);
      toast.success("Product updated successfully");
      navigate(`/seller/products`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  if (isLoading) return <p>Loading product details...</p>;
  if (error) return <p>Error fetching product details.</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-3xl p-6">
      <h1
        className="text-2xl font-bold mb-4"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        Edit Product
      </h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2" htmlFor="name">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={updatedProduct.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2" htmlFor="price">
            Price (₹)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={updatedProduct.price}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={updatedProduct.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows="4"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2" htmlFor="images">
            Upload New Images
          </label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="p-2"
          />
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Current Images</h3>
          <div className="flex flex-wrap gap-3">
            {updatedProduct.images?.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.url || fallbackImage}
                  alt={`product-image-${index}`}
                  className="w-20 h-20 object-cover rounded"
                  onError={(e) => (e.target.src = fallbackImage)}
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs"
                  onClick={() => handleDeleteImage(img)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;