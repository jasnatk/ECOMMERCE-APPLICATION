import React from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../config/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser, saveUser } from "../../redux/features/userSlice";
import toast from "react-hot-toast";

export const LoginPage = ({ role }) => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = {
    role: "User",
    loginAPI: "/user/login",
    profileRoute: "/user/profile",
    signupRoute: "/signup",
    image: "/image/cart1.jpg", // Default image for User login
  };

  if (role === "seller") {
    user.role = "Seller";
    user.loginAPI = "/seller/login";
    user.profileRoute = "/seller/profile";
    user.signupRoute = "/seller/signup";
    user.image = "/image/seller1.jpg"; // Image for Seller login
  } else if (role === "admin") {
    user.role = "Admin";
    user.loginAPI = "/admin/login";
    user.profileRoute = "/admin/dashboard";
    user.signupRoute = "/admin/signup";
    user.image = "/image/admin-login.jpg"; // Image for Admin login
  }

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(user.loginAPI, data);

      if (role === "seller") {
        dispatch(saveUser(response?.data?.data)); // Dispatch seller login
      } else {
        dispatch(saveUser(response?.data?.data)); // Default user login
      }

      toast.success("Login successful");
      navigate(role === "admin" ? "/admin/dashboard" : "/"); // Redirect based on role
    } catch (error) {
      dispatch(clearUser());
      toast.error("Login Failed");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-base-200 py-6">
      <div className="bg-white shadow-2xl rounded-lg flex flex-col lg:flex-row w-full max-w-4xl overflow-hidden">
        
        {/* Left Side - Image */}
        <div className="hidden lg:flex w-full lg:w-1/2">
          <img
            src={user.image} // Use dynamic image based on role
            alt="Login"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center items-center space-y-6">
          <h1 className="text-4xl font-bold text-center">{user.role} Login</h1>
          <p className="text-center text-gray-600">Z Fashion - Your Ultimate Fashion Destination</p>

          <form
            className="flex flex-col items-center space-y-6 w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full max-w-xs">
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                className="w-full h-12 p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div className="w-full max-w-xs">
              <input
                type="password"
                placeholder="Password"
                {...register("password")}
                className="w-full h-12 p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div className="w-full max-w-xs flex justify-between text-sm text-gray-600">
              <Link to="/forgot-password" className="hover:underline">
                Forgot password?
              </Link>
              <Link to="/reset-password" className="hover:underline">
                Reset password?
              </Link>
              <Link to={user.signupRoute} className="hover:underline">
                New {user.role}?
              </Link>
            </div>

            <button className="w-full max-w-xs h-12 bg-black text-white rounded-md mt-4 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
