import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axiosInstance";
// Import axiosInstance

export const ResetPassword = () => {
  const [email, setEmail] = useState(""); // State for storing email from URL
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the email parameter from the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam); // Set the email from the query string
    }
  }, [location]);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axiosInstance.post("/user/reset-password", {
        email: email, // email received in URL query
        newPassword: data.password, // New password from form
      });
      toast.success(response.data.message || "Password reset successfully");
      navigate("/login"); // Redirect to login page after password reset
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      console.error(error);
    }
  };

  return (
    <div className="bg-base-100 flex items-center justify-center  py-10 px-4 min-h-screen">
      <div className="text-base-content shadow-2xl rounded-lg w-full max-w-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Reset Password</h1>
        <p className="text-center ">Enter your new password below.</p>

        <form
          className="flex flex-col items-center space-y-6 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* New Password */}
          <div className="w-full">
            <input
              type="password"
              placeholder="New Password"
              {...register("password", { required: "New Password is required" })}
              className="w-full h-12 p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.password && (
              <span className="text-red-500 text-xs">{errors.password.message}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="w-full">
            <input
              type="password"
              placeholder="Confirm New Password"
              {...register("confirmPassword", { required: "Please confirm your password" })}
              className="w-full h-12 p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-12 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};
