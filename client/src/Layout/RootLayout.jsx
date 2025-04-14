import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { UserHeader } from "../Components/user/UserHeader";
import { Header } from "../Components/user/Header";
import { Footer } from "../Components/user/Footer";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../config/axiosInstance";
import { clearUser, saveUser } from "../redux/features/userSlice";

export const RootLayout = () => {
    const user = useSelector((state) => state.user);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const checkUser = async () => {
        const token = localStorage.getItem("token");
    
        if (!token) {
            dispatch(clearUser());
            setIsLoading(false);
            return;
        }
    
        try {
            const response = await axiosInstance.get("/user/check-user");
            dispatch(saveUser(response.data.data));
        } catch (error) {
            console.log("API Error:", error);
    
            if (error.response?.status === 401) {
                // Optional: only redirect if on protected route
                const protectedPaths = ["/user"];
                const isProtected = protectedPaths.some(path => location.pathname.startsWith(path));
                if (isProtected) {
                    navigate("/login");
                }
            }
    
            dispatch(clearUser());
        }
    
        setIsLoading(false);
    };
    
    // Run checkUser only once when the component mounts
    useEffect(() => {
        checkUser();
    }, []); // 

    return isLoading ? (
        <div>Loading...</div> 
    ) : (
        <div>
            {user.isUserAuth ? <UserHeader /> : <Header />}
            <div className="min-h-100">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};
