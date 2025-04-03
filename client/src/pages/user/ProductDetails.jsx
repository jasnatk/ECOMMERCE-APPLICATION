import React from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { axiosInstance } from "../../config/axiosInstance";

export const ProductDetails = () => {
  const params = useParams();
 
  const [productDetails, isLoading, error] = useFetch(
    `/product/productDetails/${params?.id}`
  );

  const handleAddToCart = async () => {
    try {
        const response = await axiosInstance({ method: "POST", data: { productId: params?.id , quantity: 1, }, url: "/cart/addToCart" });
        console.log(response, "=====add to cart RES");
        toast.success("product added to cart");
    } catch (error) {
        console.log(error);
        // toast.error(error?.response?.data?.message || "unable to add product to cart");
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
      
      {/* Product Info */}
      <div className="w-1/2 pl-6 flex flex-col justify-center">
        <h1 className="text-2xl font-bold mb-2">{productDetails?.name}</h1>
        <p className="text-xl text-gray-700 mb-4">${productDetails?.price}</p>
        <p className="text-gray-600 mb-6">{productDetails?.description}</p>
        <button className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
