// src/Layout/SellerLayout.jsx

import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../config/axiosInstance";
import { clearUser, saveUser } from "../redux/features/userSlice";
import { SellerHeader } from "../components/seller/SellerHeader";
import { Footer } from "../components/user/Footer";

export const SellerLayout = () => {
  const user = useSelector((state) => state.user); // Can rename to seller if you separate seller state
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const location = useLocation();

  const checkSeller = async () => {
    try {
      const response = await axiosInstance.get("/seller/check-seller");
      console.log("Seller check:", response);
      dispatch(saveUser({ ...response.data })); // You can use a separate saveSeller if needed
      setIsLoading(false);
    } catch (error) {
      console.log("Seller not authenticated:", error);
      dispatch(clearUser());
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSeller();
  }, [location.pathname]);

  return isLoading ? null : (
    <div>
      <SellerHeader />
      <div className="min-h-96">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
