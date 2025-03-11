
// import Order from "../models/orderModel.js";
// import Dashboard from "../models/dashboardModel.js";
// import Settings from "../models/settingsModel.js";

// Get all users
import User from "../models/userModel.js";  

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


// Function to generate JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
};

// Admin Registration
export const adminSignUp = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phoneNumber, address, profilePic } = req.body;

        // Data validation
        if (!name || !email || !password || !confirmPassword || !phoneNumber) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Check if the admin already exists
        const adminExists = await User.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin
        const newAdmin = new User({ name, email, password: hashedPassword, phoneNumber, address, profilePic, role: 'admin' });
        await newAdmin.save();

        // Generate JWT Token
        const token = generateToken(newAdmin._id, 'admin');
        res.cookie('token', token, { httpOnly: true });

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

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!admin.isActive) {
            return res.status(401).json({ message: "Admin account is not active" });
        }

        // Generate token
        const token = generateToken(admin._id, 'admin');
        res.cookie('token', token, { httpOnly: true });

        res.json({ data: admin, message: "Admin login successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin Logout
export const adminLogout = async (req, res) => {
  try {
      // Clear the token cookie
      res.clearCookie("token", { path: '/' });

      // Respond with a success message
      res.json({ message: "Admin logged out successfully" });
  } catch (error) {
      // Handle any errors that occur during logout
      res.status(500).json({ message: error.message });
  }
};


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

//check admin
export const checkAdmin = async(req,res,next)=>{
  try{
      res.json({message:"admin authorized"});

  }catch(error){
      res.status(error.statuscode||500).json({message:error.message||"internal server error"})
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Deactivate user
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

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// // Get all orders
// export const getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.find();
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Update order status
// export const updateOrderStatus = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     order.status = req.body.status;
//     await order.save();
    
//     res.status(200).json({ message: "Order status updated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get admin dashboard stats
// export const getDashboardStats = async (req, res) => {
//   try {
//     const stats = await Dashboard.getStats();
//     res.status(200).json(stats);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Update website settings
// export const manageSiteSettings = async (req, res) => {
//   try {
//     const settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
//     res.status(200).json({ message: "Settings updated successfully", settings });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
