import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DarkMode } from "../shared/DarkMode";
import { FiMenu, FiUser } from "react-icons/fi";
import { useLogout } from "../../hooks/useLogout";

export const AdminHeader = ({ setSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const handleLogout = useLogout("admin");

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gray-900 text-white p-4 shadow-md flex justify-center items-center">
      <div className="container mx-auto flex justify-between items-center w-full">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-2xl"
          >
            <FiMenu />
          </button>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
            <Link to="/admin/dashboard" className="hover:text-gray-500">
              Z FASHION ADMIN
            </Link>
          </h1>
        </div>
        <nav className="flex items-center gap-4 relative">
          <div className="relative">
            <FiUser
              className="cursor-pointer hover:text-gray-500 text-2xl"
              onClick={toggleDropdown}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg z-50">
                <Link
                  to="/admin/profile"
                  className="block px-4 py-2 hover:bg-gray-700"
                  onClick={() => setIsDropdownOpen(false)} // Close dropdown on click
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-700"
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