import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { axiosInstance } from "../../config/axiosInstance";
import { toast } from "react-hot-toast";
import { FaShoppingCart, FaPlus, FaMinus } from "react-icons/fa";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { Rating } from "../../Components/user/Rating";

export const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [productDetails, isLoading, error] = useFetch(
    `/product/productDetails/${params?.id}`
  );
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [helpfulFeedback, setHelpfulFeedback] = useState({});
  const [reportingReviewId, setReportingReviewId] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const fallbackImage = "https://placehold.co/300x300?text=No+Image&font=roboto";

  const product = productDetails?.data || {};

  useEffect(() => {
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const response = await axiosInstance.get(`/review/product/${params?.id}`);
        setReviews(response.data.data);
      } catch (err) {
        setReviewsError(err?.response?.data?.message || "Failed to fetch reviews");
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [params?.id]);

  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setCurrentImage(product.images[0].url);
    } else {
      setCurrentImage(fallbackImage);
    }
  }, [product]);

  const handleAddToCartAndNavigate = async () => {
    try {
      const response = await axiosInstance.post("/cart/addToCart", {
        productId: params?.id,
        quantity,
      });
      localStorage.setItem("cart", JSON.stringify({ products: response.data.data.products }));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Product added to cart");
      navigate("/user/cart");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to add product to cart");
    }
  };

  const handleWishlistToggle = async () => {
    try {
      const res = await axiosInstance.put(`/wishlist/toggle/${params?.id}`);
      setIsWishlisted(!isWishlisted);
      toast.success(res.data.message);
      if (res.data.message.includes("added")) {
        navigate("/user/wishlist");
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("Please log in to use wishlist");
      } else {
        toast.error(error?.response?.data?.message || "Failed to update wishlist");
      }
    }
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity(1);
      return;
    }
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setQuantity(parsedValue);
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      const response = await axiosInstance.post(`/review/${reviewId}/helpful`);
      setHelpfulFeedback((prev) => ({
        ...prev,
        [reviewId]: !prev[reportId],
      }));
      toast.success(response.data.message);
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("Please log in to mark reviews as helpful");
      } else {
        toast.error(error?.response?.data?.message || "Failed to mark review as helpful");
      }
    }
  };

  const openReportBox = (reviewId) => {
    setReportingReviewId(reviewId);
    setReportReason("");
  };

  const closeReportBox = () => {
    setReportingReviewId(null);
    setReportReason("");
  };

  const handleReportSubmit = async (reviewId, e) => {
    e.preventDefault();
    if (!reportReason.trim()) {
      toast.error("Please provide a reason for reporting");
      return;
    }

    try {
      const response = await axiosInstance.post(`/review/${reviewId}/report`, {
        reason: reportReason,
      });
      toast.success(response.data.message);
      closeReportBox();
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("Please log in to report reviews");
      } else {
        toast.error(error?.response?.data?.message || "Failed to report review");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <p className="text-xl font-semibold text-teal-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100">
        <p className="text-xl font-semibold text-error">
          Error fetching product details: {error?.response?.data?.message || "Failed to load product"}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 lg:px-0 py-4 pt-24">
      <div className="card bg-base-100 rounded-xl p-6 my-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Product Image */}
          <div className="lg:w-1/2">
            <div className="relative group">
              <img
                src={currentImage}
                alt={product?.name || "Product"}
                className="w-full h-96 object-contain transform group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = fallbackImage;
                }}
                loading="lazy"
              />
            </div>
            <div className="flex justify-center space-x-2 mt-4 overflow-x-auto">
              {product?.images?.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={`thumbnail-${index}`}
                  className={`w-16 h-16 object-cover rounded-xl cursor-pointer border-2 ${
                    currentImage === img.url ? "border-green-900" : "border-base-200"
                  } transform hover:scale-110 transition-transform duration-200`}
                  onClick={() => setCurrentImage(img.url)}
                  onError={(e) => {
                    e.target.src = fallbackImage;
                  }}
                  loading="lazy"
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 flex flex-col justify-center space-y-4">
            <h1 className="text-3xl font-bold text-base-content font-playfair">
              {product?.name || "No Name"}
            </h1>
            <p className="text-2xl text-teal-600 font-semibold">
              ₹{product?.price?.toLocaleString() || "0"}
            </p>
            <div>
              <Rating
                initialRating={product?.rating || 0}
                numReviews={product?.numReviews || 0}
                className="text-xs"
                readonly
              />
            </div>
            <label className="text-base font-semibold text-base-content">
              About this item
            </label>
            <p className="text-base-content/70 text-base">
              {product?.description || "No description available"}
            </p>
            <div className="flex items-center gap-2">
              <label className="text-base font-semibold text-base-content">
                Quantity:
              </label>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleDecrement}
                  className="btn btn-ghost btn-sm"
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  className="input input-bordered input-sm w-16 text-center"
                />
                <button
                  onClick={handleIncrement}
                  className="btn btn-ghost btn-sm"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm py-2 rounded-md hover:from-teal-600 hover:to-teal-700 transition-all duration-300 justify-center btn-md flex-1 flex items-center gap-2"
                onClick={handleAddToCartAndNavigate}
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button
                className="bg-white hover:bg-teal-400 text-teal-800 font-semibold py-2 px-4 border border-teal-400 rounded shadow btn-md flex items-center gap-2"
                onClick={handleWishlistToggle}
              >
                {isWishlisted ? (
                  <IoMdHeart className="text-xl" />
                ) : (
                  <IoMdHeartEmpty className="text-xl" />
                )}
                Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-base-content font-playfair mb-4">
            Customer Reviews
          </h2>
          {reviewsLoading && (
            <p className="text-teal-600">Loading reviews...</p>
          )}
          {reviewsError && (
            <p className="text-error">Error: {reviewsError}</p>
          )}
          {!reviewsLoading && !reviewsError && reviews.length === 0 && (
            <p className="text-base-content/70">No reviews yet for this product.</p>
          )}
          {!reviewsLoading && !reviewsError && reviews.length > 0 && (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b border-base-200 pb-4"
                >
                  <div className="flex items-start gap-4">
                    {/* User Image and Name */}
                    <div className="flex-shrink-0">
                      <div className="relative w-6 h-6 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                        <svg
                          className="absolute w-8 h-8 text-gray-400 -left-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-base-content">
                          {review.user.name}
                        </span>
                      </div>
                      {/* Rating */}
                      <div className="flex items-center gap-4 mt-1">
                        <Rating
                          initialRating={review.rating}
                          className="text-sm"
                          readonly
                          showCount={false}
                        />
                        <span className="font-bold text-base-content uppercase">
                          {review.comment.split(" ")[0] || "Great"}
                        </span>
                      </div>
                      {/* Comment */}
                      <p className="text-base-content mt-2">{review.comment}</p>
                      {/* Date */}
                      <p className="text-sm text-base-content/50 mt-1">
                        Posted on {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      {/* Helpful and Report Buttons */}
                      <div className="flex gap-4 mt-2">
                        <button
                          onClick={() => handleHelpful(review._id)}
                          className="text-sm text-teal-600 hover:text-teal-800 btn btn-sm btn-outline border-gray-300 hover:bg-gray-100"
                          aria-label={
                            helpfulFeedback[review._id]
                              ? "Remove helpful mark"
                              : "Mark review as helpful"
                          }
                        >
                          {helpfulFeedback[review._id]
                            ? "Thank you for your feedback"
                            : "Helpful"}
                        </button>
                        <button
                          onClick={() => openReportBox(review._id)}
                          className="text-sm text-red-600 hover:text-red-800"
                          aria-label="Report this review"
                        >
                          Report
                        </button>
                      </div>
                      {/* Report Box */}
                      {reportingReviewId === review._id && (
                        <div className="mt-3 p-4 border border-base-200 rounded-lg bg-base-100">
                          <form onSubmit={(e) => handleReportSubmit(review._id, e)}>
                            <div className="mb-3">
                              <label
                                htmlFor={`report-reason-${review._id}`}
                                className="block text-sm font-medium text-base-content mb-1"
                              >
                                Reason for Reporting
                              </label>
                              <textarea
                                id={`report-reason-${review._id}`}
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                                placeholder="Explain why you are reporting this review"
                                className="textarea textarea-bordered w-full h-20 resize-none text-sm"
                                required
                                aria-required="true"
                              />
                            </div>
                            <div className="flex justify-end gap-3">
                              <button
                                type="button"
                                onClick={closeReportBox}
                                className="btn btn-ghost btn-sm text-base-content hover:bg-gray-100"
                                aria-label="Cancel reporting"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="btn btn-sm bg-teal-500 text-white hover:bg-teal-600"
                                aria-label="Submit report"
                              >
                                Submit
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;