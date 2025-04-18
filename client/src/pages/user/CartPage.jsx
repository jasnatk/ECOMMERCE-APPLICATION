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
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <p className="text-xl font-semibold text-error">{errorMessage}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-2 lg:px-0 py-4 bg-base-100">
        <p className="text-xl font-semibold text-gray-600 animate-pulse">Loading cart...</p>
      </div>
    );
  }

  if ((cartData?.products?.length === 0 && !isCartEmpty) || isCartEmpty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
        <h2 className="text-4xl font-bold text-base-content mb-4 font-playfair">
          Your Cart is Empty
        </h2>
        <p className="text-lg text-base-content/70 mb-6">Looks like you haven't added any items yet.</p>
        <button
          onClick={() => navigate("/product")}
          className=" bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm p-4 rounded-md hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-base-content text-center mb-4 tracking-tight font-playfair">
          Your Shopping Cart
        </h2>

        <div className="flex justify-end mb-6">
          {cartData?.products?.length > 0 && (
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2  bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded">

              <FaTrashAlt />
              Clear Cart
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="card bg-base-100 shadow-sm">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_50px] bg-base-200 p-4 font-semibold text-base-content">
                <span>Item</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span></span>
              </div>
              {cartData?.products?.map((item) => (
                <div
                  key={item.productId._id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_50px] items-center gap-4 p-4 border-t border-base-200 hover:bg-base-200/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <img
                      className="h-20 w-20 object-contain rounded-md shadow-sm"
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

          {/* Payment Summary */}
          <div className="w-full lg:w-1/3">
            <div className="card bg-base-100 shadow-sm p-6 sticky top-4">
              <h3 className="text-xl font-semibold text-base-content mb-4 font-playfair">
                Payment Summary
              </h3>
              <div className="flex justify-between mb-3 text-base-content/70">
                <span>Total Items</span>
                <span className="font-medium">{cartData?.products?.length || 0}</span>
              </div>
              <div className="flex justify-between mb-6 text-base-content/70">
                <span>Total Price</span>
                <span className="text-xl font-bold text-base-content">
                  ₹
                  {cartData?.products
                    ?.reduce((total, item) => total + item?.productId?.price * item?.quantity, 0)
                    .toLocaleString()}
                </span>
              </div>
              <button
                onClick={makePayment}
                disabled={isPaying || cartData?.products?.length === 0}
                className={`btn btn-success btn-md w-full ${
                  isPaying ? "btn-disabled" : ""
                }`}
              >
                {isPaying ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
