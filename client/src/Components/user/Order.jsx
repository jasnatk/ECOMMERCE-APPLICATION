import { useEffect, useState } from "react";
import { axiosInstance } from "../../config/axiosInstance";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/order/my-orders");
        setOrders(res.data.orders || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  if (orders.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg text-gray-600">You haven't placed any orders yet.</p>
        <Link
          to="/product"
          className="mt-4 inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Orders</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="mb-6 p-6 bg-white shadow-md rounded-xl border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-600">Order ID: {order._id}</p>
              <p className="text-sm text-gray-500">
                Ordered On: {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
              </p>
            </div>
            <span
              className={`text-sm px-3 py-1 rounded-full font-medium ${
                order.status === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="space-y-4">
            {order.products.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h4 className="font-medium">{item.productId.name}</h4>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">₹{item.productId.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="text-right mt-4 font-bold text-lg">
            Total: ₹{order.amount}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderPage;
