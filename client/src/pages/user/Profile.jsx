import React, { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useLogout } from "../../hooks/useLogout";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const navigate = useNavigate();
    const [userDetails, isLoading, error] = useFetch("/user/profile");
    const handleLogout = useLogout();
    const [showOrders, setShowOrders] = useState(false);

    // Mock online status (you can replace this with real-time status later)
    const isOnline = true;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            {/* Profile Picture with Presence Indicator */}
            <div className={`avatar mb-4 ${isOnline ? "avatar-online" : "avatar-offline"}`}>
                <div className="w-40 rounded-full ring ring-gray-300 ring-offset-base-100 ring-offset-2">
                    <img
                        src={userDetails?.profilePic}
                        alt="Profile"
                        className="object-cover"
                    />
                </div>
            </div>

            {/* User Details */}
            <div className="text-center">
                <h1 className="text-2xl font-semibold">{userDetails?.name}</h1><br />
                <p className="text-lg text-gray-500">Email: {userDetails?.email}</p>
                <p className="text-lg text-gray-500">Phone: {userDetails?.phoneNumber}</p>
                <p className="text-lg text-gray-500">Address: {userDetails?.address}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-6 w-full max-w-xs">
                <button 
                    className="w-full py-2 px-4 bg-black text-white rounded-lg shadow-md"
                    onClick={() => navigate("/user/edit-profile")}
                >
                    Edit Profile
                </button>
                <button
                    className="w-full py-2 px-4 bg-black text-white rounded-lg shadow-md"
                    onClick={() => setShowOrders(!showOrders)}
                >
                    Orders
                </button>
                <button className="w-full py-2 px-4 bg-black text-white rounded-lg shadow-md">
                    Change Password
                </button>
                <button 
                    type="button"  
                    className="w-full py-2 px-4 bg-black text-white rounded-lg shadow-md"
                    onClick={handleLogout} 
                >
                    Logout
                </button>
            </div>

            {/* Orders Section */}
            {showOrders && <div className="mt-6">order</div>}
        </div>
    );
};
