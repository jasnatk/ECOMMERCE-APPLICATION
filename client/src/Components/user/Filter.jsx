import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const FilterSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setCategory(queryParams.get("category") || "");
    setMinPrice(queryParams.get("minPrice") || "");
    setMaxPrice(queryParams.get("maxPrice") || "");
    setSearch(queryParams.get("search") || "");
  }, [location.search]);

  const handleFilterChange = () => {
    const queryParams = new URLSearchParams();
    if (category) queryParams.set("category", category);
    if (minPrice) queryParams.set("minPrice", minPrice);
    if (maxPrice) queryParams.set("maxPrice", maxPrice);
    if (search) queryParams.set("search", search);
    navigate(`/product?${queryParams.toString()}`);
  };

  const handleResetFilters = () => {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
    navigate("/product");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-base-content">Filters</h2>
      <div>
        <label className="block text-xs font-medium text-base-content/70 mb-1">
          Search
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input input-bordered input-sm w-full bg-base-100 text-base-content"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-base-content/70 mb-1">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select select-bordered select-sm w-full bg-base-100 text-base-content"
        >
          <option value="">All Categories</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-base-content/70 mb-1">
          Price Range
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="input input-bordered input-sm w-1/2 bg-base-100 text-base-content"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="input input-bordered input-sm w-1/2 bg-base-100 text-base-content"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleFilterChange}
          className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm py-2 rounded-md hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center"
        >
          Apply
        </button>
        <button
          onClick={handleResetFilters}
          className="btn btn-ghost btn-sm flex-1"
        >
          Reset
        </button>
      </div>
    </div>
  );
};