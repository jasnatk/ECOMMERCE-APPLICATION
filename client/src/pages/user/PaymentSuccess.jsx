import { useEffect, useState } from "react";
import { axiosInstance } from "../../config/axiosInstance";

const PaymentSuccess = () => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");

    if (sessionId) {
      axiosInstance
        .get(`/payment/session/${sessionId}`)
        .then((res) => setOrder(res.data.session))
        .catch((err) => setError(err.response?.data?.message || "Failed to fetch order"));
    }
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎉 Payment Successful</h1>
      <p><strong>Payment ID:</strong> {order.payment_intent}</p>
      <p><strong>Status:</strong> {order.payment_status}</p>
      <p><strong>Total Paid:</strong> ₹{(order.amount_total / 100).toLocaleString()}</p>
      <h3 className="text-xl mt-4">🛒 Items:</h3>
      <ul className="list-disc ml-6">
        {order.line_items?.data?.map((item, idx) => (
          <li key={idx}>{item.quantity} x {item.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentSuccess;
