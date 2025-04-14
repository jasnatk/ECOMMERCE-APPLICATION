import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export const generateToken = (id, role) => {
   
  try {
    
    if (!process.env.JWT_SECRET_KEY) throw new Error("JWT_SECRET_KEY is missing!");
    

    return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
  } catch (error) {
    console.log("Token Generation Error:", error.message);
    throw error;
  }
};

