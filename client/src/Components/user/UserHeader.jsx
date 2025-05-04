import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // For animations
import { DarkMode } from "../shared/DarkMode";
import { FaSearch, FaUser, FaHeart, FaShoppingCart, FaBars, FaTimes, FaUserCircle, FaBox, FaLock, FaSignOutAlt } from "react-icons/fa";

export const UserHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/product?search=${searchQuery}`);
      setSearchQuery("");
    }
  };

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || { products: [] };
    setCartCount(cart.products.length);
  };

  useEffect(() => {
    updateCartCount();
    const cartUpdatedListener = () => updateCartCount();
    window.addEventListener("cartUpdated", cartUpdatedListener);
    return () => window.removeEventListener("cartUpdated", cartUpdatedListener);
  }, []);

  // Handle scroll to show/hide header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Animation variants for mobile menu
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  // Animation variants for header
  const headerVariants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: -100, opacity: 0 },
  };

  // Animation variants for dropdown
  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: "easeOut" } },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
  };

  // Dropdown item animation
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.07, duration: 0.25, ease: "easeOut" },
    }),
  };

  return (
    <motion.header
      className="bg-base-100 fixed top-0 left-0 right-0 z-50 px-6 py-4 shadow-lg transition-all duration-300"
      variants={headerVariants}
      initial="visible"
      animate={isHeaderVisible ? "visible" : "hidden"}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo + Nav */}
        <div className="flex items-center gap-12">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <Link to="/" className="hover:text-teal-500 text-base-content transition-colors duration-200">
              Z FASHION
            </Link>
          </motion.h1>

          {/* Desktop Nav */}
          <ul className="hidden md:flex gap-8 font-medium text-gray-700 dark:text-gray-200">
            {["All", "Men", "Women", "Kids"].map((category) => (
              <motion.li
                key={category}
                whileHover={{ scale: 1.05, color: "#14b8a6" }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to={category === "All" ? "/product" : `/product?category=${category}`}
                  className="hover:text-teal-500 transition-colors duration-200 text-base-content"
                >
                  {category}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-2xl text-gray-900 dark:text-white"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </motion.button>
        </div>

        {/* Search + Icons (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <form onSubmit={handleSearchSubmit} className="relative flex max-w-xs w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
            />
            <button
              type="submit"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-500"
            >
              <FaSearch />
            </button>
          </form>
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="text-xl text-teal-600 dark:text-teal-300 hover:text-teal-500 dark:hover:text-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full p-1"
              aria-label="User menu"
              aria-expanded={isUserDropdownOpen}
            >
              <FaUser />
            </motion.button>
            <AnimatePresence>
              {isUserDropdownOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-3 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-xl border border-teal-200/50 dark:border-teal-700/50 z-50 overflow-hidden"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {/* Caret/Triangle */}
                  <div className="absolute -top-2 right-3 w-3 h-3 bg-white/90 dark:bg-gray-800/90 rotate-45 border-t border-l border-teal-200/50 dark:border-teal-700/50"></div>
                  {[
                    { to: "/user/profile", label: "Profile", icon: <FaUserCircle className="text-sm" /> },
                    { to: "/user/order/my-orders", label: "My Orders", icon: <FaBox className="text-sm" /> },
                    { to: "/change-password", label: "Change Password", icon: <FaLock className="text-sm" /> },
                    { to: "/logout", label: "Logout", icon: <FaSignOutAlt className="text-sm" /> },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(20, 184, 166, 0.1)" }}
                      className="border-b border-teal-200/20 dark:border-teal-700/20 last:border-b-0"
                    >
                      <Link
                        to={item.to}
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-xs font-medium text-gray-800 dark:text-gray-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200 focus:outline-none focus:bg-teal-50 dark:focus:bg-teal-900"
                      >
                        <span className="text-teal-500 dark:text-teal-400">{item.icon}</span>
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {[
            { to: "/user/wishlist", icon: <FaHeart /> },
            { to: "/user/cart", icon: <FaShoppingCart />, hasBadge: true },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative"
            >
              <Link to={item.to} className="text-xl text-teal-600 dark:text-teal-300 hover:text-teal-500 dark:hover:text-teal-500">
                {item.icon}
                {item.hasBadge && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </motion.div>
          ))}
          <DarkMode />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden mt-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 space-y-6 text-center"
          >
            <form onSubmit={handleSearchSubmit} className="relative flex w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-500"
              >
                <FaSearch />
              </button>
            </form>

            <ul className="space-y-4 font-medium text-gray-700 dark:text-gray-200">
              {["All", "Men", "Women", "Kids"].map((category) => (
                <motion.li
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={category === "All" ? "/product" : `/product?category=${category}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block hover:text-teal-500 transition-colors duration-200"
                  >
                    {category}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="flex justify-center gap-8 text-xl">
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="text-teal-600 dark:text-teal-300 hover:text-teal-500 dark:hover:text-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full p-1"
                  aria-label="User menu"
                  aria-expanded={isUserDropdownOpen}
                >
                  <FaUser />
                </motion.button>
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute left-1/2 transform -translate-x-1/2 mt-3 w-48 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-xl border border-teal-200/50 dark:border-teal-700/50 z-50 overflow-hidden"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {/* Caret/Triangle */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white/90 dark:bg-gray-800/90 rotate-45 border-t border-l border-teal-200/50 dark:border-teal-700/50"></div>
                      {[
                        { to: "/user/profile", label: "Profile", icon: <FaUserCircle className="text-sm" /> },
                        { to: "/user/order/my-orders", label: "My Orders", icon: <FaBox className="text-sm" /> },
                        { to: "/change-password", label: "Change Password", icon: <FaLock className="text-sm" /> },
                        { to: "/logout", label: "Logout", icon: <FaSignOutAlt className="text-sm" /> },
                      ].map((item, index) => (
                        <motion.div
                          key={item.label}
                          custom={index}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          whileHover={{ scale: 1.02, backgroundColor: "rgba(20, 184, 166, 0.1)" }}
                          className="border-b border-teal-200/20 dark:border-teal-700/20 last:border-b-0"
                        >
                          <Link
                            to={item.to}
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-2 px-4 py-3 text-xs font-medium text-gray-800 dark:text-gray-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-200 focus:outline-none focus:bg-teal-50 dark:focus:bg-teal-900"
                          >
                            <span className="text-teal-500 dark:text-teal-400">{item.icon}</span>
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {[
                { to: "/user/wishlist", icon: <FaHeart /> },
                { to: "/user/cart", icon: <FaShoppingCart />, hasBadge: true },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative"
                >
                  <Link
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-teal-600 dark:text-teal-300 hover:text-teal-500 dark:hover:text-teal-500"
                  >
                    {item.icon}
                    {item.hasBadge && cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
              <DarkMode />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};