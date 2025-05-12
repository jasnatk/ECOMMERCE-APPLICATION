import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../config/axiosInstance";
import { PencilIcon } from "@heroicons/react/24/solid";

const SellerProfile = () => {
  const [seller, setSeller] = useState(null);
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

  // Fetch seller profile on mount
  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        const res = await axiosInstance.get("/seller/profile");
        const { name, phoneNumber, address, profilePic } = res.data.userData;
        setSeller(res.data.userData);
        setFormData({ name, phoneNumber, address });
        setProfilePic(profilePic || "/image/fauser1.png"); // Default to fauser1.png
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
        navigate("/seller/login");
      }
    };
    fetchSellerProfile();
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
      const res = await axiosInstance.post("/seller/upload-profile-pic", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfilePic(res.data.data.profilePic);
      setSeller((prev) => ({ ...prev, profilePic: res.data.data.profilePic }));
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
      const res = await axiosInstance.put("/seller/profile", formData);
      setSeller(res.data.userData);
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

  if (!seller) {
    return <div className="text-center py-10 text-xl font-medium">Loading...</div>;
  }

  return (
    <div className="p-6 min-h-screen pt-44 bg-gradient-to-br from-purple-400 via-indigo-600 to-blue-700 text-white">
      <div className="max-w-4xl mx-auto shadow-xl rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={profilePic}
            alt="Seller Profile"
            className="bg-base-200 w-40 h-40 object-cover rounded-full border-4 border-gray-200"
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
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none disabled:bg-gray-100 text-black"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={seller.email}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-black"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none disabled:bg-gray-100 text-black"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none disabled:bg-gray-100 text-black"
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
              <h2 className="text-2xl font-semibold">{seller.name}</h2>
              <p><span className="font-medium">Email:</span> {seller.email}</p>
              <p><span className="font-medium">Phone:</span> {seller.phoneNumber}</p>
              <p><span className="font-medium">Address:</span> {seller.address}</p>
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
    </div>
  );
};

export default SellerProfile;