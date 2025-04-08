
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";

export const PaymentStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);  // Added loading state

  useEffect(() => {
    if (status === "success") {
      const fetchOrderDetails = async () => {
        try {
          const response = await axiosInstance.get("/order/my-orders");
          setOrderDetails(response.data);
          await axiosInstance.delete("/cart/clearCart");
          toast.success("Thank you! Your order was placed and cart is cleared.");
        } catch (error) {
          console.error("Error fetching order details:", error);
          toast.error("Couldn't fetch order details, please try again.");
        } finally {
          setLoading(false);  // Set loading to false once the request completes
        }
      };

      fetchOrderDetails();
    }
  }, [status]);

  if (loading) {
    return <div>Loading...</div>;  // Show loading message until data is fetched
  }

  if (status === "success") {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-700">Payment Successful!</h1>
        <p className="mb-6">Thank you for your purchase. You will receive a confirmation email shortly.</p>

        {orderDetails && (
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <p><strong>Order Number:</strong> {orderDetails.orderNumber}</p>
            <p><strong>Total Amount:</strong> ${orderDetails.totalAmount}</p>
            <p><strong>Items:</strong> {orderDetails.items.length} items</p>
          </div>
        )}

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
          onClick={() => navigate("/")}
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return null;
};
