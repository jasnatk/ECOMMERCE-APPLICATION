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
            await axiosInstance.put("/user/editprofile", formData);
            toast.success("Profile updated successfully!");
            navigate("/user/profile");
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Error updating profile");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-24 bg-gray-100 ">
            <div className="w-3/4 md:w-[450px] bg-white p-8 rounded-2xl shadow-lg">

                <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                    Edit Your Profile
                </h2>

                {/* Profile Pic Preview */}
                {formData.profilePic && (
                    <div className="flex justify-center mb-6">
                        <img
                            src={formData.profilePic}
                            alt="Profile Preview"
                            className="h-24 w-24 rounded-full object-cover border-2 border-teal-500 shadow-sm"
                        />
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
/>
                        
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                             className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
                        <input
                            type="text"
                            name="profilePic"
                            value={formData.profilePic}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition-all"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};
   