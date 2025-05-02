import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

export const ProtectSellerRoutes = () => {
  const { isSellerAuth } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsCheckingAuth(false);
    }, 0);
  }, []);

  useEffect(() => {
    if (!isCheckingAuth && !isSellerAuth) {
      navigate("/seller/login", { replace: true });
    }
  }, [isCheckingAuth, isSellerAuth, navigate]);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
};