const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Check for token in cookie OR Authorization header
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Not authenticated. Please log in." });
    }

    // Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user data
    const user = await User.findById(decoded.userId).select("-__v");
    if (!user) {
      return res.status(401).json({ error: "User not found. Please log in again." });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }
    return res.status(401).json({ error: "Invalid token. Please log in again." });
  }
};

module.exports = authMiddleware;
