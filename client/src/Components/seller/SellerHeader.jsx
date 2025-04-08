
import React from "react";
import { Link } from "react-router-dom";

export const SellerHeader = () => {
  return (
    <header className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Seller Dashboard</h1>
        <nav className="space-x-4">
          <Link to="/seller/profile" className="hover:underline">Profile</Link>
          <Link to="/seller/logout" className="hover:underline">Logout</Link>
        </nav>
      </div>
    </header>
  );
};
