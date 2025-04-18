// OrderPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";

const OrderPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await axiosInstance.get(`/order/${orderId}`);
      setOrder(res.data.order);
    };

    fetchOrder();
  }, [orderId]);

  if (!order) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Order Summary</h2>
      <p>Status: {order.status}</p>
      <p>Total: ₹{order.totalAmount}</p>
      <p>Address: {order.address}</p>
      <ul className="mt-4">
        {order.products.map((item) => (
          <li key={item.product._id}>
            {item.product.name} — Qty: {item.quantity} — ₹{item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderPage;
