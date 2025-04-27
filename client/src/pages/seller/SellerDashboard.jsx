import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { LogOut, Home, List, Package, ShoppingCart } from "lucide-react";
import { axiosInstance } from "../../config/axiosInstance";
import { useLogout } from "../../hooks/useLogout";



const SellerDashboard = () => {
  const [seller, setSeller] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const handleLogout = useLogout("seller");

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const profileRes = await axiosInstance.get("/seller/profile");
        setSeller(profileRes.data.userData);

        const statsRes = await axiosInstance.get("/seller/stats");
        setStats(statsRes.data.stats);
        
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data");
        navigate("/login");
      }
    };

    fetchSellerData();
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");

    if (section === "profile" && profileRef.current) {
      profileRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  // Sidebar navigation items
  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/seller/sellerdashboard" },
    { name: "Product Management", icon: Package, path: "/seller/products" },
    { name: "Order Management", icon: ShoppingCart, path: "/seller/orders" },
    { name: "Stock Mnagement", icon: List, path: "/seller/products/edit-stock/:id" },
    
    
    
  ];

  if (!seller) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className=" flex-1  p-8 pt-17 flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed  left-0 w-64 h-full bg-gradient-to-b from-purple-600 via-indigo-600 to-blue-600 text-white shadow-xl transition-all duration-300">
        
        <nav className="pt-8">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full px-6 py-3 text-left text-sm font-medium transition-all duration-200 hover:bg-blue-700 hover:text-white ${
                location.pathname === item.path ? " hover:bg-blue-700" : ""
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {seller.name} 👋</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md"
          >
            <LogOut size={18} />
            Logout
          </button>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
                <p className="text-3xl font-bold text-indigo-600">{stats.totalProducts}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <Package className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Orders</h3>
                <p className="text-3xl font-bold text-green-600">{stats.totalOrders}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
                <p className="text-3xl font-bold text-yellow-600">₹ {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/seller/products/new")}
              className="p-4 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all duration-200"
            >
              Add New Product
            </button>
            <button
              onClick={() => navigate("/seller/orders")}
              className="p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all duration-200"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate("/seller/products")}
              className="p-4 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-all duration-200"
            >
              Manage Listings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;