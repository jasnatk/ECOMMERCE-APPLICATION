import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rating } from "./Rating";
import { axiosInstance } from "../../config/axiosInstance";
import { toast } from "react-hot-toast";
import { FaShoppingCart } from "react-icons/fa";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";

export const ProductCard = ({
  products,
  showDescription = false,
  isInWishlist = false,
  onToggle,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist);
  const [rating, setRating] = useState(products?.rating || 0);
  const [reviewCount, setReviewCount] = useState(0);
  const navigate = useNavigate();
  const fallbackImage = "https://placehold.co/300x300?text=No+Image&font=roboto";

  useEffect(() => {
    setIsWishlisted(isInWishlist);
  }, [isInWishlist]);

  const handleAddToCart = async () => {
    try {
      await axiosInstance.post("/cart/addToCart", {
        productId: products?._id,
        quantity,
      });
      toast.success("Product added to cart");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to add product to cart"
      );
    }
  };

  const handleWishlistToggle = async () => {
    try {
      const res = await axiosInstance.put(`/wishlist/toggle/${products?._id}`);
      setIsWishlisted((prev) => !prev);
      toast.success(res.data.message);
      if (onToggle) onToggle(products._id);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      if (error?.response?.status === 401) {
        toast.error("Please log in to use wishlist");
      } else {
        toast.error("Failed to update wishlist");
      }
    }
  };

  const handleRatingChange = (newRating, newReviewCount) => {
    setRating(newRating);
    setReviewCount(newReviewCount);
  };

  const imageUrl = products?.images?.[0]?.url || fallbackImage;

  return (
    <div className="card bg-base-100 shadow-sm group transform hover:scale-102 transition-transform duration-300 w-full max-w-xs ">
      <div className="relative bg-base-200 w-full">
        <img
          src={imageUrl}
          alt={products?.name || "Product"}
          className="w-full max-h-80 object-contain rounded-md transform group-hover:scale-105 transition-transform duration-300"
          onClick={() => navigate(`/productDetails/${products?._id}`)}
          onError={(e) => {
            console.warn(`Failed to load image for ${products?.name}: ${imageUrl}`);
            e.target.src = fallbackImage;
          }}
        />
        <div
          className="absolute top-2 right-2 p-1 bg-base-100 rounded-full shadow-sm cursor-pointer"
          onClick={handleWishlistToggle}
        >
          {isWishlisted ? (
            <IoMdHeart className="text-teal-500 text-xl" />
          ) : (
            <IoMdHeartEmpty className="text-base-content/50 text-xl" />
          )}
        </div>
      </div>

      <div className="p-3 space-y-2">
        <h2
          className="card-title text-sm font-semibold text-base-content line-clamp-2 cursor-pointer font-playfair"
          onClick={() => navigate(`/productDetails/${products?._id}`)}
        >
          {products?.name}
        </h2>

        {showDescription && (
          <p className="text-xs text-base-content/70 line-clamp-2">{products?.description}</p>
        )}

      <div className="flex flex-col items-center justify-center space-y-1">
       <p className="text-teal-600 font-bold text-lg">
        ₹{products?.price?.toLocaleString()}
      </p>
     <Rating
        initialRating={rating}
         onRatingChange={handleRatingChange}
         className="text-xs"
        />
      </div>


        <button
          className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm py-2 rounded-md hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center"
          onClick={handleAddToCart}
        >
          <FaShoppingCart className="mr-2 text-sm" /> Add to Cart
        </button>
      </div>
    </div>
  );
};