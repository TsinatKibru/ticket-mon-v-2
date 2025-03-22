import path from "path";
import { fileURLToPath } from "url";

import User from "../models/user.model.js";
import { NODE_ENV } from "../config/env.js";

// Derive __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    // Validate the role
    const validRoles = ["user", "admin", "support_agent"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    // Find user and update role
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.deleteOne();

    // const deletedUser = await User.findByIdAndDelete(id);

    // if (!deletedUser) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadProfileImage = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const filePath = req.file.path;
    const protocol = NODE_ENV === "production" ? "https" : "https";
    const baseUrl = `${protocol}://${req.get("host")}`;
    const fileUrl = `${baseUrl}/uploads/${path.relative(
      path.join(__dirname, "../uploads"),
      filePath
    )}`;

    // Save the file path to the user's profileImage field
    user.profileImage = fileUrl;
    await user.save();
    console.log("reached here");

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req, res, next) => {
  try {
    const { name, email, role, department } = req.query;

    console.log(req.query);

    // Build the search query
    const query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" }; // Case-insensitive partial match
    }

    if (email) {
      query.email = { $regex: email, $options: "i" }; // Case-insensitive partial match
    }

    if (role) {
      query.role = role; // Exact match for role
    }

    if (department) {
      query.department = department; // Exact match for department
    }

    // Execute the search query
    const users = await User.find(query)
      .select("-password") // Exclude the password field
      .populate("department", "name"); // Populate department details

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
