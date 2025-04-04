 import { Link, } from "react-router-dom";
 import React from "react";
 import { FaSearch, } from "react-icons/fa";
 import { DarkMode } from "../shared/DarkMode";
 import { FaRegUser } from "react-icons/fa";

 export const Header = () => {
  
   return (
     <div className="flex justify-between items-center px-10 py-5 shadow-2xl dark:bg-gray-800 dark:text-white">
      
       {/* Left Section - Logo & Navigation */}
       <nav className="flex items-center gap-20 ">
        
         <h1 className="text-3xl font-bold ">
           <Link
             to=""
             className="hover:text-gray-500 dark:hover:text-gray-300 text-4xl tracking-wide"
             style={{ fontFamily: "Playfair Display, serif" }}>
             Z FASHION
           </Link>
         </h1>
         <ul className="hidden md:flex gap-8 font-semibold text-xl dark:bg-black dark:text-white">
           <li>
             <Link to="/product?category=Men" className="hover:text-gray-500 dark:hover:text-gray-300 ">Men</Link>
           </li>
           <li>
             <Link to="/product?category=Women" className="hover:text-gray-500 dark:hover:text-gray-300">Women</Link>
           </li>
           <li>
             <Link to="/product?category=Kids" className="hover:text-gray-500 dark:hover:text-gray-300">Kids</Link>
           </li>
         </ul>
       </nav>

       {/* Search Box + Button + Dark Mode */}
       <div className="flex items-center gap-4">
         <div className="relative w-80">
           <input
             type="text"
             placeholder="Search..."
             className="w-full p-1 pl-10 border rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:outline-none"
           />
           <FaSearch className="absolute top-3 left-3 text-gray-500 dark:text-gray-300" />
         </div>
         <button className="px-4 py-1 bg-black text-white rounded-md hover:bg-gray-700 dark:hover:bg-gray-500 border border-gray-400">
           Search
         </button>
          <Link to="login">
          <FaRegUser className="cursor-pointer hover:text-gray-500 text-2xl " />
                   </Link>
         <DarkMode />
       </div>
     </div>
   );
 };