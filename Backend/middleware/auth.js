const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protectedUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Please log in first" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

exports.protectedSeller = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: Please log in first" });
  }
  if (req.user.role !== "seller") {
    return res.status(403).json({ error: "Forbidden: Access restricted to sellers only" });
  }
  next();
};

exports.protectedAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized: Please log in first" });
  }
  if (req.user.role!== "admin") {
    return res.status(403).json({ error: "Forbidden: Access restricted to admins only" });
  }
  next();
};
