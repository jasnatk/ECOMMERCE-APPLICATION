import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { generateToken } from "../utilities/token.js";

const NODE_ENV = process.env.NODE_ENV;

// Utility: Set cookie options
const setTokenCookie = (res, token) => {
    res.cookie("token", token, {
        sameSite: NODE_ENV === "production" ? "None" : "Lax",
        secure: NODE_ENV === "production",
        httpOnly: NODE_ENV === "production",
    });
};

// 1. User Signup
export const userSignUp = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, address, phoneNumber, profilePic } = req.body;

        if (!name || !email || !password || !confirmPassword || !phoneNumber) {
            return res.status(400).json({ message: "All fields required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phoneNumber,
            address,
            profilePic
        });

        await newUser.save();

        const token = generateToken(newUser._id, "user");
        setTokenCookie(res, token);

        const userWithoutPassword = await User.findById(newUser._id).select("-password");

        res.status(201).json({ data: userWithoutPassword, message: "Signup successful" });
    } catch (error) {
        console.log("Error in Signup:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// 2. User Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.isActive) {
            return res.status(401).json({ message: "User account is not active" });
        }

        const token = generateToken(user._id, "user");
        setTokenCookie(res, token);

        const userWithoutPassword = await User.findById(user._id).select("-password");

        res.json({ data: userWithoutPassword, message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. User Logout
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });
        res.json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Check User Authorization
export const checkUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ data: user, message: "User authorized" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};


// 5. Get User Profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ data: user, message: "User profile fetched" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. Update User Profile
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email?.toLowerCase() || user.email;
        user.address = req.body.address || user.address;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.profilePic = req.body.profilePic || user.profilePic;

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await user.save();
        const userWithoutPassword = await User.findById(updatedUser._id).select("-password");
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 7. Forgot Password (Stub for email logic)
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // TODO: Add email service to send reset link/token
        res.json({ message: "Password reset link sent to email" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 8. Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 9. Change Password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
