
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const sellerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    profilePic: { type: String },
    isVerified: { type: Boolean, default: false }
});

// Hash password before saving to database
sellerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare entered password with hashed password
sellerSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

 const Seller = mongoose.model('Seller', sellerSchema);

export default Seller ;