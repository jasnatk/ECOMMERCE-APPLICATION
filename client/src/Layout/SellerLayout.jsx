

import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../config/axiosInstance";
import { clearUser, saveUser } from "../redux/features/userSlice";
import { Footer } from "../Components/user/Footer";
import { SellerHeader } from "../Components/seller/SellerHeader";
import { Header } from "../Components/user/Header";

export const SellerLayout = () => {
  const user = useSelector((state) => state.user); 
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const location = useLocation();

  const checkSeller = async () => {
    try {
      const response = await axiosInstance.get("/seller/check-seller");
      console.log("Seller check:", response);
      dispatch(saveUser({ ...response.data })); 
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
      
      {user.isSellerAuth ? <SellerHeader />: <Header />}
      <div className="min-h-96">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
