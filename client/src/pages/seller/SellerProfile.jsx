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
    <div className="p-6 bg-base-200 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
        <img
          src={seller.profilePic || "/image/seller1.jpg"}
          alt="Seller Profile"
          className="w-40 h-40 object-cover rounded-full border-4 border-gray-200"
        />
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-semibold">{seller.name}</h2>
          <p><span className="font-medium">Email:</span> {seller.email}</p>
          <p><span className="font-medium">Phone:</span> {seller.phone}</p>
          <p><span className="font-medium">Address:</span> {seller.address}</p>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
