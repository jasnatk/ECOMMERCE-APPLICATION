import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { DarkMode } from "../shared/DarkMode";
import { FiUser } from "react-icons/fi";
import { clearUser } from "../../redux/features/userSlice";

export const AdminHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/admin/login");
  };

  return (
    <header className="bg-blue-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          <Link
            to="/admin/dashboard"
            className="hover:text-gray-300"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            ADMIN PANEL
          </Link>
        </h1>
        <nav className="flex items-center gap-6">
        <Link to="/admin/manage-sellers" className="hover:text-gray-300">
            Sellers
            </Link>
          <Link to="/admin/manage-orders" className="hover:text-gray-300">
            Orders
          </Link>
          <Link to="/admin/profile">
            <FiUser className="cursor-pointer hover:text-gray-300 text-2xl" />
          </Link>
          <DarkMode />
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-1 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};
