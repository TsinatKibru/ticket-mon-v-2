import mongoose from "mongoose";
import fs from "fs";
import url from "url";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Ticket title is required"],
      trim: true,
      minLength: 5,
      maxLength: 100,
    },
    description: {
      type: String,
      required: [true, "Ticket description is required"],
      trim: true,
      minLength: 10,
      maxLength: 500,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    category: {
      type: String,
      enum: ["Technical", "Billing", "General", "Technical Support", "Hardware Request", "Access Request", "Others"],
      default: "General",
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Ticket creator is required"],
    },
    assigned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    attachments: {
      type: [String],
      default: [],
    },
    comments: {
      type: [
        {
          text: {
            type: String,
            required: [true, "Comment text is required"],
            trim: true,
            minLength: 1,
            maxLength: 500,
          },
          created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Comment creator is required"],
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
          parentCommentId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null, // Null for top-level comments
          },
          replies: [
            {
              text: String,
              created_by: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
              createdAt: {
                type: Date,
                default: Date.now, // Automatically set the current date and time
              },
            },
          ],
        },
      ],
      default: [], // Comments are optional and default to an empty array
    },
  },
  { timestamps: true }
);

// Pre-delete hook to delete attachments from storage
ticketSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      const ticket = this;
      console.log(`[INFO] Deleting ticket with ID: ${ticket._id}`);

      if (!ticket.attachments || ticket.attachments.length === 0) {
        console.log(`[INFO] No attachments found for ticket ID: ${ticket._id}`);
        return next();
      }

      // Delete all attachments from storage
      ticket.attachments.forEach((attachment) => {
        try {
          // Convert full URL to a file system path
          const parsedUrl = url.parse(attachment);
          let filePath = parsedUrl.pathname;

          // Ensure compatibility with different OS
          filePath = decodeURIComponent(filePath).replace(/^\/uploads\//, ""); // Remove leading `/uploads/`
          const fullPath = path.join(__dirname, "../uploads", filePath);

          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log(`[INFO] Deleted attachment: ${fullPath}`);
          } else {
            console.warn(`[WARNING] Attachment not found: ${fullPath}`);
          }
        } catch (err) {
          console.error(
            `[ERROR] Failed to process attachment: ${attachment} - ${err.message}`
          );
        }
      });

      next();
    } catch (error) {
      console.error(
        `[ERROR] Error deleting ticket ID: ${this._id} - ${error.message}`
      );
      next(error);
    }
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
