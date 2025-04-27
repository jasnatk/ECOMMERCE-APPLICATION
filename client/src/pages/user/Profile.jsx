import React, { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useLogout } from "../../hooks/useLogout";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
    const navigate = useNavigate();
    const [userDetails, isLoading, error] = useFetch("/user/profile");
    const handleLogout = useLogout("user");
    const [showOrders, setShowOrders] = useState(false);

    const isOnline = true;

    return (
        <div className="min-h-screen  p-6 flex items-center justify-center pt-24">
            {/* Card Container */}
            <div className="bg-gradient-to-tr from-teal-400  to-teal-200 card w-full max-w-md bg-white/30 backdrop-blur-xl shadow-xl border border-gray-300/50 hover:shadow-2xl hover:border-white transition-all duration-500 p-6 rounded-2xl">
                {/* Profile Picture */}
                <div className="relative flex justify-center mb-6">
                    <div className="avatar indicator">
                        <span className={`indicator-item badge badge-sm ${isOnline ? "badge-success animate-bounce" : "badge-error"}`}></span>
                        <div className="w-36 rounded-full ring ring-offset-4 ring-offset-white ring-accent transition-all duration-300 hover:ring-offset-4 hover:ring-primary hover:scale-105">
                            <img
                                src={userDetails?.profilePic}
                                alt="Profile"
                                className="object-cover rounded-full"
                            />
                        </div>
                    </div>
                </div>

                {/* User Details */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-[Playfair Display] font-bold text-green bg-clip-text bg-gradient-to-r from-white via-teal-900 to-teal-500 animate-pulse">
                        {userDetails?.name}
                    </h1>
                    <div className="space-y-2">
                        <p className="text-lg text-black">Email: <span className="text-black font-semibold">{userDetails?.email}</span></p>
                        <p className="text-lg text-black">Phone: <span className="text-black font-semibold">{userDetails?.phoneNumber}</span></p>
                        <p className="text-lg text-black">Address: <span className="text-black font-semibold">{userDetails?.address}</span></p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-3">
                    <button
                        className="btn w-full font-[Playfair Display] text-lg text-white bg-gradient-to-r from-teal-400 to-teal-900 hover:from-teal-600 hover:to-teal-500  transition-all duration-300 transform hover:-translate-y-1 rounded-xl"
                        onClick={() => navigate("/user/edit-profile")}
                    >
                        Edit Profile
                    </button>
                    <button
                       className="btn w-full font-[Playfair Display] text-lg text-white bg-gradient-to-r from-teal-400 to-teal-900 hover:from-teal-600 hover:to-teal-500  transition-all duration-300 transform hover:-translate-y-1 rounded-xl"
                        onClick={() => navigate("/user/order/my-orders")}
                    >
                      My orders
                    </button>
                    <button
                    className="btn w-full font-[Playfair Display] text-lg text-white bg-gradient-to-r from-teal-400 to-teal-900 hover:from-teal-600 hover:to-teal-500  transition-all duration-300 transform hover:-translate-y-1 rounded-xl"
                    onClick={() => navigate("/change-password")}>
                    Change Password
                    </button>

                    <button
                        className="btn w-full font-[Playfair Display] text-lg text-white bg-gradient-to-r from-teal-400 to-teal-900 hover:from-teal-600 hover:to-teal-500  transition-all duration-300 transform hover:-translate-y-1 rounded-xl"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

                {/* Orders Section */}
                {showOrders && (
                    <div className="mt-6 p-4 bg-gray-100/30 rounded-xl border border-gray-300/50 animate-slideIn">
                        <h2 className="text-xl font-[Playfair Display] text-white font-semibold mb-2">Your Orders</h2>
                        <p className="text-white">Order details coming soon...</p>
                    </div>
                )}

                {/* Inline CSS for Animation */}
                <style>{`
                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-slideIn {
                        animation: slideIn 0.3s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};