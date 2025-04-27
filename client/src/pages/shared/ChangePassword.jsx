import React, { useState } from "react";
import axios from "axios";
import { axiosInstance } from "../../config/axiosInstance";

const ChangePassword = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
        const response = await axiosInstance.put("/user/change-password", form);

      setMessage(response.data.message);
      setForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="pt-24 mb-16">
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-xl font-bold text-base-content mb-4 font-playfair">
      <h2 className="text-2xl font-bold mb-4 text-center">Change Password</h2>
      
      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <button
  type="submit"
  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm p-4 rounded-md hover:from-teal-600 hover:to-teal-700 transition-all duration-300 flex items-center justify-center"
>
  Update Password
</button>

      </form>
    </div></div>
  );
};

export default ChangePassword;
