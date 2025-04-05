import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rating } from "./Rating";
import { axiosInstance } from "../../config/axiosInstance";
import { toast } from 'react-hot-toast';
import { FaShoppingCart } from 'react-icons/fa';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';

export const ProductCard = ({ products, showDescription = false }) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false); // Track wishlist state
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      const response = await axiosInstance.post("/cart/addToCart", {
        productId: products?._id,
        quantity
      });
      toast.success("Product added to cart");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to add product to cart");
    }
  };

  const handleWishlistToggle = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      toast.error("Please login to use wishlist");
      return;
    }
  
    // Proceed to make the API request to toggle wishlist state
    try {
      const response = await axiosInstance.put(`/wishlist/toggle/${products?._id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`, // Correct token passed
        },
      });
  
      // Toggle the wishlist state on success
      setIsWishlisted(prev => !prev);
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };
  

  return (
    <div className="card bg-base-100 shadow-xl w-full max-w-xs h-auto relative">
      {/* Heart icon on top right */}
      <div
        className="absolute top-2 right-2 z-10 cursor-pointer"
        onClick={handleWishlistToggle}
      >
        {isWishlisted ? (
          <IoMdHeart className="text-black text-2xl" />
        ) : (
          <IoMdHeartEmpty className="text-black text-2xl" />
        )}
      </div>

      <figure>
        <img
          src={products.image}
          alt={products.name}
          className="w-full object-cover cursor-pointer"
          onClick={() => navigate(`/productDetails/${products?._id}`)}
        />
      </figure>

      <div className="card-body space-y-2">
        <h2
          className="line-clamp-2 card-title font-medium cursor-pointer"
          onClick={() => navigate(`/productDetails/${products?._id}`)}
        >
          {products.name}
        </h2>

        {showDescription && (
          <p className="line-clamp-3 text-sm text-gray-500">{products.description}</p>
        )}

        <div className="text-center">
          <p className="font-bold text-xl">Price: ₹ {products.price}</p>
        </div>

        <div className="card-actions justify-center space-y-2">
          <Rating />
          <button
            className="btn bg-black text-white w-full flex items-center justify-center"
            onClick={handleAddToCart}
          >
            <FaShoppingCart className="mr-2" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
