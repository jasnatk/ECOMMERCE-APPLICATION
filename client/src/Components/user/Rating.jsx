import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

export const Rating = ({ initialRating = 0, numReviews = 0, onRatingChange, readonly = false }) => {
  const [rating, setRating] = useState(initialRating);

  const handleStarClick = (starRating) => {
    if (!readonly) {
      setRating(starRating);
      if (onRatingChange) {
        onRatingChange(starRating); // Pass only the rating to parent
      }
    }
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`cursor-pointer text-lg ${
            star <= rating ? "text-yellow-500" : "text-gray-300"
          } ${readonly ? "cursor-default" : ""}`}
          onClick={() => handleStarClick(star)}
        />
      ))}
      <span className="ml-2 text-sm">({numReviews})</span> {/* Display numReviews from prop */}
    </div>
  );
};