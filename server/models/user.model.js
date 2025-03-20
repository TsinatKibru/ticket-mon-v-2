import mongoose from "mongoose";
import Ticket from "./ticket.model.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User Name is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "User Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "User Password is required"],
      minLength: 6,
    },
    role: {
      type: String,
      enum: ["user", "support_agent", "admin"],
      default: "user",
    },

    profileImage: {
      type: String, // Store the URL or file path
      default: null,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const userId = this._id;

    try {
      // Delete all tickets where the user is the creator or assigned_to
      await Ticket.deleteMany({
        $or: [{ created_by: userId }],
      });
      console.log("deleted");

      next();
    } catch (error) {
      console.log("error");

      next(error);
    }
  }
);

const User = mongoose.model("User", userSchema);

export default User;
