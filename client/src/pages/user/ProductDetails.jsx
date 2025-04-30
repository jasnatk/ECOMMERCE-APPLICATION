import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { axiosInstance } from "../../config/axiosInstance";
import { toast } from "react-hot-toast";
import { FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { Rating } from "../../Components/user/Rating";

export const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [productDetails, isLoading, error] = useFetch(
    `/product/productDetails/${params?.id}`
  );
  const [currentImage, setCurrentImage] = useState("");
  const fallbackImage = "https://placehold.co/300x300?text=No+Image&font=roboto";

  // Access the product data
  const product = productDetails?.data || {};

  // Set the first image URL when product details load
  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setCurrentImage(product.images[0].url);
    } else {
      setCurrentImage(fallbackImage);
    }
  }, [product]);

  // Handle Add to Cart and navigate to cart page
  const handleAddToCartAndNavigate = async () => {
    try {
      await axiosInstance.post("/cart/addToCart", {
        productId: params?.id,
        quantity,
      });
      toast.success("Product added to cart");
      navigate("/user/cart");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to add product to cart");
    }
  };

  // Toggle the wishlist state
  const handleWishlistToggle = async () => {
    try {
      const res = await axiosInstance.put(`/wishlist/toggle/${params?.id}`);
      setIsWishlisted(!isWishlisted);
      toast.success(res.data.message);
      if (res.data.message.includes("added")) {
        navigate("/user/wishlist");
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("Please log in to use wishlist");
      } else {
        toast.error(error?.response?.data?.message || "Failed to update wishlist");
      }
    }
  };

  // Handle quantity increment
  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  // Handle quantity decrement
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Handle manual quantity change
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity(1); // Default to 1 if input is empty
      return;
    }
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setQuantity(parsedValue);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <p className="text-xl font-semibold text-teal-600">Loading...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <p className="text-xl font-semibold text-error">
          Error fetching product details: {error?.response?.data?.message || "Failed to load product"}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 lg:px-0 py-4 pt-24">
      <div className="card bg-base-100 rounded-xl p-6 my-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Product Image */}
          <div className="lg:w-1/2">
            <div className="relative group">
              <img
                src={currentImage}
                alt={product?.name || "Product"}
                className="w-full h-96 object-contain transform group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = fallbackImage;
                }}
                loading="lazy"
              />
            </div>
            {/* Thumbnail Gallery */}
            <div className="flex justify-center space-x-2 mt-4 overflow-x-auto">
              {product?.images?.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={`thumbnail-${index}`}
                  className={`w-16 h-16 object-cover rounded-xl cursor-pointer border-2 ${
                    currentImage === img.url ? "border-green-900" : "border-base-200"
                  } transform hover:scale-110 transition-transform duration-200`}
                  onClick={() => setCurrentImage(img.url)}
                  onError={(e) => {
                    e.target.src = fallbackImage;
                  }}
                  loading="lazy"
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 flex flex-col justify-center space-y-4">
            <h1 className="text-3xl font-bold text-base-content font-playfair">
              {product?.name || "No Name"}
            </h1>
            <p className="text-2xl text-teal-600 font-semibold">
              ₹{product?.price?.toLocaleString() || "0"}
            </p>
            {/* Rating */}
            <div>
              <Rating
                initialRating={product?.rating || 0}
                className="text-xs"
                readonly
              />
            </div>
            <label className="text-base font-semibold text-base-content">
              About this item
            </label>
            <p className="text-base-content/70 text-base">
              {product?.description || "No description available"}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-2">
              <label className="text-base font-semibold text-base-content">
                Quantity:
              </label>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleDecrement}
                  className="btn btn-ghost btn-sm"
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  className="input input-bordered input-sm w-16 text-center"
                />
                <button
                  onClick={handleIncrement}
                  className="btn btn-ghost btn-sm"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm py-2 rounded-md hover:from-teal-600 hover:to-teal-700 transition-all duration-300 justify-center btn-md flex-1 flex items-center gap-2"
                onClick={handleAddToCartAndNavigate}
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button
                className="bg-white hover:bg-teal-400 text-teal-800 font-semibold py-2 px-4 border border-teal-400 rounded shadow btn-md flex items-center gap-2"
                onClick={handleWishlistToggle}
              >
                {isWishlisted ? (
                  <IoMdHeart className="text-xl" />
                ) : (
                  <IoMdHeartEmpty className="text-xl" />
                )}
                Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;