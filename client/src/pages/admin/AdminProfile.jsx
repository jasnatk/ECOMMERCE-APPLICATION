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

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const res = await axiosInstance.get("/admin/profile");
        const { name, phoneNumber, address, profilePic } = res.data.data;
        setAdmin(res.data.data);
        setFormData({ name, phoneNumber: phoneNumber || "", address: address || "" });
        setProfilePic(profilePic || "/image/fauser1.png");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load admin profile");
        navigate("/admin/login");
      }
    };
    fetchAdminProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  if (!admin) {
    return (
      <div className="min-h-screen bg-base-100 flex">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 md:ml-64 flex items-center min-h-screen pt-16">
          <div className="w-full max-w-4xl mx-auto ml-[-2rem] md:ml-[-4rem] bg-base-200 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center">
            {/* Profile Picture Skeleton */}
            <div className="w-40 h-40 bg-base-200 rounded-full animate-pulse border-4 border-base-300"></div>
            {/* Details/Form Skeleton */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="h-8 w-48 bg-base-200 rounded animate-pulse mx-auto md:mx-0"></div>
              <div className="h-6 w-64 bg-base-200 rounded animate-pulse mx-auto md:mx-0"></div>
              <div className="h-6 w-48 bg-base-200 rounded animate-pulse mx-auto md:mx-0"></div>
              <div className="h-6 w-80 bg-base-200 rounded animate-pulse mx-auto md:mx-0"></div>
              <div className="h-10 w-32 bg-base-200 rounded-lg animate-pulse mx-auto md:mx-0"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 flex text-base-content">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 md:ml-64 flex items-center min-h-screen pt-16">
        <AdminHeader setSidebarOpen={setSidebarOpen} />
        <main className="w-full">
          <h1 className="text-2xl font-bold text-purple-700 mb-6 text-center">
            ADMIN PROFILE
          </h1>
          <div className="w-full max-w-4xl mx-auto ml-[-2rem] md:ml-[-4rem] bg-base-200 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={profilePic}
                alt="Admin Profile"
                className="w-40 h-40 object-cover rounded-full border-4 border-base-300"
                onError={(e) => {
                  e.target.src = "https://placehold.co/150x150?text=No+Image";
                }}
              />
              {isEditing && (
                <>
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 bg-teal-600 text-white rounded-full p-2 shadow-md hover:bg-teal-700 transition disabled:bg-teal-400"
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
                    <label className="block text-sm font-medium text-base-content">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none disabled:bg-base-200 text-base-content"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content">
                      Email
                    </label>
                    <input
                      type="email"
                      value={admin.email}
                      className="mt-1 w-full px-4 py-2 bg-base-200 border border-base-300 rounded-lg text-base-content"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none disabled:bg-base-200 text-base-content"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-base-content">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="mt-1 w-full px-4 py-2 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none disabled:bg-base-200 text-base-content"
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
                      className="bg-base-300 hover:bg-base-400 text-base-content font-semibold py-2 px-4 rounded-lg transition-all"
                      onClick={toggleEditMode}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-base-content">{admin.name}</h2>
                  <p className="text-base-content">
                    <span className="font-medium">Email:</span> {admin.email}
                  </p>
                  <p className="text-base-content">
                    <span className="font-medium">Phone:</span> {admin.phoneNumber || "N/A"}
                  </p>
                  <p className="text-base-content">
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