import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        // Fetch user data
        const fetchData = async () => {
            const res = await axios.get("/user/editprofile");
            const { name, email, phoneNumber, address, profilePic } = res.data.data;
            setFormData({ name, email, phoneNumber, address, profilePic });
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put("/user/editprofile", formData);
            alert("Profile updated!");
            navigate("/user/profile");
        } catch (error) {
            alert("Error updating profile");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full border px-4 py-2 rounded" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border px-4 py-2 rounded" />
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="w-full border px-4 py-2 rounded" />
                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full border px-4 py-2 rounded" />
                <input type="text" name="profilePic" value={formData.profilePic} onChange={handleChange} placeholder="Profile Picture URL" className="w-full border px-4 py-2 rounded" />

                <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">Update Profile</button>
            </form>
        </div>
    );
};
