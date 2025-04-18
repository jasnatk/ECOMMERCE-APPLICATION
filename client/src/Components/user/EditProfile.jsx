import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";


export const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        profilePic: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get("/user/profile");
                const { name, email, phoneNumber, address, profilePic } = res.data.data;
                setFormData({ name, email, phoneNumber, address, profilePic });
            } catch (err) {
                console.error("Fetch error:", err);
                toast.error("Unable to load profile data.");
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.put("/user/editprofile", formData);
            toast.success("Profile updated successfully!");
            navigate("/user/profile");
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Error updating profile");
        }
    };

    return (
        <div className="min-h-screen  flex items-center justify-center p-6 ">
            <div className="bg-gradient-to-tr from-teal-400  to-teal-600 card w-full max-w-md bg-white/30 backdrop-blur-xl shadow-xl border border-gray-300/50 hover:shadow-2xl hover:border-white transition-all duration-500 p-6 rounded-2xl">
                {/* Subtle Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-teal-800/20 to-transparent rounded-3xl -z-10 animate-fadeIn"></div>

                {/* Title */}
                <h2 className="text-4xl font-[Playfair Display] font-bold text-white text-center mb-8 bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-teal-400 animate-gradientText">
                    Edit Profile
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name"
                            className="input input-bordered w-full font-bold bg-teal-100/50 text-white placeholder-teal-300 border-teal-600 focus:border-teal-300 focus:ring-2 focus:ring-teal-400 rounded-xl p-4 transition-all duration-300 hover:bg-teal-800/70 hover:shadow-[0_0_12px_rgba(14,51,34,0.3)]"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="input input-bordered w-full font-bold bg-teal-100/50 text-white placeholder-teal-300 border-teal-600 focus:border-teal-300 focus:ring-2 focus:ring-teal-400 rounded-xl p-4 transition-all duration-300 hover:bg-teal-800/70 hover:shadow-[0_0_12px_rgba(14,51,34,0.3)]"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className="input input-bordered w-full font-bold bg-teal-100/50 text-white placeholder-teal-300 border-teal-600 focus:border-teal-300 focus:ring-2 focus:ring-teal-400 rounded-xl p-4 transition-all duration-300 hover:bg-teal-800/70 hover:shadow-[0_0_12px_rgba(14,51,34,0.3)]"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Address"
                            className="input input-bordered w-full font-bold bg-teal-100/50 text-white placeholder-teal-300 border-teal-600 focus:border-teal-300 focus:ring-2 focus:ring-teal-400 rounded-xl p-4 transition-all duration-300 hover:bg-teal-800/70 hover:shadow-[0_0_12px_rgba(14,51,34,0.3)]"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            name="profilePic"
                            value={formData.profilePic}
                            onChange={handleChange}
                            placeholder="Profile Picture URL"
                            className="input input-bordered w-full font-bold bg-teal-100/50 text-white placeholder-teal-300 border-teal-600 focus:border-teal-300 focus:ring-2 focus:ring-teal-400 rounded-xl p-4 transition-all duration-300 hover:bg-teal-800/70 hover:shadow-[0_0_12px_rgba(14,51,34,0.3)]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn w-full font-[Playfair Display] text-xl text-white  bg-gradient-to-r from-teal-600 to-teal-600 hover:from-teal-700 hover:to-teal-700 hover:shadow-[0_0_20px_rgba(14,51,34,0.7)] transition-all duration-300 transform hover:-translate-y-2 rounded-xl"
                    >
                        Update Profile
                    </button>
                </form>

                {/* Inline CSS for Animations */}
                <style>{`
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.98);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    @keyframes gradientText {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    .animate-fadeIn {
        animation: fadeIn 0.6s ease-in forwards;
    }
    .animate-gradientText {
        background-size: 200% 200%;
        animation: gradientText 5s ease infinite;
    }
`}</style>

            </div>
        </div>
    );
};