import jwt from 'jsonwebtoken';

export const authSeller = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken.role !== "seller") {
      return res.status(403).json({ message: "Forbidden: Seller access only" });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
