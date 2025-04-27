// frontend/src/components/user/MyOrders.jsx
import React from "react";
import { useFetch } from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";

export const MyOrders = () => {
  const [orders, isLoading, error] = useFetch("/order/my-orders");
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-orange-50 p-6 pt-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">Loading Orders...</h2>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center pt-24">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p>{error?.response?.data?.message || "Failed to load orders."}</p>
        </div>
      </div>
    );
  }

  if (!orders?.orders?.length) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">No Orders Found</h2>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <button
            onClick={() => navigate("/product")}
            className="btn btn-primary"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 p-6 pt-24">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">
          Your Order History
        </h2>
        <div className="space-y-6">
          {orders.orders.map((order) => (
            <div
              key={order._id}
              className="bg-white bg-opacity-50 backdrop-blur-lg rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="font-medium text-gray-600">Order ID:</span>
                  <p className="text-lg font-semibold">{order._id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <p className="text-lg font-semibold capitalize">{order.status}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Total:</span>
                  <p className="text-lg font-semibold">
                    ₹{order.amountTotal.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <span className="font-medium text-gray-600">Items:</span>
                <ul className="list-disc pl-5">
                  {order.products.map((item, index) => (
                    <li key={index} className="text-gray-700">
                      {item.name} (x{item.quantity}) - ₹{item.price.toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => navigate(`/user/order/${order._id}`)}
                className="mt-4 btn btn-outline btn-primary"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;