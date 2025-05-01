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
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:bg-gray-900 p-6 pt-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-extrabold text-teal-500 dark:text-teal-300 mb-8 text-center tracking-tight">
            Loading Your Orders...
          </h2>
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl shadow-sm"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:bg-gray-900 flex items-center justify-center pt-24">
        <div className="bg-base-200 dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-base-300 dark:border-gray-700 max-w-md w-full">
          <h2 className="text-3xl font-bold text-base-content dark:text-white mb-4">
            Oops, Something Went Wrong
          </h2>
          <p className="text-base-content dark:text-gray-300">
            {error?.response?.data?.message || "Failed to load orders."}
          </p>
          <button
            onClick={() => navigate("/product")}
            className="mt-6 bg-teal-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-teal-600 dark:hover:bg-teal-400 transition-transform duration-300 transform hover:scale-105"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  if (!ordersArray.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:bg-gray-900 flex items-center justify-center pt-24">
        <div className="text-center max-w-md">
          <h2 className="text-4xl font-extrabold text-teal-500 dark:text-teal-300 mb-4 tracking-tight">
            No Orders Yet
          </h2>
          <p className="text-base-content dark:text-gray-300 mb-6 text-lg">
            Looks like you haven't placed any orders. Start shopping now!
          </p>
          <button
            onClick={() => navigate("/product")}
            className="bg-teal-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-teal-600 dark:hover:bg-teal-400 transition-transform duration-300 transform hover:scale-105"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:bg-gray-900 p-6 pt-24">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-teal-700 dark:text-teal-300 mb-10 text-center tracking-tight">
          Your Order History
        </h2>
        <div className="space-y-8">
          {ordersArray.map((order) => (
            <div
              key={order._id}
              className="bg-base-200 dark:bg-gray-800 bg-opacity-90 rounded-xl p-6 shadow-lg border border-base-300 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <span className="font-medium text-base-content dark:text-gray-300">
                    Order ID:
                  </span>
                  <p className="text-lg font-semibold text-base-content dark:text-white truncate">
                    {order._id}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-base-content dark:text-gray-300">
                    Status:
                  </span>
                  <p className="text-lg font-semibold text-teal-500 dark:text-teal-300 capitalize">
                    {order.status}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-base-content dark:text-gray-300">
                    Total:
                  </span>
                  <p className="text-lg font-semibold text-base-content dark:text-white">
                    ₹{order.amountTotal.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <span className="font-medium text-base-content dark:text-gray-300">
                  Items:
                </span>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  {order.products.map((item, index) => (
                    <li
                      key={index}
                      className="text-base-content dark:text-gray-200"
                    >
                      {item.name} (x{item.quantity}) - ₹
                      {item.price.toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => navigate(`/user/order/${order._id}`)}
                className="mt-6 bg-teal-500 text-white font-semibold py-2 px-6 rounded-full hover:bg-teal-600 dark:hover:bg-teal-400 transition-transform duration-300 transform hover:scale-105"
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