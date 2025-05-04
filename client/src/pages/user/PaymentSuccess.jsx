import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const sessionId = new URLSearchParams(window.location.search).get("session_id");
  const [orderId, setOrderId] = useState(null);
  const [isCartCleared, setIsCartCleared] = useState(false);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      if (!sessionId) {
        toast.error("Missing session ID. Cannot process payment.");
        return;
      }

      try {
        // Save order in the database
        const { data } = await axiosInstance.get(`/payment/paymentsuccess?session_id=${sessionId}`);
        setOrderId(data.orderId);

        // Clear the cart
        await axiosInstance.delete("/cart/clearCart");
        setIsCartCleared(true);

        // Update localStorage to reflect empty cart
        localStorage.setItem("cart", JSON.stringify({ products: [] }));

        // Dispatch cartUpdated event to notify UserHeader
        window.dispatchEvent(new Event("cartUpdated"));

        toast.success("Cart cleared successfully!");

        // Redirect to order details after 5 seconds
        setTimeout(() => {
          navigate(`/user/order/${data.orderId}`);
        }, 3000);
      } catch (err) {
        console.error("Error processing payment success:", err.response?.data || err);
        toast.error(err.response?.data?.message || "Failed to process payment. Please try again.");
      }
    };

    if (sessionId) {
      handlePaymentSuccess();
    }
  }, [navigate, sessionId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-22">
      <div className="relative bg-white p-6 rounded-3xl shadow-2xl max-w-sm w-full border-2 border-green-100 transform transition hover:scale-105">
        <div className="flex justify-center">
          <FaCheckCircle className="text-green-500" size={48} />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-green-600 text-center">
          Payment Successful!
        </h1>
        <p className="mt-3 text-base text-gray-600 text-center leading-relaxed">
          Your payment has been processed successfully. Thank you for your order!
        </p>
        <p className="mt-2 text-xs text-gray-500 text-center">
          {isCartCleared ? "Your cart has been cleared." : "Clearing your cart..."} Redirecting to your
          order details in a few seconds...
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            to={orderId ? `/user/order/${orderId}` : "/user/order"}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-200"
          >
            View Order Details Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;