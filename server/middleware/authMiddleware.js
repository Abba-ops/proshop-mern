import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// Middleware to protect routes requiring authentication
const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      // Verify the token and extract user information
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      // Token verification failed
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    // No token provided
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Middleware to check if the user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    // User is not an admin
    res.status(401);
    throw new Error("Not authorized as admin");
  }
};

export { admin, protect };
