import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";
import { ProductCardSkeltons } from "../../Components/user/ProductCardSkeltons";
import { FilterSidebar } from "../../Components/user/Filter";
import { ProductCard } from "../../Components/user/Cards";

export const Product = () => {
  const location = useLocation();
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    minPrice: "",
    maxPrice: "",
  });

  // Updated categoryBannerMap to include "All" category
  const categoryBannerMap = {
    Men: "/image/men1.jpg",
    Women: "/image/one1.jpg",
    Kids: "/image/Kids11.jpg",
    All: "/image/simple.jpg", 
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("category") || "";
    const search = queryParams.get("search") || "";
    const minPrice = queryParams.get("minPrice") || "";
    const maxPrice = queryParams.get("maxPrice") || "";

    const updatedFilters = {
      category,
      search,
      minPrice,
      maxPrice,
    };

    setFilters(updatedFilters);

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/product/productList", {
          params: updatedFilters,
        });
        setProductList(response.data.data || []);
      } catch (err) {
        setProductList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

 
  const bannerKey = filters.category || "All";

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-2 lg:px-0 py-4 flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-60">
          <div className="sticky top-4 card bg-base-200 shadow-md p-4">
            <FilterSidebar />
          </div>
        </div>
        <div className="flex-1">
          {/* Render banner for both specific categories and "All" */}
          {categoryBannerMap[bannerKey] && (
            <div className="relative mb-4 overflow-hidden rounded-lg shadow-md group">
              <img
                src={categoryBannerMap[bannerKey]}
                alt={`${bannerKey === "All" ? "All Products" : filters.category} Fashion Banner`}
                className="w-full h-[280px] object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <h2 className="absolute bottom-4 left-4 text-xl font-bold text-white drop-shadow-md font-playfair">
                {bannerKey === "All" ? "All Products Collection" : `${filters.category} Collection`}
              </h2>
            </div>
          )}
          <h1 className="text-2xl lg:text-3xl font-extrabold text-base-content text-center mb-4 tracking-tight font-playfair">
            {filters.category
              ? `Shop ${filters.category}${
                  filters.category === "Men" || filters.category === "Women"
                    ? "'s"
                    : ""
                } Fashion`
              : filters.search
              ? `Search results for "${filters.search}"`
              : "Discover the Latest Trends"}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
              [...Array(8)].map((_, index) => (
                <ProductCardSkeltons key={index} />
              ))
            ) : productList.length > 0 ? (
              productList.map((value) => (
                <ProductCard products={value} key={value?._id} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-base-content/70 text-base">
                  No products found. Try adjusting your filters!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-4 right-4 btn btn-primary btn-circle shadow-md"
        aria-label="Back to top"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
};