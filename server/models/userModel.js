import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String, 
      required: true, 
      maxLength: 50
    },
    email: {
      type: String, 
      required: true, 
      unique: true, 
      minLength: 3, 
      maxLength: 30
    },
    password: {
      type: String, 
      required: true, 
      minLength: 6
    },
    phoneNumber: {
      type: String, 
      required: true,
    },
    profilePic: {
      type: String,
      default: ""
    },
    role: {
      type: String, 
      enum: ["user", "admin", "seller"],
      default: "user"
    },
    address: {
      type: String, 
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }, 
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
