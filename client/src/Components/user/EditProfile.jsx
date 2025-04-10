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
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full border px-4 py-2 rounded" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border px-4 py-2 rounded" />
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="w-full border px-4 py-2 rounded" />
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full border px-4 py-2 rounded" />
                <input type="text" name="profilePic" value={formData.profilePic} onChange={handleChange} placeholder="Profile Picture URL" className="w-full border px-4 py-2 rounded" />
                <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">Update Profile</button>
            </form>
        </div>
    );
};
