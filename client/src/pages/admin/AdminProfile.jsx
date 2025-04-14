import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axiosInstance";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await axiosInstance.get("/admin/profile");
        setAdmin(res.data.userData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load admin profile");
        navigate("/admin/login");
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  if (!admin) {
    return <div className="text-center py-10 text-xl font-medium">Loading...</div>;
  }

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
        <img
          src={admin.profilePic || "/image/admin-avatar.jpg"}
          alt="Admin Profile"
          className="w-40 h-40 object-cover rounded-full border-4 border-gray-200"
        />
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-semibold">{admin.name}</h2>
          <p><span className="font-medium">Email:</span> {admin.email}</p>
          <p><span className="font-medium">Role:</span> Admin</p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
