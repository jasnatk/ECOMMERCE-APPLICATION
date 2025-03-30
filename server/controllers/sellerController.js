import Seller from '../models/sellerModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate JWT Token
const generateToken = (id, role = 'seller') => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
};

// Seller Signup
export const sellerSignup = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;

        // Data validation
        if (!name || !email || !password || !address || !phone) {
            return res.status(400).json({ message: "All fields required" });
        }

        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({ message: 'Seller already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create seller with hashed password
        const newSeller = new Seller({
            name, 
            email, 
            password: hashedPassword, 
            address, 
            phone, 
            isVerified: true
        });
        await newSeller.save();

        console.log("Seller created:", newSeller);

        // Generate JWT Token
        const token = generateToken(newSeller._id);

        // Select all fields except the password
        const sellerWithoutPassword = await Seller.findById(newSeller._id).select("-password");

        res.status(201).json({ 
            data: sellerWithoutPassword, 
            token, 
            message: "Seller Signup successful" 
        });
    } catch (error) {
        console.error("Error in Signup:", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Log incoming email and password
        console.log("📧 Login Request - Email:", email);
        console.log("🔑 Login Request - Password:", password);  // Never log the password in production, only for debugging!

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find seller by email
        const seller = await Seller.findOne({ email });

        if (!seller) {
            console.log("❌ Seller not found for email:", email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("✅ Seller found:", seller);

        // Log the stored hash from DB
        console.log("🔐 Stored Hashed Password (from DB):", seller.password);
        
        // Compare passwords
        const isMatch = await bcrypt.compare(password, seller.password);

        // Log entered password and comparison result
        console.log("🔍 Entered Password:", password);
        console.log("🔐 Stored Hashed Password:", seller.password);
        console.log("🔄 Password Match Result:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = generateToken(seller._id, "seller");

        // Set token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        // Remove password before sending response
        const sellerWithoutPassword = await Seller.findById(seller._id).select("-password");

        res.status(200).json({
            success: true,
            data: sellerWithoutPassword,
            message: "Seller Login successful",
        });

    } catch (error) {
        console.error("🚨 Error in sellerLogin:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get Seller Profile
export const getSellerProfile = async (req, res) => {
     try {
        console.log("Decoded Seller ID:", req.seller?.id);

        const sellerData = await Seller.findById(req.seller.id);
        if (!sellerData) {
            return res.status(404).json({ message: "Seller not found" });
        }

        res.json({ 
            data: sellerData, 
            message: "Seller profile fetched" 
        });
     } catch (error) {
         console.error("Error fetching seller profile:", error.message);
        res.status(500).json({ error: error.message });
    }

}
// Logout Seller
export const sellerLogout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
};

// Check if Seller is Authorized
export const checkSeller = async (req, res) => {
    try {
        res.json({ message: "Seller authorized" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};
