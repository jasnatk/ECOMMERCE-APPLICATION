import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../../Components/user/Cards';
import { ProductCardSkeltons } from '../../Components/user/Skeltons';
import { axiosInstance } from '../../config/axiosInstance';

export const Product = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category'); // Get category from URL

  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(category ? `/product/productList?category=${category}` : "/product/productList");
        setProductList(response.data.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category, location.search]); //  Now re-fetches data on category change

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
        {category 
          ? `Shop ${category}${category === "Men" || category === "Women" ? "'s" : ""} Fashion` 
          : "Shop the Latest Fashion Trends"}
      </h1>

      {error && <p className="text-red-500 text-center">Error loading products: {error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading
          ? [...Array(8)].map((_, index) => <ProductCardSkeltons key={index} />)
          : productList?.map((value) => <ProductCard products={value} key={value?._id} />)}
      </div>
    </div>
  );
};
