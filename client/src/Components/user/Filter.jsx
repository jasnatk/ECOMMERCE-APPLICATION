import React, { useState } from 'react';

export const FilterSidebar = ({ onFilterChange }) => {
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [search, setSearch] = useState('');

  const handleFilterChange = () => {
    // Trigger the onFilterChange function with the updated filter values
    onFilterChange({ category, minPrice, maxPrice, search });
  };

  return (
    <div className="w-64 p-4 bg-gray-100 shadow-md">
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">All Categories</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Price Range</label>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Search Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Search</label>
        <input
          type="text"
          placeholder="Search Products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={handleFilterChange}
        className="w-full bg-black text-white py-2 rounded mt-4"
      >
        Apply Filters
      </button>
    </div>
  );
};
