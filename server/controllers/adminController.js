import User from "../models/userModel.js";  
import bcrypt from 'bcryptjs';
import { generateToken } from "../utilities/token.js";
import Seller from "../models/sellerModel.js";
import uploadToCloudinary, { destroyImageFromCloudinary, getPublicIdFromUrl } from "../utilities/imageUpload.js";

// Admin Registration
export const adminSignUp = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phoneNumber, address, profilePic } = req.body;

    if (!name || !email || !password || !confirmPassword || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const adminExists = await User.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({ name, email, password: hashedPassword, phoneNumber, address, profilePic, role: 'admin' });
    await newAdmin.save();

    const token = generateToken(newAdmin._id, 'admin');

    res.cookie('token', token, {
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    res.status(201).json({ data: newAdmin, message: "Admin registration successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!admin.isActive) {
      return res.status(401).json({ message: "Admin account is not active" });
    }

    const token = generateToken(admin._id, 'admin');

    res.cookie('token', token, {
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    res.json({ data: admin, message: "Admin login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Logout
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });

    res.json({ message: "Admin logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user data found" });
    }

    const adminData = await User.findById(req.user.id);
    if (!adminData || adminData.role !== 'admin') {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ data: adminData, message: "Admin profile fetched" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check Admin Authorization
export const checkAdmin = async (req, res, next) => {
  try {
    res.json({ message: "Admin authorized" });
  } catch (error) {
    res.status(error.statuscode || 500).json({ message: error.message || "Internal server error" });
  }
};


// Deactivate User
export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = false;
    await user.save();

    res.status(200).json({ message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// Get all users (for admin dashboard)
export const getAllUsers = async (req, res) => {
  try {
      const users = await User.find().select('-password'); 
      res.json({ users });
  } catch (error) {
      console.log("Error in getAllUsers:", error.message);
      res.status(500).json({ message: error.message || "Internal server error" });
  }
};
 

// Verify Seller
export const verifySeller = async (req, res) => {
  try {
    const sellerId = req.params.id;
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.isVerified = !seller.isVerified; // Toggle verification status
    await seller.save();

    res.status(200).json({
      success: true,
      message: `Seller ${seller.isVerified ? 'verified' : 'unverified'} successfully`,
      seller,
    });
  } catch (error) {
    console.error("Error in verifySeller:", error); // Enhanced logging
    res.status(500).json({ 
      message: "Failed to update seller verification status",
      error: error.message, // Include error message for debugging
    });
  }
};
// Update Admin Profile
export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { name, phoneNumber, address } = req.body;

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.name = name || admin.name;
    admin.phoneNumber = phoneNumber || admin.phoneNumber;
    admin.address = address || admin.address;

    await admin.save();

    const adminWithoutPassword = await User.findById(adminId).select("-password");
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: adminWithoutPassword,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: error.message || "Failed to update profile" });
  }
};


// Upload Admin Profile Picture
export const uploadAdminProfilePic = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id);
    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.path);

    // Delete old profile picture from Cloudinary if it exists
    if (admin.profilePic) {
      const publicId = getPublicIdFromUrl(admin.profilePic);
      if (publicId) {
        await destroyImageFromCloudinary(publicId);
      }
    }

    // Update admin with new profile picture URL
    admin.profilePic = uploadResult.url;
    await admin.save();

    const adminWithoutPassword = await User.findById(admin._id).select("-password");
    res.json({
      success: true,
      message: "Profile picture updated successfully",
      data: adminWithoutPassword,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error.message);
    res.status(500).json({ message: error.message || "Failed to upload profile picture" });
  }
};