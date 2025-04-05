import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {ProductCard} from '../../Components/user/Cards';
import { ProductCardSkeltons } from '../../Components/user/Skeltons';
import { axiosInstance } from '../../config/axiosInstance';

export const Product = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const category = queryParams.get('category'); // Get category from URL
  const searchQuery = queryParams.get('search'); // Get search query from URL (new change)

  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        // Modified API call to include search parameter
        const response = await axiosInstance.get('/product/productList', {
          params: {
            category: category,    // Pass category if it exists
            search: searchQuery    // Pass search query if it exists
          }
        });

        setProductList(response.data.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchQuery, location.search]); // Re-fetch on category or search query change

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
        {category 
          ? `Shop ${category}${category === "Men" || category === "Women" ? "'s" : ""} Fashion` 
          : searchQuery 
          ? `Search results for "${searchQuery}"` // Display search query in title
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
