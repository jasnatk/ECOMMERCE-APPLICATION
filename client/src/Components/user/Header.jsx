import { CircleUserRound, Heart, ShoppingCart } from "lucide-react"
import React, { useState, useEffect } from "react";
import { FaMoon, FaSun, FaUser, FaHeart, FaShoppingCart, FaSearch } from "react-icons/fa";
import { DarkMode } from "../shared/DarkMode";



export const Header = () => {
  return (
    <nav className="flex items-center justify-between bg-white dark:bg-gray-900 h-20 shadow-md">

      <div className="flex items-center gap-6 w-40 h-30 pl-10">
        <img src="/image/newlogotop.png" alt="logo" /></div>
      <div className="flex items-center gap-6 text-lg">
        <ul className="hidden md:flex gap-10  text-gray-800 dark:text-gray-200 font-semibold">
          <li className="cursor-pointer hover:text-gray-500">Men</li>
          <li className="cursor-pointer hover:text-gray-500">Women</li>
          <li className="cursor-pointer hover:text-gray-500">Kids</li>
        </ul>
      </div>


      <div className="relative w-64">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 pl-10 border rounded-md bg-gray-100 dark:bg-gray-800 text-black dark:text-white focus:outline-none"/>
        <FaSearch className="absolute top-3 left-3 text-gray-900" />
        
      </div>


      <div className="flex items-center gap-10 text-gray-800 dark:text-gray-200 text-xl pr-10">
            
              <DarkMode/>
        <CircleUserRound className="cursor-pointer hover:text-gray-500" />
        <Heart className="cursor-pointer hover:text-gray-500" />
        <ShoppingCart className="cursor-pointer hover:text-gray-500" />
      </div>
    </nav>
  );
};
