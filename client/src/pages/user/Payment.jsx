// PaymentSuccess.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";

export const PaymentStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");

  useEffect(() => {
    if (status === "success") {
      const clearCart = async () => {
        try {
          await axiosInstance.delete("/cart/clearCart");
          toast.success("Thank you! Your order was placed and cart is cleared.");
        } catch (error) {
          console.error("Error clearing cart:", error);
          toast.error("Couldn't clear cart, please try again.");
        }
      };

      clearCart();
    }
  }, [status]);

  if (status === "success") {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-700">Payment Successful!</h1>
        <p className="mb-6">Thank you for your purchase. You will receive a confirmation email shortly.</p>
        <button
          className="mt-6 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          onClick={() => navigate("/product")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (status === "cancel") {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-700">Payment Cancelled</h1>
        <p className="mb-6">Your payment was cancelled. You can try again or return to the shop.</p>
        <button
          className="mt-6 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          onClick={() => navigate("/product")}
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return null; // Optionally handle an invalid status or loading state
};
