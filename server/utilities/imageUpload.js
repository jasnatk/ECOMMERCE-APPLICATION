import cloudinary from "../config/cloudinaryConfig.js";

const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, { folder: "products" });
        return result.secure_url;
    } catch (error) {
        throw error;
    }
};

export default uploadToCloudinary;
