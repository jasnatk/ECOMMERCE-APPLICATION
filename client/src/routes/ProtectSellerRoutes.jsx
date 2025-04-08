// src/routes/ProtectSellerRoutes.jsx

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

export const ProtectSellerRoutes = () => {
  const { isSellerAuth } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSellerAuth) {
      navigate("/seller/login");
    }
  }, [isSellerAuth, navigate]);

  return <Outlet />;
};
