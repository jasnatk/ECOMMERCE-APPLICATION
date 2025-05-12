import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axiosInstance";
import { Sidebar } from "../../Components/admin/AdminDashboard";
import { AdminHeader } from "../../Components/admin/AdminHeader";
import { PencilIcon } from "@heroicons/react/24/solid";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    address: "",
  });
  const [profilePic, setProfilePic] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch admin profile on mount
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await axiosInstance.get("/admin/profile");
        const { name, phoneNumber, address, profilePic } = res.data.data;
        setAdmin(res.data.data);
        setFormData({ name, phoneNumber: phoneNumber || "", address: address || "" });
        setProfilePic(profilePic || "/image/fauser1.png"); // Default to fauser1.png
      } catch (err) {
        console.error(err);
        toast.error("Failed to load admin profile");
        navigate("/admin/login");
      }
    };
    fetchAdminProfile();
  }, [navigate]);

  // Handle input changes in edit mode
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile picture upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append("profilePic", file);

    try {
      const res = await axiosInstance.post("/admin/upload-profile-pic", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfilePic(res.data.data.profilePic);
      setAdmin((prev) => ({ ...prev, profilePic: res.data.data.profilePic }));
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Error uploading profile picture");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.phoneNumber) {
      toast.error("Name and phone number are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axiosInstance.put("/admin/profile", formData);
      setAdmin(res.data.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-700 dark:text-white animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 md:ml-64 pt-16 transition-all duration-300">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        <main className="p-6">
          <h1 className="text-2xl font-bold text-purple-700 dark:text-white mb-6 text-center">
            ADMIN PROFILE
          </h1>
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 flex flex-col md:flex-row gap-6 items-center">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={profilePic}
                alt="Admin Profile"
                className="w-40 h-40 object-cover rounded-full border-4 border-gray-200 dark:border-gray-700"
                onError={(e) => {
                  e.target.src = "https://placehold.co/150x150?text=No+Image"; // Fallback to placeholder
                }}
              />
              {isEditing && (
                <>
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
                </>
              )}
            </div>

            {/* Profile Details or Edit Form */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none disabled:bg-gray-100 text-black dark:text-gray-800"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Email
                    </label>
                    <input
                      type="email"
                      value={admin.email}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-black dark:text-gray-800"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none disabled:bg-gray-100 text-black dark:text-gray-800"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none disabled:bg-gray-100 text-black dark:text-gray-800"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex gap-4 justify-center md:justify-start">
                    <button
                      type="submit"
                      className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:bg-teal-400 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                      onClick={toggleEditMode}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{admin.name}</h2>
                  <p className="text-gray-700 dark:text-gray-200">
                    <span className="font-medium">Email:</span> {admin.email}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200">
                    <span className="font-medium">Phone:</span> {admin.phoneNumber || "N/A"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200">
                    <span className="font-medium">Address:</span> {admin.address || "N/A"}
                  </p>
                  <button
                    className="mt-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                    onClick={toggleEditMode}
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfile;