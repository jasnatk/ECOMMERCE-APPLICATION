import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export const generateToken = (id, role) => {
    console.log(process.env.JWT_SECRET_KEY)
  try {
    
    if (!process.env.JWT_SECRET_KEY) throw new Error("JWT_SECRET_KEY is missing!");
    console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY)

    return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
  } catch (error) {
    console.log("Token Generation Error:", error.message);
    throw error;
  }
};

