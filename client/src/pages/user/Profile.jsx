import React, { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
 import { useLogout } from "../../hooks/useLogout";
import { Order } from "../../Components/user/order";
 

export const Profile = () => {
    const [userDetails, isLoading, error] = useFetch("/user/profile");
    const handleLogout = useLogout(); // Get logout function
     const [showOrders, setShowOrders] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            {/* Profile Picture */}
            <div className="mb-4">
                <img
                    src={userDetails?.profilePic}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-gray-300 shadow-lg"
                />
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
                <button className="w-full py-2 px-4 bg-black text-white rounded-lg shadow-md">Edit Profile</button>
                <button
                    className="w-full py-2 px-4 bg-black text-white rounded-lg shadow-md"
                    onClick={() => setShowOrders(!showOrders)}
                >
                 Orders
                </button>
                <button className="w-full py-2 px-4 bg-black text-white rounded-lg shadow-md">Change Password</button>
                <button 
    type="button"  
    className="w-full py-2 px-4 bg-black text-white rounded-lg shadow-md"
    onClick={handleLogout} 
>
    Logout
</button>

            </div>

         {/* Orders Section */}
            {showOrders && <Order/>} 
        </div>
    );
};
