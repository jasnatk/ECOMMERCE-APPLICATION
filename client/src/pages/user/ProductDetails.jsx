import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { axiosInstance } from "../../config/axiosInstance";
import { toast } from "react-hot-toast";

export const ProductDetails = () => {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const [productDetails, isLoading, error] = useFetch(
    `/product/productDetails/${params?.id}`
  );
  const [currentImage, setCurrentImage] = useState("");
  const fallbackImage = "https://via.placeholder.com/300?text=No+Image";

  // Set the first image URL when product details load
  useEffect(() => {
    if (productDetails?.images && productDetails.images.length > 0) {
      setCurrentImage(productDetails.images[0].url);
    } else {
      setCurrentImage(fallbackImage);
    }
  }, [productDetails]);

  const handleAddToCart = async () => {
    try {
      await axiosInstance.post("/cart/addToCart", {
        productId: params?.id,
        quantity,
      });
      toast.success("Product added to cart");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to add product to cart");
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 0) {
      setQuantity(value);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600 animate-pulse">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">Error fetching product details: {error}</p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-3xl p-6 my-10">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Product Image */}
        <div className="md:w-1/2">
          <img
            src={currentImage}
            alt={productDetails?.name || "Product"}
            className="w-full h-auto rounded-xl object-cover"
            onError={(e) => {
              console.warn(`Failed to load image: ${currentImage}`);
              e.target.src = fallbackImage;
            }}
          />
          {/* Thumbnail Gallery */}
          <div className="flex space-x-2 mt-4 overflow-x-auto">
            {productDetails?.images?.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`thumbnail-${index}`}
                className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                  currentImage === img.url ? "border-blue-500" : "border-transparent"
                }`}
                onClick={() => setCurrentImage(img.url)}
                onError={(e) => {
                  console.warn(`Failed to load thumbnail: ${img.url}`);
                  e.target.src = fallbackImage;
                }}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {productDetails?.name}
          </h1>
          <p className="text-2xl text-gray-700 mb-4">
            ₹{productDetails?.price?.toLocaleString()}
          </p>
          <p className="text-gray-600 mb-6">{productDetails?.description}</p>

          {/* Quantity Selector */}
          <div className="mb-4 flex items-center">
            <label htmlFor="quantity" className="mr-2 text-lg font-semibold">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              className="w-16 text-center border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-all duration-300"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;