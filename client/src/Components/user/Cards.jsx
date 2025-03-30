import React from "react";
import { useNavigate } from "react-router-dom";
import { Rating } from "./Rating";

const ProductCard = ({ products }) => {
  const navigate = useNavigate();
  return (
    <div className="card bg-base-100 shadow-xl w-full max-w-xs h-auto">

      <figure>
        <img src={products.image} alt={products.name} className="w-full  object-cover" />
      </figure>
      <div className="card-body space-y-2">
        <h2 className=" line-clamp-2 card-title font-bold">{products.name}</h2>
        
        {/* Truncated Description */}
        <p className="line-clamp-3 text-sm text-gray-700">{products.description}</p>  {/* Truncates to 3 lines */}
       
        <div className="text-center">
          <p className="font-bold text-xl">Price: ₹ {products.price}</p>
        </div>
        <div className="card-actions justify-center space-y-2">
        <Rating/>
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
