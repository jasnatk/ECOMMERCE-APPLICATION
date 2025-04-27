import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "./Cards";
import { WishlistCardSkeltons } from "./WishlistCardSkeltons";
import { toast } from "react-hot-toast";

export const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axiosInstance.get("/wishlist/getAll", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const products = (res.data.data?.products || []).filter(
          (item) => item?.product_id?._id
        );
        setWishlist(products);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await axiosInstance.delete(`/wishlist/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setWishlist((prev) =>
        prev.filter((item) => item?.product_id?._id !== productId)
      );
      toast.success("Product removed from wishlist");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove product");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await axiosInstance.post(
        "/cart/add",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Product added to cart");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-2 lg:px-0 py-4">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-base-content text-center mb-4 tracking-tight font-playfair">
          Your Wishlist
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <WishlistCardSkeltons key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 lg:px-0 py-24">
      <h1 className="text-2xl lg:text-3xl font-extrabold text-base-content text-center mb-4 tracking-tight font-playfair">
        Your Wishlist
      </h1>
      {wishlist.length === 0 ? (
        <p className="text-center text-base text-base-content/70 py-8">
          Your wishlist is empty!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wishlist
            .filter((item) => item?.product_id?._id)
            .map((item) => (
              <ProductCard
                key={item.product_id._id}
                products={item.product_id}
                isInWishlist={true}
                showDescription={false}
                onToggle={(productId) => {
                  setWishlist((prev) =>
                    prev.filter(
                      (product) => product?.product_id?._id !== productId
                    )
                  );
                }}
              />
            ))}
        </div>
      )}
    </div>
  );
};