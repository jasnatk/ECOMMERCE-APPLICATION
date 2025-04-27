import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Oops! you're not logged in.\n Please log in to continue" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("JWT verification failed:", error.message);

        // Handle specific JWT errors
        if (
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError" ||
            error.name === "NotBeforeError"
        ) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        // For other unknown errors
        return res.status(500).json({ message: "Internal server error" });
    }
};
