import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Verify configuration
console.log("Cloudinary config:", {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY ? "[REDACTED]" : undefined,
  api_secret: process.env.CLOUD_API_SECRET ? "[REDACTED]" : undefined,
});

export default cloudinary;