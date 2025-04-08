import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

export const Rating = ({ initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);
  const [reviewCount, setReviewCount] = useState(0); // State to track review count

  const handleStarClick = (starRating) => {
    setRating(starRating);
    setReviewCount((prev) => prev + 1); // Increment review count on each rating
    if (onRatingChange) {
      onRatingChange(starRating, reviewCount + 1); // Pass the updated rating and review count to parent
    }
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`cursor-pointer text-lg ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
          onClick={() => handleStarClick(star)}
        />
      ))}
      <span className="ml-2 text-sm">{reviewCount} </span> {/* Display review count */}
    </div>
  );
};
