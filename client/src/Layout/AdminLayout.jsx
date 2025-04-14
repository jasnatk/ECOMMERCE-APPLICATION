import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../config/axiosInstance';
import { clearUser, saveUser } from '../redux/features/userSlice';
import { Footer } from '../Components/user/Footer';
import { AdminHeader } from '../Components/admin/AdminHeader';

export const AdminLayout = () => {
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const location = useLocation();

  const checkAdmin = async () => {
    try {
      const response = await axiosInstance.get('/admin/check-admin');
      console.log('Admin check:', response);
      dispatch(saveUser({ ...response.data }));
      setIsLoading(false);
    } catch (error) {
      console.log('Admin not authenticated:', error);
      dispatch(clearUser());
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAdmin();
  }, [location.pathname]);

  return isLoading ? null : (
    <div>
      <AdminHeader />
      <div className="min-h-96">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
