import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { DarkMode } from "../shared/DarkMode";
import { FiMenu, FiUser } from "react-icons/fi";
import { clearUser } from "../../redux/features/userSlice";

export const AdminHeader = ({ setSidebarOpen }) => {
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
        <nav className="flex items-center gap-4">
          <Link to="/admin/profile">
            <FiUser className="cursor-pointer hover:text-gray-500 text-2xl" />
          </Link>
          <DarkMode />
        </nav>
      </div>
    </header>
  );
};
