import React, { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { axiosInstance } from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";

export const CartPage = () => {
  const [cartData, isLoading, error, refetch] = useFetch("/cart/getCart");
  const [isCartEmpty, setIsCartEmpty] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const navigate = useNavigate();

  const errorMessage = error?.response?.data?.message || "Unable to fetch cart";

  const handleClearCart = async () => {
    try {
      await axiosInstance.delete("/cart/clearCart");
      setIsCartEmpty(true);
      refetch();
      // Update localStorage
      localStorage.setItem("cart", JSON.stringify({ products: [] }));
      window.dispatchEvent(new Event("cartUpdated")); // Notify header
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
      // Update localStorage with current cart data
      const updatedCart = cartData?.products?.filter(item => item.productId._id !== productId) || [];
      localStorage.setItem("cart", JSON.stringify({ products: updatedCart }));
      window.dispatchEvent(new Event("cartUpdated")); // Notify header
      toast.success("Product removed from cart!");
    } catch (error) {
      console.error("Failed to remove product:", error?.response?.data?.message || error.message);
      toast.error(error?.response?.data?.message || "Unable to remove product from cart");
    }
  };

  const makePayment = async () => {
    try {
      setIsPaying(true);
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

      const products = cartData?.products
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
        products,
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
      <div className="min-h-screen bg-base-100 p-4 ">
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

  if ((cartData?.products?.length === 0 && !isCartEmpty) || isCartEmpty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 p-4 ">
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
      <div className="min-h-screen bg-base-100 p-4 md:p-8 ">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-base-content text-center mb-4 tracking-tight font-playfair">
            Your Shopping Cart ({cartData?.products?.length || 0} {cartData?.products?.length === 1 ? "item" : "items"})
          </h2>

          <div className="flex justify-end mb-6">
            {cartData?.products?.length > 0 && (
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
                {cartData?.products?.map((item) => (
                  <div
                    key={item.productId._id}
                    className="flex md:grid md:grid-cols-[2fr_1fr_1fr_1fr_50px] flex-wrap items-center gap-4 p-4 border-t border-base-200 hover:bg-base-200/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <img
                        className="h-16 w-16 md:h-20 md:w-20 object-contain rounded-md shadow-sm"
                        src={item?.productId?.images?.[0]?.url}
                        alt={item?.productId?.name}
                      />
                      <span className="font-medium text-base-content text-sm">{item?.productId?.name}</span>
                    </div>
                    <span className="text-base-content text-sm">₹{item?.productId?.price.toLocaleString()}</span>
                    <span className="text-base-content text-sm">{item?.quantity}</span>
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
                  <span className="font-medium">{cartData?.products?.length || 0}</span>
                </div>
                <div className="flex justify-between mb-6 text-base-content/70 text-sm md:text-base">
                  <span>Total Price</span>
                  <span className="text-lg md:text-xl font-bold text-base-content">
                    ₹
                    {cartData?.products
                      ?.reduce((total, item) => total + item?.productId?.price * item?.quantity, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={makePayment}
                  disabled={isPaying || cartData?.products?.length === 0}
                  className={`btn btn-success btn-md w-full ${isPaying ? "btn-disabled" : ""}`}
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