import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../config/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

export const SignupPage = ({ role }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const user = {
        role: "user",
        signupAPI: "/user/signup",
        loginRoute: "/login",
        redirectRoute: "/product",
    };
    
    if (role === "seller") {
        user.role = "seller";
        user.signupAPI = "/seller/signup";
        user.loginRoute = "/seller/login";
        user.redirectRoute = "/seller/login";
    }
    
    if (role === "admin") {
        user.role = "admin";
        user.signupAPI = "/admin/signup";
        user.loginRoute = "/admin/login";
        user.redirectRoute = "/admin/login";
    }
    
    const password = watch("password");

    const onSubmit = async (data) => {
        try {
            const userData = {
                ...data,
                role: user.role,
              };
              
            await axiosInstance.post(user.signupAPI, userData);
            toast.success("Signup successful!");
    
            setTimeout(() => {
                navigate(user.redirectRoute);
            }, 1000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed. Try again.");
        }
    };
    

    return (
        <div className="flex items-center justify-center bg-base-200 py-6 min-h-screen">
            <div className="bg-white shadow-2xl rounded-lg flex flex-col lg:flex-row w-full max-w-4xl overflow-hidden">
                {/* Left Side - Image */}
                <div className="hidden lg:flex w-full lg:w-1/2">
                    <img
                        src="/image/s1.jpg"
                        alt="Signup"
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Right Side - Signup Form */}
                <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center items-center space-y-6">
                    <h1 className="text-4xl font-bold text-center">{user.role} Signup</h1>
                    <p className="text-center text-gray-600">Z Fashion - Your Ultimate Fashion Destination</p>
                    <form className="flex flex-col items-center space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
                        <input type="text" placeholder="Name" {...register("name", { required: "Name is required" })} className="input input-bordered w-full max-w-xs" />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

                        <input type="email" placeholder="Email" {...register("email", { required: "Email is required" })} className="input input-bordered w-full max-w-xs" />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                        <input type="text" placeholder="Phone Number" {...register("phoneNumber", { required: "Phone number is required" })} 
 className="input input-bordered w-full max-w-xs" />
                        {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

                        <input type="text" placeholder="Address" {...register("address", { required: "Address is required" })} className="input input-bordered w-full max-w-xs" />
                        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}

                        <input type="text" placeholder="Profile Picture URL" {...register("profilePic")} className="input input-bordered w-full max-w-xs" />

                        <input type="password" placeholder="Password" {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" }
                        })} className="input input-bordered w-full max-w-xs" />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                        <input type="password" placeholder="Confirm Password" {...register("confirmPassword", {
                            required: "Confirm password is required",
                            validate: value => value === password || "Passwords do not match"
                        })} className="input input-bordered w-full max-w-xs" />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}

                        <button className="w-full max-w-xs h-12 bg-black text-white rounded-md mt-4 hover:bg-gray-800">Signup</button>
                    </form>

                    <p className="text-sm text-gray-600">Already have an account? <Link to={user.loginRoute} className="text-blue-500 hover:underline">Login</Link></p>
                </div>
            </div>
        </div>
    );
};
