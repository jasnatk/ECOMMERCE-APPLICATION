import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "User not authorized" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decodedToken) {
            return res.status(401).json({ message: "User not authorized" });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};
