import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DarkMode } from "../shared/DarkMode";
import { FiUser } from "react-icons/fi";
import { useLogout } from "../../hooks/useLogout";

export const SellerHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleLogout = useLogout("seller");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white pl-12 p-4">
      <div className="container mx-0 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">
            <Link
              to="/seller/sellerDashboard"
              className="hover:text-gray-500"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              SELLER
            </Link>
          </h1>
          <h2 className="text-lg">
            <Link
              to="/seller/sellerDashboard"
              className="hover:text-gray-500"
            >
              Home
            </Link>
          </h2>
        </div>
        <nav className="flex items-center gap-4">
          <div className="relative">
            <FiUser
              className="cursor-pointer hover:text-gray-500 text-2xl"
              onClick={toggleDropdown}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/seller/profile"
                  className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
           <DarkMode />
        </nav>
      </div>
    </header>
  );
};