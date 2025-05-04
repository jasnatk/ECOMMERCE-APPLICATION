import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axiosInstance";
import { Sidebar } from "../../Components/admin/AdminDashboard";
import { AdminHeader } from "../../Components/admin/AdminHeader";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await axiosInstance.get("/admin/profile");
        setAdmin(res.data.data); // Updated to match backend response
      } catch (err) {
        console.error(err);
        toast.error("Failed to load admin profile");
        navigate("/admin/login");
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-700 dark:text-white animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 md:ml-64 pt-16 transition-all duration-300">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        <main className="p-6">
          <h1 className="text-2xl font-bold text-purple-700 dark:text-white mb-6 text-center">
            ADMIN PROFILE
          </h1>
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center">
            <img
              src={admin.profilePic || "/image/admin-avatar.jpg"}
              alt="Admin Profile"
              className="w-40 h-40 object-cover rounded-full border-4 border-gray-200 dark:border-gray-700"
            />
            <div className="flex-1 space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{admin.name}</h2>
              <p className="text-gray-700 dark:text-gray-200">
                <span className="font-medium">Email:</span> {admin.email}
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                <span className="font-medium">Phone:</span> {admin.phoneNumber || 'N/A'}
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                <span className="font-medium">Address:</span> {admin.address || 'N/A'}
              </p>
              <p className="text-gray-700 dark:text-gray-200">
                <span className="font-medium">Role:</span> Admin
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;