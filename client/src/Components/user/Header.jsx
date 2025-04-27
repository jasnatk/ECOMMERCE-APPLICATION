import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaBars, FaTimes, FaRegUser } from "react-icons/fa";
import { DarkMode } from "../shared/DarkMode";

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/product?search=${searchQuery}`);
      setSearchQuery("");
      setMenuOpen(false); // Optional: close menu on mobile after search
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50    w-full shadow-md px-4 py-4 md:px-10 dark:bg-gray-800 dark:text-white">
      <div className="flex justify-between items-center">
        {/* Logo & Hamburger */}
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-wide" style={{ fontFamily: "Playfair Display, serif" }}>
            <Link
              to="/"
              className="hover:text-gray-500 dark:hover:text-gray-300 text-4xl"
            >
              Z FASHION
            </Link>
          </h1>

          {/* Hamburger Icon (Mobile only) */}
          <button className="md:hidden text-2xl" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 font-semibold text-xl">
          <li>
            <Link to="/product?category=Men" className="hover:text-gray-500 dark:hover:text-gray-300">Men</Link>
          </li>
          <li>
            <Link to="/product?category=Women" className="hover:text-gray-500 dark:hover:text-gray-300">Women</Link>
          </li>
          <li>
            <Link to="/product?category=Kids" className="hover:text-gray-500 dark:hover:text-gray-300">Kids</Link>
          </li>
        </ul>

        {/* Search & Icons */}
        <div className="hidden md:flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-68 p-1 border rounded-l-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 bg-black text-white rounded-r-md hover:bg-gray-700 dark:hover:bg-gray-500"
            >
              Search
            </button>
          </form>
          <Link to="/login">
            <FaRegUser className="text-2xl cursor-pointer hover:text-gray-500" />
          </Link>
          <DarkMode />
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-4">
          <ul className="flex flex-col gap-4 font-semibold text-lg">
            <li>
              <Link to="/product?category=Men" onClick={toggleMenu}>Men</Link>
            </li>
            <li>
              <Link to="/product?category=Women" onClick={toggleMenu}>Women</Link>
            </li>
            <li>
              <Link to="/product?category=Kids" onClick={toggleMenu}>Kids</Link>
            </li>
          </ul>

          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="flex w-full mt-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          <div className="flex items-center gap-4 mt-4">
            <Link to="/login" onClick={toggleMenu}>
              <FaRegUser className="text-2xl cursor-pointer hover:text-gray-500" />
            </Link>
            <DarkMode />
          </div>
        </div>
      )}
    </header>
  );
};
