import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ products }) => {
  const navigate = useNavigate()
  return (
    <div className="card bg-base-100 shadow-xl w-96">
      <figure>
        <img src={products.image} alt={products.name}  />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{products.name}</h2>
        <p>Price: ₹ {products.price}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary"onClick={()=>navigate(`/productDetails/${products?._id}`)}>View Details</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
