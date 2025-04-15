import React, { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { axiosInstance } from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";

export const CartPage = () => {
  const [cartData, isLoading, error, refetch] = useFetch("/cart/getCart");
  const errorMessage = error?.response?.data?.message || "Unable to fetch cart";
  const [isCartEmpty, setIsCartEmpty] = useState(false);
  const navigate = useNavigate();

  // Refetch cart data after clearing cart or removing an item
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
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

      const products = cartData?.products.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        description: item.productId.description || "No description",
        price: item.productId.price,
        quantity: item.quantity,
      }));

      const session = await axiosInstance.post("/payment/create-checkout-session", {
        products,
        success_url: `${window.location.origin}/payment-success`,
        cancel_url: `${window.location.origin}/payment-cancel`,
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
    }
  };

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl font-semibold text-red-600">{errorMessage}</p>
      </div>
    );

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl font-semibold text-gray-600 animate-pulse">Loading cart...</p>
      </div>
    );

  if ((cartData?.products?.length === 0 && !isCartEmpty) || isCartEmpty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <h2
          className="text-4xl font-bold text-gray-800 mb-4"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Your Cart is Empty
        </h2>
        <p className="text-lg text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
        <button
          onClick={() => navigate("/product")}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl font-bold text-gray-800 mb-8 text-center"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Your Shopping Cart
        </h2>

        <div className="flex justify-end mb-6">
          {cartData?.products?.length > 0 && (
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
            >
              <FaTrashAlt />
              Clear Cart
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_50px] bg-gray-100 p-4 font-semibold text-gray-700">
                <span>Item</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span></span>
              </div>
              {cartData?.products?.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_50px] items-center gap-4 p-4 border-t hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                  <img
                  className="h-20 w-20 object-cover rounded-md shadow-sm"
                  src={item?.productId?.images?.[0]?.url}
                  alt={item?.productId?.name}
                      />

                    <span className="font-medium text-gray-800">{item?.productId?.name}</span>
                  </div>
                  <span className="text-gray-700">₹{item?.productId?.price.toLocaleString()}</span>
                  <span className="text-gray-700">{item?.quantity}</span>
                  <span className="text-gray-700 font-semibold">
                    ₹{(item?.productId?.price * item?.quantity).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleRemove(item?.productId?._id)}
                    className="text-red-600 hover:text-red-800 transition-all duration-200"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3
                className="text-2xl font-semibold text-gray-800 mb-6"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Payment Summary
              </h3>
              <div className="flex justify-between mb-3 text-gray-700">
                <span>Total Items</span>
                <span className="font-medium">{cartData?.products?.length || 0}</span>
              </div>
              <div className="flex justify-between mb-6 text-gray-700">
                <span>Total Price</span>
                <span className="text-xl font-bold text-gray-800">
                  ₹
                  {cartData?.products
                    ?.reduce((total, item) => total + item?.productId?.price * item?.quantity, 0)
                    .toLocaleString()}
                </span>
              </div>
              <button
                onClick={makePayment}
                disabled={cartData?.products?.length === 0}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};