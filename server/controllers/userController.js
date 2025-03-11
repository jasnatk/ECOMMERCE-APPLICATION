import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Function to generate JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
};


// 1. User/Admin Registration
export const userSignUp = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, address, phoneNumber, profilePic } = req.body;

        // Data validation
        if (!name || !email || !password || !confirmPassword || !phoneNumber) {
            return res.status(400).json({ message: "All fields required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        
        // Check if the user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ name, email, password: hashedPassword, phoneNumber, address, profilePic });
        await newUser.save();

        
        // Generate JWT Token
        
        const token = jwt.sign(
            { id: newUser._id, name: newUser.name }, 
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );
        

        res.status(201).json({ data: newUser, message: "Signup successful" });
    } catch (error) {
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
        res.cookie('token', token, { httpOnly: true });
        
        res.json({ data: user, message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. User Logout
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token");
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