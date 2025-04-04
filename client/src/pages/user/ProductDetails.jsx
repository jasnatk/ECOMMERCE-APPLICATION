import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { axiosInstance } from "../../config/axiosInstance";
import { toast } from 'react-hot-toast';

export const ProductDetails = () => {
  const params = useParams();
  const [quantity, setQuantity] = useState(1); // Default quantity to 1
  const [productDetails, isLoading, error] = useFetch(
    `/product/productDetails/${params?.id}`
  );

  const handleAddToCart = async () => {
    try {
        const response = await axiosInstance({
            method: "POST",
            data: { productId: params?.id, quantity },
            url: "/cart/addToCart"
        });
        console.log(response, "=====add to cart RES");
         toast.success("product added to cart");
    } catch (error) {
        console.log(error);
         toast.error(error?.response?.data?.message || "unable to add product to cart");
    }
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value > 0) {
      setQuantity(value); // Set the quantity to the value entered
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching product details.</p>;

  return (
    <div className="flex max-w-4xl mx-auto bg-white shadow-lg rounded-3xl">
      {/* Product Image */}
      <div className="w-1/2">
        <img
          src={productDetails?.image}
          alt="product-image"
          className="w-full h-auto rounded-xl"
        />
      </div>

      {/* Product Info  */}
      <div className="w-1/2 pl-6 flex flex-col justify-center">
        <h1 className="text-2xl font-bold mb-2">{productDetails?.name}</h1>
        <p className="text-xl text-gray-700 mb-4">${productDetails?.price}</p>
        <p className="text-gray-600 mb-6">{productDetails?.description}</p>
        
        {/* Quantity Selector */}
        <div className="mb-4 flex items-center">
          <label htmlFor="quantity" className="mr-2 text-lg">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            className="w-16 text-center border rounded-lg p-2"
          />
        </div>

        <button
          className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
