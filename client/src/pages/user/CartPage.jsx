import React, { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { axiosInstance } from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { FaTrashAlt, FaPlus, FaMinus } from "react-icons/fa";
import toast from "react-hot-toast";

export const CartPage = () => {
  const [cartData, isLoading, error, refetch] = useFetch("/cart/getCart");
  const [isCartEmpty, setIsCartEmpty] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const navigate = useNavigate();

  // Access products from cartData?.data?.products
  const products = cartData?.data?.products || [];

  const errorMessage = error?.response?.data?.message || "Unable to fetch cart";

  const handleClearCart = async () => {
    try {
      await axiosInstance.delete("/cart/clearCart");
      setIsCartEmpty(true);
      refetch();
      localStorage.setItem("cart", JSON.stringify({ products: [] }));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Cart cleared successfully!");
    } catch (err) {
      console.error("Failed to clear cart:", err?.response?.data?.message || err.message);
      toast.error("Failed to clear the cart.");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axiosInstance.put("/cart/removeFromCart", { productId });
      refetch();
      const updatedCart = products.filter((item) => item.productId._id !== productId) || [];
      localStorage.setItem("cart", JSON.stringify({ products: updatedCart }));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Product removed from cart!");
    } catch (error) {
      console.error("Failed to remove product:", error?.response?.data?.message || error.message);
      toast.error(error?.response?.data?.message || "Unable to remove product from cart");
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return; // Prevent quantity from going below 1
    try {
      await axiosInstance.post("/cart/addToCart", {
        productId,
        quantity: quantity - products.find((item) => item.productId._id === productId).quantity, // Send delta
      });
      refetch();
      const updatedCart = products.map((item) =>
        item.productId._id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem("cart", JSON.stringify({ products: updatedCart }));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Quantity updated!");
    } catch (error) {
      console.error("Failed to update quantity:", error?.response?.data?.message || error.message);
      toast.error(error?.response?.data?.message || "Unable to update quantity");
    }
  };

  const makePayment = async () => {
    try {
      setIsPaying(true);
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

      const productsForPayment = products
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          productId: item.productId._id,
          name: item.productId.name,
          description: item.productId.description || "No description",
          price: item.productId.price,
          quantity: item.quantity,
          image: item.productId.images?.[0]?.url || "https://via.placeholder.com/150",
        }));

      const session = await axiosInstance.post("/payment/create-checkout-session", {
        products: productsForPayment,
      });

      if (!session.data.sessionId) {
        throw new Error("Session ID not received from backend.");
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session.data.sessionId,
      });

      if (result.error) {
        toast.error(result.error.message);
      }
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error(error.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setIsPaying(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100 p-4">
        <p className="text-lg md:text-xl font-semibold text-error text-center">{errorMessage}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-6">
            <div className="h-6 md:h-8 w-32 md:w-48 bg-base-200 rounded animate-pulse mb-4"></div>
            <div className="h-8 md:h-10 w-24 md:w-32 bg-base-200 rounded animate-pulse self-end"></div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="w-full">
              <div className="card bg-base-100 shadow-sm">
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_50px] bg-base-200 p-4">
                  {["Item", "Price", "Quantity", "Total", ""].map((_, index) => (
                    <div key={index} className="h-6 bg-base-200 rounded animate-pulse"></div>
                  ))}
                </div>
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="flex md:grid md:grid-cols-[2fr_1fr_1fr_1fr_50px] flex-wrap items-center gap-4 p-4 border-t border-base-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 md:h-20 md:w-20 bg-base-200 rounded-md animate-pulse"></div>
                      <div className="h-4 w-24 md:h-6 md:w-32 bg-base-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-4 w-16 bg-base-200 rounded animate-pulse"></div>
                    <div className="h-4 w-12 bg-base-200 rounded animate-pulse"></div>
                    <div className="h-4 w-16 bg-base-200 rounded animate-pulse"></div>
                    <div className="h-6 w-6 bg-base-200 rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if ((products.length === 0 && !isCartEmpty) || isCartEmpty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-4">
        <h2 className="text-3xl md:text-4xl font-bold text-base-content mb-4 font-playfair text-center">
          Your Cart is Empty
        </h2>
        <p className="text-base md:text-lg text-base-content/70 mb-6 text-center">
          Looks like you haven't added any items yet.
        </p>
        <button
          onClick={() => navigate("/product")}
          className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm md:text-base p-3 md:p-4 rounded-md hover:from-teal-600 hover:to-teal-700 transition-all duration-300"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="pt-24">
      <div className="min-h-screen bg-base-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-base-content text-center mb-4 tracking-tight font-playfair">
            Your Shopping Cart ({products.length} {products.length === 1 ? "item" : "items"})
          </h2>

          <div className="flex justify-end mb-6">
            {products.length > 0 && (
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 text-sm md:text-base bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-3 md:px-4 border border-red-500 hover:border-transparent rounded"
              >
                <FaTrashAlt />
                Clear Cart
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <div className="card bg-base-100 shadow-sm">
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_50px] bg-base-200 p-4 font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm py-2 rounded-md">
                  <span>Item</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                  <span></span>
                </div>
                {products.map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex md:grid md:grid-cols-[2fr_1fr_1fr_1fr_50px] flex-wrap items-center gap-4 p-4 border-t border-base-200 hover:bg-base-200/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <img
                        className="h-16 w-16 md:h-20 md:w-20 object-contain rounded-md shadow-sm cursor-pointer"
                        src={item?.productId?.images?.[0]?.url}
                        alt={item?.productId?.name}
                        onClick={() => navigate(`/productDetails/${item.productId._id}`)}
                        onError={(e) => {
                          console.warn(`Failed to load image for ${item?.productId?.name}: ${item?.productId?.images?.[0]?.url}`);
                          e.target.src = "https://via.placeholder.com/150";
                        }}
                      />
                      <span
                        className="font-medium text-base-content text-sm cursor-pointer hover:text-teal-600"
                        onClick={() => navigate(`/productDetails/${item.productId._id}`)}
                      >
                        {item?.productId?.name}
                      </span>
                    </div>
                    <span className="text-base-content text-sm">₹{item?.productId?.price.toLocaleString()}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                        className="btn btn-ghost btn-sm"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value) && value > 0) {
                            handleQuantityChange(item.productId._id, value);
                          }
                        }}
                        min="1"
                        className="input input-bordered input-sm w-16 text-center"
                      />
                      <button
                        onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                        className="btn btn-ghost btn-sm"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <span className="text-base-content text-sm">
                      ₹{(item?.productId?.price * item?.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleRemove(item?.productId?._id)}
                      className="text-error hover:text-error/80"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-1/3">
              <div className="card bg-base-100 shadow-sm p-4 md:p-6 sticky top-4">
                <h3 className="text-lg md:text-xl font-semibold text-base-content mb-4 font-playfair">
                  Payment Summary
                </h3>
                <div className="flex justify-between mb-3 text-base-content/70 text-sm md:text-base">
                  <span>Total Items</span>
                  <span className="font-medium">{products.length}</span>
                </div>
                <div className="flex justify-between mb-6 text-base-content/70 text-sm md:text-base">
                  <span>Total Price</span>
                  <span className="text-lg md:text-xl font-bold text-base-content">
                    ₹
                    {products
                      .reduce((total, item) => total + item?.productId?.price * item?.quantity, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={makePayment}
                  disabled={isPaying || products.length === 0}
                  className={`w-full py-2 px-4 text-black font-medium rounded-md ${isPaying || products.length === 0 ? "bg-yellow-300 cursor-not-allowed opacity-60" : "bg-yellow-300 hover:bg-yellow-400"
                    }`}
                >
                  {isPaying ? "Processing..." : "Proceed to Checkout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};