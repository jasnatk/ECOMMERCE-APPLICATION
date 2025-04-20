import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DarkMode } from "../shared/DarkMode";
import { FaSearch, FaUser, FaHeart, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

export const UserHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/product?search=${searchQuery}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="px-9 py-4 shadow-2xl dark:bg-gray-800 dark:text-white">
      <div className="flex justify-between items-center">
        {/* Logo + Nav */}
        <div className="flex items-center gap-20">
          <h1 className="text-3xl font-bold tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Link to="/" className="hover:text-gray-500">Z FASHION</Link>
          </h1>

          {/* Desktop Nav */}
          <ul className="hidden md:flex gap-8  font-semibold text-lg">
            <li><Link to="/product" className="hover:text-gray-500">All</Link></li>
            <li><Link to="/product?category=Men" className="hover:text-gray-500">Men</Link></li>
            <li><Link to="/product?category=Women" className="hover:text-gray-500">Women</Link></li>
            <li><Link to="/product?category=Kids" className="hover:text-gray-500">Kids</Link></li>
          </ul>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {/* Search + Icons (inline on desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="flex max-w-xs w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="flex-grow p-1 border rounded-l-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-black text-white rounded-r-md hover:bg-gray-700 dark:hover:bg-gray-500"
            >
              <FaSearch />
            </button>
          </form>
          <Link to="/user/profile"><FaUser className="text-xl text-teal-800 hover:text-teal-500" /></Link>
          <Link to="/user/wishlist"><FaHeart className="text-xl text-teal-800 hover:text-teal-500" /></Link>
          <Link to="/user/cart"><FaShoppingCart className="text-xl text-teal-800 hover:text-teal-500" /></Link>
          <DarkMode />
        </div>
      </div>

      {/* Search bar and nav in mobile view */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-4 text-center text-lg font-semibold">
          <form onSubmit={handleSearchSubmit} className="flex w-[90%] mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="flex-grow p-2 border rounded-l-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-r-md hover:bg-gray-700 dark:hover:bg-gray-500"
            >
              Search
            </button>
          </form>

          <Link to="/product" className="block hover:text-gray-500" onClick={() => setIsMenuOpen(false)}>All</Link>
          <Link to="/product?category=Men" className="block hover:text-gray-500" onClick={() => setIsMenuOpen(false)}>Men</Link>
          <Link to="/product?category=Women" className="block hover:text-gray-500" onClick={() => setIsMenuOpen(false)}>Women</Link>
          <Link to="/product?category=Kids" className="block hover:text-gray-500" onClick={() => setIsMenuOpen(false)}>Kids</Link>

          <div className="flex justify-center gap-6 text-xl mt-3">
            <Link to="/user/profile"><FaUser className="text-xl text-teal-800 hover:text-teal-500" /></Link>
            <Link to="/user/wishlist"><FaHeart className="htext-xl text-teal-800 hover:text-teal-500" /></Link>
            <Link to="/user/cart"><FaShoppingCart className="text-xl text-teal-800 hover:text-teal-500" /></Link>
            <DarkMode />
          </div>
        </div>
      )}
    </header>
  );
};
