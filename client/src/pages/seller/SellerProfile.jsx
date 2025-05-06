// src/pages/seller/SellerProfile.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axiosInstance";

const SellerProfile = () => {
  const [seller, setSeller] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        const res = await axiosInstance.get("/seller/profile");
        setSeller(res.data.userData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
        navigate("/seller/login");
      }
    };

    fetchSellerProfile();
  }, [navigate]);

  if (!seller) {
    return <div className="text-center py-10 text-xl font-medium">Loading...</div>;
  }

  return (
    <div className="p-6 min-h-screen pt-44 bg-gradient-to-br from-purple-400 via-indigo-600 to-blue-700 text-white">
      <div className="max-w-4xl mx-auto  shadow-xl rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
        <img
          src={seller.profilePic || "/image/seller1.jpg"}
          alt="Seller Profile"
          className=" bg-base-200 w-40 h-40 object-cover rounded-full border-4 border-gray-200"
        />
        <div className=" flex-1 space-y-2 text-center md:text-left">
          <h2 className=" text-2xl font-semibold">{seller.name}</h2>
          <p><span className="font-medium">Email:</span> {seller.email}</p>
          <p><span className="font-medium">Phone:</span> {seller.phoneNumber}</p>
          <p><span className="font-medium">Address:</span> {seller.address}</p>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
