import User from "../models/userModel.js";  
import bcrypt from 'bcryptjs';
import { generateToken } from "../utilities/token.js";

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

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
