import React from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../../config/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
 import { useDispatch } from "react-redux";
 import { clearUser, saveUser } from "../../redux/features/userSlice";
// import toast from "react-hot-toast";

export const LoginPage = ({ role }) => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = {
        role: "user",
        loginAPI: "/user/login",
        profileRoute: "/user/profile",
        signupRoute: "/signup",
    };

    if (role == "seller") {
        user.role = "seller";
        user.loginAPI = "/seller/login";
        (user.profileRoute = "/seller/profile"), (user.signupRoute = "/seller/signup");
    }

    const onSubmit = async (data) => {
        console.log(data);

        try {
            const response = await axiosInstance({
                method: "POST",
                url: user.loginAPI,
                data: data,
            });
            console.log("response====", response);
            dispatch(saveUser(response?.data?.data));
            // toast.success("Login success");
            navigate(user.profileRoute);
        } catch (error) {
             dispatch(clearUser());
            // toast.error("Login Failed");
            console.log(error);
        }
    };

    return (
        <div className="bg-base-200 hero min-h-screen">
            <div className="flex-col hero-content lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold"> {user.role} Login! </h1>
                    <p className="py-6">
                    Z Fashion - Your Ultimate Fashion Destination
                    </p>
                </div>
                <div className="card bg-base-100 shadow-2xl w-full max-w-sm shrink-0">
                    <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" placeholder="email" {...register("email")} className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="password"
                                {...register("password")}
                                className="input input-bordered"
                                required
                            />

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Confirm Password</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="confirm-password"
                                    {...register("confirmPassword")}
                                    className="input input-bordered"
                                    required
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <label className="label">
                                    <a href="#" className="label-text-alt link link-hover">
                                        Forgot password?
                                    </a>
                                </label>
                                <label className="label">
                                    <Link to={user.signupRoute} className="label-text-alt link link-hover">
                                    New User?
                                    </Link>
                                </label>
                            </div>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn bg-black text-white w-full">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};