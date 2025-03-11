import jwt from 'jsonwebtoken';

export const authAdmin = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: "Access denied, admin only" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if (!decoded || !decoded.id || decoded.role !== 'admin') {
            return res.status(403).json({ message: "Access denied, admin only" });
        }

        req.user = decoded; // 

        next(); // Proceed to the next function
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

