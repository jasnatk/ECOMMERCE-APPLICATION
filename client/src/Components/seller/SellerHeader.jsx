
import React from "react";
import { Link } from "react-router-dom";
import { DarkMode } from "../shared/DarkMode";
import { FiUser } from "react-icons/fi";

export const SellerHeader = () => {
  return (
    <header className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          <Link to="" className="hover:text-gray-500" style={{ fontFamily: 'Playfair Display, serif' }}>
            Z FASHION
          </Link>
        </h1>
        <nav className="flex items-center gap-4">
          {/* Add query param to trigger scroll */}
          <Link to="/seller/profile">
            <FiUser className="cursor-pointer hover:text-gray-500 text-2xl" />
          </Link>
          <DarkMode />
        </nav>
      </div>
    </header>
  );
};
