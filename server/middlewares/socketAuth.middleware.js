import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_SECRET } from "../config/env.js";

export const authenticateSocket = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token || socket.handshake.headers["authorization"];

    if (!token) {
      console.log("Authentication token required");
      return next(new Error("Authentication token required"));
    }

    // Verify JWT Token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      console.log("User not found");
      return next(new Error("User not found"));
    }

    socket.user = user; // Attach user data to socket
    next(); // Proceed with connection
  } catch (error) {
    console.log("Authentication failed");
    next(new Error("Authentication failed", error));
  }
};
