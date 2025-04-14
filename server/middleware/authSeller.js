import jwt from 'jsonwebtoken';

// Example of checking for the token in cookies:
const authSeller = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        console.log(" No token provided");
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log(" Decoded token:", decoded);

        if (!decoded.id) {
            console.log(" Decoded token missing 'id'");
            return res.status(401).json({ message: 'Invalid token payload' });
        }

        req.seller = { id: decoded.id };
        next();
    } catch (error) {
        console.log(" JWT error:", error.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};


export default authSeller;
