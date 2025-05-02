import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";
import { toast } from "react-hot-toast";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewBox, setReviewBox] = useState({});
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [isOrderOpen, setIsOrderOpen] = useState(true);
  const [isAddressOpen, setIsAddressOpen] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(`/order/${orderId}?t=${Date.now()}`);
      console.log("Fetched Order:", data);
      setOrder(data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch order:", err);
      setError("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const toggleReviewBox = (index) => {
    setReviewBox((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleRatingChange = (index, value) => {
    setRatings((prev) => ({ ...prev, [index]: value }));
  };

  const handleReviewChange = (index, value) => {
    setReviews((prev) => ({ ...prev, [index]: value }));
  };

  const submitReview = async (productId, index) => {
    try {
      const rating = ratings[index] || 0;
      if (rating < 1 || rating > 5) {
        toast.error("Please select a rating between 1 and 5.");
        return;
      }
      const payload = {
        productId: productId._id || productId,
        rating,
        comment: reviews[index] || "",
      };
      console.log("Submitting review with payload:", payload);
      const response = await axiosInstance.post("/review/add-review", payload);
      console.log("Review response:", response.data);
      toast.success("Review submitted successfully!");
      toggleReviewBox(index);
      console.log("Dispatching reviewSubmitted event");
      window.dispatchEvent(new Event("reviewSubmitted"));
    } catch (err) {
      console.error("Failed to submit review:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to submit review.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="mt-8 h-6 bg-gray-700 rounded w-1/4"></div>
            <div className="mt-4 space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-28 h-28 bg-gray-700 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-700 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Something Went Wrong</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={fetchOrder}
            className="inline-flex items-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-full hover:bg-red-600 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-6 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-green-600 mb-10 text-center tracking-wide">
          Order Details
        </h2>
        <div className="bg-black bg-opacity-50 backdrop-blur-lg rounded-2xl p-2 sm:p-8 inset-shadow-zinc-700">
          {/* Order Summary */}
          <div className="mb-6">
            <button
              onClick={() => setIsOrderOpen(!isOrderOpen)}
              className="flex items-center w-full text-xl font-semibold text-emerald-400 hover:text-white transition-colors duration-200"
            >
              <span>Order Summary</span>
              <svg
                className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${isOrderOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOrderOpen && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 animate-slideIn">
                <div>
                  <span className="text-sm font-medium text-white">Order ID</span>
                  <p className="text-lg font-semibold text-gray-300">{order._id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-white">Status</span>
                  <p className="text-lg font-semibold text-gray-300 capitalize">{order.status}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-white">Payment Status</span>
                  <p className="text-lg font-semibold text-gray-300 capitalize">{order.paymentStatus}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-white">Payment Method</span>
                  <p className="text-lg font-semibold text-gray-300">{order.paymentMethod}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-white">Total Amount</span>
                  <p className="text-lg font-semibold text-gray-300">₹{order.amountTotal.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-white">Currency</span>
                  <p className="text-lg font-semibold text-gray-300">{order.currency.toUpperCase()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Address Section */}
          <div className="mb-6">
            <button
              onClick={() => setIsAddressOpen(!isAddressOpen)}
              className="flex items-center w-full text-xl font-semibold text-emerald-400 hover:text-white transition-colors duration-200"
            >
              <span>Shipping Address</span>
              <svg
                className={`ml-2 h-5 w-5 transform transition-transform duration-200 ${isAddressOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isAddressOpen && (
              <div className="mt-4 text-gray-300 space-y-2 animate-slideIn">
                <p>
                  <span className="font-medium">Name:</span> {order.address?.name || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {order.address?.email || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {order.address?.phone || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Address:</span> {order.address?.line1 || "N/A"},{" "}
                  {order.address?.line2 || ""}
                </p>
                <p>
                  <span className="font-medium">City:</span> {order.address?.city || "N/A"}
                </p>
                <p>
                  <span className="font-medium">State:</span> {order.address?.state || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Postal Code:</span>{" "}
                  {order.address?.postal_code || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Country:</span> {order.address?.country || "N/A"}
                </p>
              </div>
            )}
          </div>

          {/* Products List */}
          <h3 className="text-xl font-semibold text-white mb-6">Ordered Items</h3>
          <div className="space-y-6">
            {order.products.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg p-6 flex flex-col sm:flex-row gap-6 border border-gray-700 hover:border-emerald-500 transition-all duration-300 animate-slideIn"
              >
                <img
                  src={item.image || "https://via.placeholder.com/100"}
                  alt={item.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-lg border border-gray-700"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/100")}
                />
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white">{item.name}</h4>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p className="text-gray-300">
                      <span className="font-medium">Quantity:</span> {item.quantity}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Price:</span> ₹{item.price.toLocaleString()}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-medium">Status:</span>{" "}
                      <span className="capitalize">{item.status}</span>
                    </p>
                  </div>

                  <button
                    className="mt-4 inline-flex items-center px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-full hover:bg-emerald-600 transition-all duration-300"
                    onClick={() => toggleReviewBox(index)}
                  >
                    {reviewBox[index] ? "Close Review" : "Add a Review"}
                  </button>

                  {reviewBox[index] && (
                    <div className="mt-6 bg-gray-900 bg-opacity-50 backdrop-blur-lg p-6 rounded-lg border border-gray-700 animate-fadeIn">
                      <h5 className="text-lg font-medium text-white mb-4">Write Your Review</h5>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Rating
                          </label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`cursor-pointer text-2xl transition-transform duration-200 hover:scale-110 ${
                                  (ratings[index] || 0) >= star
                                    ? "text-yellow-400"
                                    : "text-gray-500"
                                }`}
                                onClick={() => handleRatingChange(index, star)}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Review
                          </label>
                          <textarea
                            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                            rows="4"
                            placeholder="Share your thoughts about the product..."
                            value={reviews[index] || ""}
                            onChange={(e) => handleReviewChange(index, e.target.value)}
                          ></textarea>
                        </div>
                        <button
                          className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-full hover:from-emerald-600 hover:to-teal-600 transition-all duration-300"
                          onClick={() => submitReview(item.productId, index)}
                          disabled={!ratings[index] || !reviews[index]?.trim()}
                        >
                          Submit Review
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/user/order/my-orders">
              <button
                className="inline-flex items-center px-6 py-2 bg-emerald-500 text-white font-medium rounded-full hover:bg-emerald-600 transition-all duration-300"
              >
                Order History
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Inline CSS for Animations */}
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
};

export default OrderDetails;