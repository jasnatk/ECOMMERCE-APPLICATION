import React, { useState, useEffect } from "react";
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

  // Use the first image's URL or fallback
  const imageUrl = products?.images?.[0]?.url || fallbackImage;

  return (
    <div className="card bg-base-100 shadow-xl w-full max-w-xs h-auto relative">
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
          src={imageUrl}
          alt={products?.name || "Product"}
          className="w-full object-cover cursor-pointer"
          onClick={() => navigate(`/productDetails/${products?._id}`)}
          onError={(e) => {
            console.warn(`Failed to load image for ${products?.name}: ${imageUrl}`);
            e.target.src = fallbackImage;
          }}
        />
      </figure>

      <div className="card-body space-y-2">
        <h2
          className="line-clamp-2 card-title font-medium cursor-pointer"
          style={{ fontFamily: "Playfair Display, serif" }}
          onClick={() => navigate(`/productDetails/${products?._id}`)}
        >
          {products?.name}
        </h2>

        {showDescription && (
          <p className="line-clamp-3 text-sm text-gray-500">{products?.description}</p>
        )}

        <div className="text-center">
          <p className="font-bold text-xl">₹{products?.price?.toLocaleString()}</p>
        </div>

        <div className="card-actions justify-center space-y-2">
          <Rating
            initialRating={rating}
            onRatingChange={handleRatingChange}
          />
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
