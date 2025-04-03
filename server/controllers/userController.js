import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { generateToken } from "../utilities/token.js";

const NODE_ENV = process.env.NODE_ENV;

// 1. User/Admin Registration
export const userSignUp = async (req, res,next) => {
    try {
        //collect user data
        const { name, email, password, confirmPassword, address, phoneNumber, profilePic } = req.body;

        // Data validation
        if (!name || !email || !password || !confirmPassword || !phoneNumber) {
            return res.status(400).json({ message: "All fields required" });
        }

        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        //compare with confirm password
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        
        

        // password hashing
        const hashedPassword = bcrypt.hashSync(password, 10);

        // SAVE TO DB
        const newUser = new User({ name, email, password: hashedPassword, phoneNumber, address, profilePic });
        await newUser.save();

        console.log("User created:", newUser);

        // Generate token using id and role
        const token = generateToken(newUser._id, "user");
        res.cookie("token", token,{
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });
        // Select all fields except the password
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
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.isActive) {
            return res.status(401).json({ message: "User account is not active" });
        }

        // Generate token
        const token = generateToken(user._id, 'user');

        // res.cookie("token", token, {httpOnly:true});
        
         //store token
        res.cookie("token", token, {
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });

        
        
        res.json({ data: user, message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. User Logout
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token",{
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        });
        res.json({ message: "User logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//check user
export const checkUser = async(req,res,next)=>{
    try{
        res.json({message:"user authorized"});

    }catch(error){
        res.status(error.statuscode||500).json({message:error.message||"internal server error"})
    }
}

// 4. Get User Profile
export const getUserProfile = async (req, res) => {
    try {
        const userData = await User.findById(req.user.id);
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ data: userData, message: "User profile fetched" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Update User Profile
export const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.address = req.body.address || user.address;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.profilePic = req.body.profilePic || user.profilePic;

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6. Forgot Password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Password reset link sent to email" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 7. Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 8. Change Password
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
        res.status(500).json({ error: error.message });
    }
};