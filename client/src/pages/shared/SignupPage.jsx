import React from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../config/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

export const SignupPage = ({ role }) => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const user = {
        role: "user",
        signupAPI: "/user/signup",
        loginRoute: "/login",
    };

    if (role === "seller") {
        user.role = "seller";
        user.signupAPI = "/seller/signup";
        user.loginRoute = "/seller/login";
    }

    const onSubmit = async (data) => {
        console.log(data);

        try {
            const response = await axiosInstance({
                method: "POST",
                url: user.signupAPI,
                data: data,
            });
            console.log("response====", response);
            navigate(user.loginRoute);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-base-200 hero min-h-screen">
            <div className="flex-col hero-content lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold"> {user.role} Signup! </h1>
                    <p className="py-6"> Z Fashion - Your Ultimate Fashion Destination </p>
                </div>
                <div className="card bg-base-100 shadow-2xl w-full max-w-sm shrink-0">
                    <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input type="text" placeholder="Name" {...register("name")} className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" placeholder="Email" {...register("email")} className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Phone Number</span>
                            </label>
                            <input type="text" placeholder="Phone Number" {...register("phoneNumber")} className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Address</span>
                            </label>
                            <input type="text" placeholder="Address" {...register("address")} className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Profile Picture URL</span>
                            </label>
                            <input type="text" placeholder="Profile Picture URL" {...register("profilePic")} className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" placeholder="Password" {...register("password")} className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <input type="password" placeholder="Confirm Password" {...register("confirmPassword")} className="input input-bordered" required />
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn bg-black text-white w-full">Signup</button>
                        </div>
                        <div className="text-center mt-4">
                            <p>
                                Already have an account? <Link to={user.loginRoute} className="link link-hover">Login</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
