import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ProductCardSkeltons } from "../../Components/user/Skeltons";
import { axiosInstance } from "../../config/axiosInstance";
import { FilterSidebar } from "../../Components/user/Filter";
import {ProductCard} from "../../Components/user/Cards";

export const Product = () => {
  const location = useLocation();
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category") || "";
    const search = queryParams.get("search") || "";

    setFilters((prevFilters) => ({
      ...prevFilters,
      category,
      search,
    }));
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/product/productList", {
          params: filters,
        });
        console.log("Fetched products:", response.data.data); // Debug log
        setProductList(response.data.data || []);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="container mx-auto p-4 flex">
      <div className="p-4 bg-gray-100 shadow-md">
        <FilterSidebar onFilterChange={handleFilterChange} />
      </div>

      <div className="flex-1 p-8">
        {filters.category === "Kids" && (
          <div className="mb-6">
            <img
              src="/image/k1.jpg"
              alt="Kids Fashion Banner"
              className="w-full h-[300px] object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        <h1
          className="text-2xl font-bold text-center mb-6"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {filters.category
            ? `Shop ${filters.category}${filters.category === "Men" || filters.category === "Women" ? "'s" : ""} Fashion`
            : filters.search
            ? `Search results for "${filters.search}"`
            : "Shop the Latest Fashion Trends"}
        </h1>

        {error && <p className="text-red-500 text-center">Error loading products: {error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? [...Array(8)].map((_, index) => <ProductCardSkeltons key={index} />)
            : productList?.map((value) => (
                <ProductCard products={value} key={value?._id} />
              ))}
        </div>
      </div>
    </div>
  );
};