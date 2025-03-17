import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";
import { Types } from "mongoose";

const isValidObjectId = (id) => Types.ObjectId.isValid(id);

const getTokenFromHeaders = (req) => {
  const authHeader = req.headers.authorization;
  return authHeader && authHeader.startsWith("Bearer")
    ? authHeader.split(" ")[1]
    : null;
};

export const authorize =
  (roles = []) =>
  async (req, res, next) => {
    try {
      const token = getTokenFromHeaders(req);
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      if (!isValidObjectId(decoded.userId)) {
        console.log("check");
        return res
          .status(401)
          .json({ message: "Unauthorized: Invalid user ID" });
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res
          .status(401)
          .json({ message: "Unauthorized: User not found" });
      }

      // Role-based access control
      if (roles.length && !roles.includes(user.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }

      // Prevent non-admin users from accessing another user's data
      if (req.params.id) {
        if (!isValidObjectId(req.params.id)) {
          console.log("Invalid req.params.id detected:", req.params.id);
          return res
            .status(400)
            .json({ message: "Bad Request: Invalid user ID format" });
        }

        if (req.originalUrl.startsWith("/api/v1/users/")) {
          if (
            req.params.id.toString() !== user._id.toString() &&
            user.role !== "admin"
          ) {
            console.log("Access Denied - Ownership Check Failed");
            return res.status(403).json({
              message: "Forbidden: You cannot access other users' data",
            });
          }
        }
      }

      req.user = user;
      next();
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  };

export default authorize;
