import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const fallbackImage = "https://via.placeholder.com/80?text=No+Image";

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/seller/me");
      setProducts(res.data.products || []);
    } catch (err) {
      toast.error("Failed to load products");
    }
  };

  const handleDelete = (productId) => {
    toast.custom((t) => (
      <div className="bg-white p-4 rounded shadow-md flex flex-col gap-3 border border-gray-200">
        <span className="text-gray-800 font-medium">
          Are you sure you want to delete this product?
        </span>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
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
                toast.error(err.response?.data?.message || "Failed to delete");
              }
            }}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-2xl font-semibold"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Your Products
        </h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/seller/products/new")}
        >
          + Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Item</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="px-4 py-2">
                  <img
                    src={product.images?.[0]?.url || fallbackImage}
                    alt={product.name || "Product"}
                    className="h-16 w-16 object-cover rounded"
                    onError={(e) => {
                      console.warn(`Failed to load image for ${product.name}: ${product.images?.[0]?.url}`);
                      e.target.src = fallbackImage;
                    }}
                  />
                </td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">₹{product.price?.toLocaleString()}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => navigate(`/seller/products/edit/${product._id}`)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerProducts;