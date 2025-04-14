import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { DarkMode } from "../shared/DarkMode";
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from "react-icons/fa";

export const UserHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();  

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/product?search=${searchQuery}`);  
    }
  };

  return (
    <div className="flex justify-between items-center px-10 py-5 shadow-2xl">
      {/* Left Section - Logo & Navigation */}
      <nav className="flex items-center gap-10">
        <h1 className="text-3xl font-bold">
          <Link to="" className="hover:text-gray-500" style={{ fontFamily: 'Playfair Display, serif' }}>
            Z FASHION
          </Link>
        </h1>
        <ul className="hidden md:flex gap-8 font-semibold">
          <li>
            <Link to="/product" className="hover:text-gray-500">All</Link>
          </li>
          <li>
            <Link to="/product?category=Men" className="hover:text-gray-500">Men</Link>
          </li>
          <li>
            <Link to="/product?category=Women" className="hover:text-gray-500">Women</Link>
          </li>
          <li>
            <Link to="/product?category=Kids" className="hover:text-gray-500">Kids</Link>
          </li>
        </ul>
      </nav>

      {/* Middle Section - Search Bar */}
      <div className="relative w-64">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search for items..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 pl-10 border rounded-md bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:outline-none"
          />
          <FaSearch className="absolute top-3 left-3 text-gray-500 cursor-pointer" onClick={handleSearchSubmit} />
        </form>
      </div>

      {/* Right Section - Icons */}
      <div className="flex items-center gap-6 text-xl">
        <DarkMode />
        <Link to="/user/profile">
          <FaUser className="cursor-pointer hover:text-gray-500" />
        </Link>
        <Link to="user/wishlist">
          <FaHeart className="cursor-pointer hover:text-gray-500" />
        </Link>
        <Link to="user/cart">
          <FaShoppingCart className="cursor-pointer hover:text-gray-500" />
        </Link>
      </div>
    </div>
  );
};
