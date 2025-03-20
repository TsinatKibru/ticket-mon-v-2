// department.model.js
import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department Name is required"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ], // Users assigned to this department
    assignmentAlgorithm: {
      type: String,
      enum: ["roundRobin", "leastRecentlyAssigned", "loadBalancing"],
      default: "roundRobin",
    }, // Admin-chosen algorithm
    lastAssignedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }, // For Round Robin algorithm
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;
