import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h2 className="text-3xl font-bold mb-4 text-red-600">❌ Payment Canceled</h2>
      <p className="text-lg text-gray-600">Looks like you cancelled the payment.</p>
      <button
        onClick={() => navigate("/cart")}
        className="mt-6 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
      >
        Return to Cart
      </button>
    </div>
  );
};

export default PaymentCancel;
