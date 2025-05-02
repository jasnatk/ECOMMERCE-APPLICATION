import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../config/axiosInstance";
import { saveSeller, clearSeller } from "../redux/features/userSlice";
import { Footer } from "../Components/user/Footer";
import { SellerHeader } from "../Components/seller/SellerHeader";
import { Header } from "../Components/user/Header";

export const SellerLayout = () => {
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const checkSeller = async () => {
    try {
      const response = await axiosInstance.get("/seller/check-seller");
      dispatch(saveSeller(response.data));
      setIsLoading(false);
    } catch (error) {
      dispatch(clearSeller());
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (user.isSellerAuth || token) {
      setIsLoading(false);
      if (!user.isSellerAuth) {
        checkSeller();
      }
    } else {
      checkSeller();
    }
  }, []);

  return isLoading ? (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-300 rounded"></div>
        <div className="h-96 w-full max-w-4xl bg-gray-300 rounded"></div>
      </div>
    </div>
  ) : (
    <div className="fade-in">
      {user.isSellerAuth ? <SellerHeader /> : <Header />}
      <div className="min-h-96">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};