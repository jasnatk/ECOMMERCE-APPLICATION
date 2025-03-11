
import User from "../models/userModel.js";
import bcrypt from "bcryptjs"; // For password hashing

// Register a new seller
export const registerSeller = async (req, res) => {
  try {
    const { name, email, password, mobile, address } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new seller
    const newSeller = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      address,
      role: "seller", // Mark the user as a seller
    });

    await newSeller.save();
    res.status(201).json({ message: "Seller registered successfully", seller: newSeller });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Seller updates their own profile
export const updateSellerProfile = async (req, res) => {
  try {
    const seller = await User.findById(req.user.id);

    if (!seller || seller.role !== "seller") {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Update only allowed fields
    seller.name = req.body.name || seller.name;
    seller.mobile = req.body.mobile || seller.mobile;
    seller.address = req.body.address || seller.address;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      seller.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedSeller = await seller.save();
    res.status(200).json({ message: "Profile updated successfully", seller: updatedSeller });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
