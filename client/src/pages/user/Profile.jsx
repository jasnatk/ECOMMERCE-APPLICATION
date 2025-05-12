import React, { useRef } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useLogout } from "../../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { DarkMode } from "../../Components/shared/DarkMode";
import { axiosInstance } from "../../config/axiosInstance";
import { toast } from "react-hot-toast";

export const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, isLoading, error] = useFetch("/user/profile");
  const handleLogout = useLogout("user");
  const fileInputRef = useRef(null);
  const isOnline = true;

  // Access user data
  const user = userDetails?.data || {};

  // Define default avatar (local image)
  const defaultImage = "/image/fauser1.png"; // Local fa-user icon image
  // Use default avatar if profilePic is missing or invalid
  const profileImage = user?.profilePic && user.profilePic !== "" ? user.profilePic : defaultImage;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axiosInstance.post("/user/upload-profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      userDetails.data.profilePic = res.data.data.profilePic;
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading profile picture");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100 dark:bg-gray-900">
        <p className="text-xl font-semibold text-teal-600 dark:text-teal-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-100 dark:bg-gray-900">
        <p className="text-xl font-semibold text-error dark:text-red-400">
          Error: {error?.response?.data?.message || "Failed to load profile"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-base-100 dark:bg-gray-900 min-h-screen p-6 flex items-center justify-center pt-24">
      <div className="bg-gradient-to-tr from-teal-400 to-teal-200 dark:from-teal-800 dark:to-teal-600 card w-full max-w-md bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl shadow-xl border border-gray-300/50 dark:border-gray-700/50 hover:shadow-2xl text-base-content dark:text-gray-100 hover:border-white dark:hover:border-gray-500 transition-all duration-500 p-6 rounded-2xl">
        <div className="relative flex justify-center mb-6">
          <div className="avatar indicator">
            <span
              className={`indicator-item badge badge-sm ${
                isOnline ? "badge-success animate-bounce" : "badge-error"
              } translate-x-[-8px] translate-y-[8px]`}
            ></span>
            <div className="w-36 rounded-full ring ring-offset-4 ring-offset-white dark:ring-offset-gray-900 ring-accent transition-all duration-300 hover:ring-offset-4 hover:ring-primary hover:scale-105">
              <img
                src={profileImage}
                alt="Profile"
                className="object-cover rounded-full cursor-pointer"
                onClick={() => fileInputRef.current.click()}
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
        <div className="text-center space-y-4">
          <h1
            className="text-4xl font-[Playfair Display] font-bold bg-clip-text bg-gradient-to-r from-black via-teal-900 to-teal-500 dark:from-gray-300 dark:via-teal-600 dark:to-teal-400 animate-pulse"
          >
            {user?.name || "No Name"}
          </h1>
          <div className="space-y-2">
            <p className="text-lg text-gray-900 dark:text-gray-200">
              Email: <span className="font-semibold">{user?.email || "No Email"}</span>
            </p>
            <p className="text-lg text-gray-900 dark:text-gray-200">
              Phone: <span className="font-semibold">{user?.phoneNumber || "No Phone"}</span>
            </p>
            <p className="text-lg text-gray-900 dark:text-gray-200">
              Address: <span className="font-semibold">{user?.address || "No Address"}</span>
            </p>
          </div>
        </div>
        <div className="mt-8 space-y-3">
          <button
            className="btn w-full font-[Playfair Display] text-lg text-white bg-gradient-to-r from-teal-400 to-teal-900 dark:from-teal-600 dark:to-teal-700 hover:from-teal-600 hover:to-teal-500 dark:hover:from-teal-500 dark:hover:to-teal-600 transition-all duration-300 transform hover:-translate-y-1 rounded-xl"
            onClick={() => navigate("/user/edit-profile")}
          >
            Edit Profile
          </button>
          <button
            className="btn w-full font-[Playfair Display] text-lg text-white bg-gradient-to-r from-teal-400 to-teal-900 dark:from-teal-600 dark:to-teal-700 hover:from-teal-600 hover:to-teal-500 dark:hover:from-teal-500 dark:hover:to-teal-600 transition-all duration-300 transform hover:-translate-y-1 rounded-xl"
            onClick={() => navigate("/change-password")}
          >
            Change Password
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
          html {
            transition: background-color 0.3s ease, color 0.3s ease;
          }
        `}</style>
      </div>
    </div>
  );
};