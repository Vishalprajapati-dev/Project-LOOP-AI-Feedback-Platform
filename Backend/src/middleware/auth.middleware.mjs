import jwt from "jsonwebtoken";
import { config } from "../config/config.mjs";
import User from "../models/user.model.mjs";

/**
 * Protect private routes.
 * Checks the access token from the HTTP-only cookie,
 * verifies the JWT and loads the authenticated user.
 */
export const protect = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        message: "Authentication required. Please login.",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired access token.",
      });
    }

    const user = await User.findById(decoded.userId).select(
      "_id name email role workspaceId phone location",
    );

    if (!user) {
      return res.status(401).json({
        message: "User account not found.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);

    return res.status(500).json({
      message: "Authentication failed.",
    });
  }
};

/**
 * Restrict a route to specific user roles.
 *
 * Example:
 * restrictTo("ADMIN")
 * restrictTo("ADMIN", "MANAGER")
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required. Please login.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action.",
      });
    }

    next();
  };
};

/**
 * Backward-compatible alias.
 * If any existing file uses authenticate,
 * it will continue to work.
 */
export const authenticate = protect;
