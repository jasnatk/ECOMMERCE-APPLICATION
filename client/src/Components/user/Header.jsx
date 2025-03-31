
import React from "react";
import { Link } from "react-router-dom";
import { DarkMode } from "../shared/DarkMode";
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from "react-icons/fa";

export const Header = () => {
  return (
    <div className="flex justify-between items-center px-10 py-5 shadow-2xl">
      {/* Left Section - Logo & Navigation */}
      <nav className="flex items-center gap-10">
        <h1 className="text-3xl font-bold">
          <Link to="/product" className="hover:text-gray-500">
            Z FASHION
          </Link>
        </h1>
        <ul className="hidden md:flex gap-8 font-semibold">
        <li>
            <Link to="/product" className="hover:text-gray-500">All</Link>
          </li>
          <li>
            <Link to="/Men" className="hover:text-gray-500">Men</Link>
          </li>
          <li>
            <Link to="/women" className="hover:text-gray-500">Women</Link>
          </li>
          <li>
            <Link to="/kids" className="hover:text-gray-500">Kids</Link>
          </li>
        </ul>
      </nav>

      {/* Middle Section - Search Bar */}
      <div className="relative w-64">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 pl-10 border rounded-md bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:outline-none"
        />
        <FaSearch className="absolute top-3 left-3 text-gray-500" />
      </div>

      {/* Right Section - Icons */}
      <div className="flex items-center gap-6 text-xl">
        <DarkMode />
        <Link to="/signup">
          <FaUser className="cursor-pointer hover:text-gray-500" />
          </Link>
        <Link to="/wishlist">
          <FaHeart className="cursor-pointer hover:text-gray-500" />
        </Link>
        <Link to="/cart">
          <FaShoppingCart className="cursor-pointer hover:text-gray-500" />
        </Link>
      </div>
    </div>
  );
};
