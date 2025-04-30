import React from "react";
import { useFetch } from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";

export const MyOrders = () => {
  const [orders, isLoading, error] = useFetch("/order/my-orders");
  const navigate = useNavigate();

  // Handle different data structures
  const ordersArray = orders?.data?.orders || orders?.orders || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-6 pt-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-extrabold text-teal-500 mb-8 text-center tracking-tight">
            Loading Your Orders...
          </h2>
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl shadow-sm"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center pt-24">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-teal-100 max-w-md w-full">
          <h2 className="text-3xl font-bold text-black mb-4">Oops, Something Went Wrong</h2>
          <p className="text-gray-600">{error?.response?.data?.message || "Failed to load orders."}</p>
          <button
            onClick={() => navigate("/product")}
            className="mt-6 bg-teal-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-teal-600 transition-transform duration-300 transform hover:scale-105"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  if (!ordersArray.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center pt-24">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-extrabold text-teal-500 mb-4 tracking-tight">
            No Orders Yet
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Looks like you haven't placed any orders. Start shopping now!
          </p>
          <button
            onClick={() => navigate("/product")}
            className="bg-teal-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-teal-600 transition-transform duration-300 transform hover:scale-105"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-6 pt-24">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-teal-700 mb-10 text-center tracking-tight">
          Your Order History
        </h2>
        <div className="space-y-8">
          {ordersArray.map((order) => (
            <div
              key={order._id}
              className="bg-white bg-opacity-90 rounded-xl p-6 shadow-lg border border-teal-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <span className="font-medium text-gray-600">Order ID:</span>
                  <p className="text-lg font-semibold text-black truncate">{order._id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <p className="text-lg font-semibold text-teal-500 capitalize">{order.status}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Total:</span>
                  <p className="text-lg font-semibold text-black">
                    ₹{order.amountTotal.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <span className="font-medium text-gray-600">Items:</span>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  {order.products.map((item, index) => (
                    <li key={index} className="text-gray-700">
                      {item.name} (x{item.quantity}) - ₹{item.price.toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => navigate(`/user/order/${order._id}`)}
                className="mt-6 bg-teal-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-teal-600 transition-transform duration-300 transform hover:scale-105"
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