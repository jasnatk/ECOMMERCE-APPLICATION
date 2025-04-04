import React from "react";
import { useNavigate } from "react-router-dom";
import { Rating } from "./Rating";

const ProductCard = ({ products, showDescription = true }) => {
  const navigate = useNavigate();

  return (
    <div className="card bg-base-100 shadow-xl w-full max-w-xs h-auto">
      <figure>
        <img src={products.image} alt={products.name} className="w-full object-cover" />
      </figure>
      <div className="card-body space-y-2">
        <h2 className="line-clamp-2 card-title font-medium">{products.name}</h2>

        {/* Conditional Description */}
        {showDescription && (
          <p className="line-clamp-3 text-sm text-gray-500">{products.description}</p>
        )}

        <div className="text-center">
          <p className="font-bold text-xl">Price: ₹ {products.price}</p>
        </div>
        <div className="card-actions justify-center space-y-2">
          <Rating />
          <button
            className="btn bg-black text-white w-full"
            onClick={() => navigate(`/productDetails/${products?._id}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
