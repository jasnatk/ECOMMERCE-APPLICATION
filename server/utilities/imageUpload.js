import cloudinary from "../config/cloudinaryConfig.js";
import fs from "fs";

const uploadToCloudinary = async (filePath) => {
  try {
    // Validate file existence
    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "products",
      resource_type: "image",
    });

    if (!result || !result.secure_url) {
      console.error("Cloudinary upload error:", result);
      throw new Error("Cloudinary upload failed.");
    }

    // Clean up local file
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.warn(`Failed to delete local file ${filePath}:`, err.message);
    }

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    // Clean up file on error
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn(`Failed to delete local file ${filePath}:`, err.message);
      }
    }
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

const destroyImageFromCloudinary = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error("Failed to delete image from Cloudinary.");
  }
};

export const getPublicIdFromUrl = (url) => {
  const matches = url.match(/upload\/(?:v\d+\/)?(.*)\.[a-z]+$/i);
  return matches ? matches[1] : null;
};

export { destroyImageFromCloudinary };
export default uploadToCloudinary;