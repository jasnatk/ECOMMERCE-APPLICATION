import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate
import { FaCheckCircle } from "react-icons/fa";
import { axiosInstance } from "../../config/axiosInstance";

const PaymentSuccess = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const clearUserCart = async () => {
      try {
        console.log("📡 Sending clearCart request...");
        await axiosInstance.delete("/cart/clearCart");
        console.log("✅ Cart cleared on payment success.");
      } catch (err) {
        console.error("❌ Error clearing cart:", err.response?.data || err);
      }
    };
  
    clearUserCart();
  
    const redirectTimeout = setTimeout(() => {
      navigate("/user/order");
    }, 3000);
  
    return () => clearTimeout(redirectTimeout);
  }, [navigate]);
  
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative bg-white p-8 sm:p-10 rounded-3xl shadow-2xl max-w-md w-full sm:max-w-lg border-2 border-green-100 transform transition hover:scale-105">
        <div className="flex justify-center">
          <FaCheckCircle
            className="text-green-500 transition-transform duration-500 group-hover:scale-125"
            size={72}
          />
        </div>
        <h1 className="mt-6 text-3xl sm:text-4xl font-bold text-green-600 text-center">
          Payment Successful!
        </h1>
        <p className="mt-4 text-lg text-gray-600 text-center leading-relaxed">
          Your payment has been processed successfully. Thank you for your order!
        </p>
        <p className="mt-2 text-sm text-gray-500 text-center">
          Redirecting to your orders in a few seconds...
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            to="/user/order"
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-200"
          >
            View Order Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;