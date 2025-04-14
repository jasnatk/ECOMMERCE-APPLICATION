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
        try {
            const response = await axiosInstance.get("/user/check-user");

            // Save user data in Redux store
            dispatch(saveUser(response.data.data));

            setIsLoading(false);
        } catch (error) {
            console.log("API Error:", error);

            if (error.response) {
                // If the error is an unauthenticated error (401), redirect to login
                if (error.response.status === 401) {
                    navigate("/login");
                }
                console.error("Response Data:", error.response.data);
                console.error("Response Status:", error.response.status);
            }

            // Clear user data if there's an error or no user data
            dispatch(clearUser());
            setIsLoading(false);
        }
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
