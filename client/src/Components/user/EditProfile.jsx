import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";


export const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        profilePic: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get("/user/profile");
                const { name, email, phone, address, profilePic } = res.data.data;
                setFormData({ name, email, phone, address, profilePic });
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
        <div className="min-h-screen bg-gradient-to-br from-gray-800 via-indigo-900 to-purple-500 flex items-center justify-center p-6">
            <div className="card w-full max-w-md bg-white backdrop-blur-2xl shadow-2xl border border-purple-600/50 hover:shadow-[0_0_30px_rgba(147,51,234,0.4)] transition-all duration-500 p-8 rounded-3xl relative overflow-hidden">
                {/* Subtle Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-800/20 to-transparent rounded-3xl -z-10 animate-fadeIn"></div>

                {/* Title */}
                <h2 className="text-4xl font-[Playfair Display] font-bold text-purple-900 text-center mb-8 bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 animate-gradientText">
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
                            className="input input-bordered w-full bg-indigo-900/50 text-white placeholder-purple-300 border-purple-600 focus:border-indigo-300 focus:ring-2 focus:ring-purple-400 rounded-xl p-4 transition-all duration-300 hover:bg-indigo-800/70 hover:shadow-[0_0_12px_rgba(147,51,234,0.3)]"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="input input-bordered w-full bg-indigo-900/50 text-white placeholder-purple-300 border-purple-600 focus:border-indigo-300 focus:ring-2 focus:ring-purple-400 rounded-xl p-4 transition-all duration-300 hover:bg-indigo-800/70 hover:shadow-[0_0_12px_rgba(147,51,234,0.3)]"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className="input input-bordered w-full bg-indigo-900/50 text-white placeholder-purple-300 border-purple-600 focus:border-indigo-300 focus:ring-2 focus:ring-purple-400 rounded-xl p-4 transition-all duration-300 hover:bg-indigo-800/70 hover:shadow-[0_0_12px_rgba(147,51,234,0.3)]"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Address"
                            className="input input-bordered w-full bg-indigo-900/50 text-white placeholder-purple-300 border-purple-600 focus:border-indigo-300 focus:ring-2 focus:ring-purple-400 rounded-xl p-4 transition-all duration-300 hover:bg-indigo-800/70 hover:shadow-[0_0_12px_rgba(147,51,234,0.3)]"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            name="profilePic"
                            value={formData.profilePic}
                            onChange={handleChange}
                            placeholder="Profile Picture URL"
                            className="input input-bordered w-full bg-indigo-900/50 text-white placeholder-purple-300 border-purple-600 focus:border-indigo-300 focus:ring-2 focus:ring-purple-400 rounded-xl p-4 transition-all duration-300 hover:bg-indigo-800/70 hover:shadow-[0_0_12px_rgba(147,51,234,0.3)]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn w-full font-[Playfair Display] text-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-[0_0_20px_rgba(147,51,234,0.7)] transition-all duration-300 transform hover:-translate-y-2 rounded-xl"
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