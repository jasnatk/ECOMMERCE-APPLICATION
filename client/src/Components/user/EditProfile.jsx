import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";
import { PencilIcon } from "@heroicons/react/24/solid";

export const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
    });
    const [profilePic, setProfilePic] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get("/user/profile");
                const { name, email, phoneNumber, address, profilePic } = res.data.data;
                setFormData({ name, email, phoneNumber, address });
                setProfilePic(profilePic ||"/image/fauser1.png");
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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profilePic", file);

        try {
            const res = await axiosInstance.post("/user/upload-profile-pic", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setProfilePic(res.data.data.profilePic);
            toast.success("Profile picture updated!");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error.response?.data?.message || "Error uploading profile picture");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Basic form validation
        if (!formData.name || !formData.email || !formData.phoneNumber) {
            toast.error("Name, email, and phone number are required.");
            setIsSubmitting(false);
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address.");
            setIsSubmitting(false);
            return;
        }

        try {
            await axiosInstance.put("/user/editprofile", formData);
            toast.success("Profile updated successfully!");
            navigate("/user/profile");
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.response?.data?.message || "Error updating profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-24 bg-gray-100">
            <div className="w-3/4 md:w-[450px] bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
                    Edit Your Profile
                </h2>

                {/* Profile Pic Preview and Upload */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <img
                            src={profilePic}
                            alt="Profile Preview"
                            className="h-24 w-24 rounded-full object-cover border-2 border-teal-500 shadow-sm"
                            onError={(e) => {
                                e.target.src = "https://placehold.co/150x150?text=No+Image";
                            }}
                        />
                        <button
                            type="button"
                            className="absolute bottom-0 right-0 bg-teal-600 text-white rounded-full p-2 shadow-md hover:bg-teal-700 transition"
                            onClick={() => fileInputRef.current.click()}
                            disabled={isSubmitting}
                        >
                            <PencilIcon className="h-5 w-5" />
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none disabled:bg-gray-100"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none disabled:bg-gray-100"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none disabled:bg-gray-100"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none disabled:bg-gray-100"
                            disabled={isSubmitting}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition-all disabled:bg-teal-400 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;