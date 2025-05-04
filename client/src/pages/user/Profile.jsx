import React from "react";
import { useFetch } from "../../hooks/useFetch";
import { useLogout } from "../../hooks/useLogout";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, isLoading, error] = useFetch("/user/profile");
  const handleLogout = useLogout("user");

  const isOnline = true;

  // Access user data
  const user = userDetails?.data || {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-teal-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-semibold text-error">
          Error: {error?.response?.data?.message || "Failed to load profile"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center pt-24">
      <div className="bg-gradient-to-tr from-teal-400 to-teal-200 card w-full max-w-md bg-white/30 backdrop-blur-xl shadow-xl border border-gray-300/50 hover:shadow-2xl hover:border-white transition-all duration-500 p-6 rounded-2xl">
        <div className="relative flex justify-center mb-6">
          <div className="avatar indicator">
            <span className={`indicator-item badge badge-sm ${isOnline ? "badge-success animate-bounce" : "badge-error"}`}></span>
            <div className="w-36 rounded-full ring ring-offset-4 ring-offset-white ring-accent transition-all duration-300 hover:ring-offset-4 hover:ring-primary hover:scale-105">
              <img
                src={user?.profilePic || "https://placehold.co/150x150?text=No+Image"}
                alt="Profile"
                className="object-cover rounded-full"
                onError={(e) => {
                  e.target.src = "https://placehold.co/150x150?text=No+Image";
                }}
              />
            </div>
          </div>
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-[Playfair Display] font-bold text-green bg-clip-text bg-gradient-to-r from-white via-teal-900 to-teal-500 animate-pulse">
            {user?.name || "No Name"}
          </h1>
          <div className="space-y-2">
            <p className="text-lg text-black">
              Email: <span className="text-black font-semibold">{user?.email || "No Email"}</span>
            </p>
            <p className="text-lg text-black">
              Phone: <span className="text-black font-semibold">{user?.phoneNumber || "No Phone"}</span>
            </p>
            <p className="text-lg text-black">
              Address: <span className="text-black font-semibold">{user?.address || "No Address"}</span>
            </p>
          </div>
        </div>
        <div className="mt-8 space-y-3">
          <button
            className="btn w-full font-[Playfair Display] text-lg text-white bg-gradient-to-r from-teal-400 to-teal-900 hover:from-teal-600 hover:to-teal-500 transition-all duration-300 transform hover:-translate-y-1 rounded-xl"
            onClick={() => navigate("/user/edit-profile")}
          >
            Edit Profile
          </button>
         
        </div>
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

export default Profile;