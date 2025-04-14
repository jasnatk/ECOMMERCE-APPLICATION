// src/routes/ProtectAdminRoutes.jsx

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

export const ProtectAdminRoutes = () => {
  const { isAdminAuth } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminAuth) {
      navigate("/admin/login");
    }
  }, [isAdminAuth, navigate]);

  return isAdminAuth ? <Outlet /> : null;
};
