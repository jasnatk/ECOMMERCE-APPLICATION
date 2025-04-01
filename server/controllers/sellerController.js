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

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(400).json({ message: 'Seller not found' });
        }      
        

        // Check if password matches
        const isMatch = await bcrypt.compare(password, seller.password);    
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT Token
        const token = generateToken(seller._id);        
        res.cookie('token', token, { httpOnly: true });

        const sellerWithoutPassword = await Seller.findById(seller._id).select("-password");     

        res.status(200).json({ 
            data: sellerWithoutPassword,            
            token, 
            message: 'Login successful' 
        });

    } catch (error) {
        console.error("Error in sellerLogin:", error.message);     
        res.status(500).json({ message: 'Server error', error: error.message });
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
