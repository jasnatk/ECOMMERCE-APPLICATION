import bcrypt from "bcrypt";
import { generateToken } from "../utilities/token.js";
import Seller from "../models/sellerModel.js";

const NODE_ENV = process.env.NODE_ENV;

// Seller Signup
export const sellerSignup = async (req, res, next) => {
    try {
        const { name, email, password, phone, address, profilePic } = req.body;

        // Data validation
        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        // Check if the seller already exists
        const isSellerExist = await Seller.findOne({ email });
        if (isSellerExist) {
            return res.status(400).json({ message: "Seller already exists" });
        }

        // Create a new seller (NO HASHING HERE)
        const newSeller = new Seller({ name, email, password, phone, address, profilePic });
        await newSeller.save();

        // Generate token
        const token = generateToken(newSeller._id, "seller");

        // Set token in cookies
        res.cookie("token", token, {
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });

        res.json({ success: true, message: "Seller account created successfully" });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json(error.message || "Internal server error");
    }
};

// Seller Login
export const sellerLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isSellerExist = await Seller.findOne({ email });

        if (!isSellerExist) {
            return res.status(404).json({ success: false, message: "Seller does not exist" });
        }

        const passwordMatch = await isSellerExist.comparePassword(password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = generateToken(isSellerExist._id, "seller");

        res.cookie("token", token, {
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });

        res.json({ success: true, message: "Seller login successful" });

    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json(error.message || "Internal server error");
    }
};


// Get Seller Profile
export const sellerProfile = async (req, res, next) => {
    try {
        const { user } = req;

        // Fetch the seller data without the password
        const userData = await Seller.findById(user.id).select("-password");

        res.json({ success: true, message: "Seller profile fetched", userData });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json(error.message || "Internal server error");
    }
};

// Seller Logout
export const sellerLogout = async (req, res, next) => {
    try {
        // Clear the token cookie
        res.clearCookie("token", {
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });
        res.json({ success: true, message: "Seller logged out successfully" });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json(error.message || "Internal server error");
    }
};

// Check if Seller is Authorized
export const checkSeller = async (req, res, next) => {
    try {
        res.json({ success: true, message: "Seller authorized" });
    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json(error.message || "Internal server error");
    }
};
