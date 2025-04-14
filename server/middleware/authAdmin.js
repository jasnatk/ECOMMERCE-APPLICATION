import jwt from 'jsonwebtoken';

export const authAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = req.cookies.token || (authHeader && authHeader.startsWith("Bearer ") && authHeader.split(" ")[1]);

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded?.id || decoded.role !== 'admin') {
            return res.status(403).json({ message: "Access denied, admin only" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error("Admin Auth Error:", error.message);
        return res.status(401).json({ message: "Invalid token" });
    }
};
