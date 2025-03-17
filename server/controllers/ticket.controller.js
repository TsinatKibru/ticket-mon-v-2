import path from "path";
import { fileURLToPath } from "url";
import Ticket from "../models/ticket.model.js";
import fs from "fs";

import url from "url";
import { io } from "../app.js";
import { generateNotificationMessage } from "../utils/notifications.util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createTicket = async (req, res, next) => {
  try {
    const { title, description, priority, category } = req.body;
    const created_by = req.user._id;

    // Initialize the attachments array
    let attachments = [];

    // If a file is uploaded, construct the file URL
    if (req.file) {
      const filePath = req.file.path;
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const fileUrl = `${baseUrl}/uploads/${path.relative(
        path.join(__dirname, "../uploads"),
        filePath
      )}`;
      attachments.push(fileUrl); // Add the file URL to the attachments array
    }

    const newTicket = new Ticket({
      title,
      description,
      priority,
      category,
      created_by,
      attachments,
    });

    await newTicket.save();
    await newTicket.populate("created_by", "name email");

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: newTicket,
    });
  } catch (error) {
    next(error);
  }
};

export const getTickets = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === "user") {
      query = { created_by: req.user._id };
    }

    const tickets = await Ticket.find(query)
      .populate("created_by", "name email")
      .populate("assigned_to", "name email");

    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    next(error);
  }
};

export const getTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("created_by", "name email")
      .populate("assigned_to", "name email");

    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    // Only allow access if the user is an admin/support or the ticket creator
    if (
      req.user.role !== "admin" &&
      req.user.role !== "support_agent" &&
      !ticket.created_by._id.equals(req.user._id)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    // Only allow the ticket owner to update their own ticket
    if (!ticket.created_by._id.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this ticket",
      });
    }

    const { title, description, priority, category } = req.body;

    // Update fields if provided
    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (priority) ticket.priority = priority;
    if (category) ticket.category = category;

    await ticket.save();
    await ticket.populate("created_by", "name email");
    await ticket.populate("assigned_to", "name email");

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicketStatus = async (req, res, next) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "support_agent") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to update status" });
    }

    const { status } = req.body;
    const validStatuses = ["Open", "In Progress", "Resolved"];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }
    // const notificationMessage = `Ticket "${ticket.title}" status updated to ${status}.`;
    const notificationMessage = generateNotificationMessage({
      type: "status",
      reqUser: req.user,
      ticket: ticket,
      status: status,
    });

    if (!ticket.created_by._id.equals(req.user._id)) {
      io.to(ticket.created_by._id.toString()).emit("ticketStatusUpdated", {
        message: notificationMessage,
        ticket,
      });
    }

    if (ticket.assigned_to && !ticket.assigned_to._id.equals(req.user._id)) {
      io.to(ticket.assigned_to._id.toString()).emit("ticketStatusUpdated", {
        message: notificationMessage,
        ticket,
      });
    }

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const assignTicket = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to assign tickets" });
    }

    const { assigned_to } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assigned_to },
      { new: true }
    );

    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }
    const notificationMessageAssign = generateNotificationMessage({
      type: "assign",
      reqUser: req.user,
      ticket: ticket,
    });
    if (ticket.assigned_to && !ticket.assigned_to._id.equals(req.user._id)) {
      io.to(ticket.assigned_to._id.toString()).emit("ticketAssigned", {
        message: notificationMessageAssign,
        ticket,
      });
    }

    res.status(200).json({
      success: true,
      message: "Ticket assigned successfully",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    // Check if the comment text is empty
    if (!text || text.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Comment cannot be empty" });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    const newComment = { text, created_by: req.user._id };
    ticket.comments.push(newComment);
    await ticket.save();

    // const notificationMessage = `<strong>${req.user.name}</strong> added a new comment to ticket: <em>"${ticket.title}"</em>.`;
    const notificationMessage = generateNotificationMessage({
      type: "comment",
      reqUser: req.user,
      ticket: ticket,
      commentText: text, // Assuming 'text' is the comment content
    });

    if (!ticket.created_by._id.equals(req.user._id)) {
      io.to(ticket.created_by._id.toString()).emit("newComment", {
        message: notificationMessage,
        ticket,
        comment: newComment,
      });
    }

    if (ticket.assigned_to && !ticket.assigned_to._id.equals(req.user._id)) {
      io.to(ticket.assigned_to._id.toString()).emit("newComment", {
        message: notificationMessage,
        ticket,
        comment: newComment,
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTicket = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to delete tickets" });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }
    await ticket.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Ticket deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const addAttachment = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Construct the full URL for the uploaded file
    const filePath = req.file.path;
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const fileUrl = `${baseUrl}/uploads/${path.relative(
      path.join(__dirname, "../uploads"),
      filePath
    )}`;

    // Add the file URL to the ticket's attachments array
    ticket.attachments.push(fileUrl);

    await ticket.populate("created_by", "name email");
    await ticket.save();

    // Notify the ticket creator and assigned user
    // const notificationMessage = `New attachment added to ticket: ${ticket.title}`;
    const notificationMessage = generateNotificationMessage({
      type: "attachment",
      reqUser: req.user,
      ticket: ticket,
      attachmentUrl: fileUrl,
    });

    if (!ticket.created_by._id.equals(req.user._id)) {
      io.to(ticket.created_by._id.toString()).emit("attachmentAdded", {
        message: notificationMessage,
        ticket,
        attachment: fileUrl,
      });
    }

    if (ticket.assigned_to && !ticket.assigned_to._id.equals(req.user._id)) {
      io.to(ticket.assigned_to._id.toString()).emit("attachmentAdded", {
        message: notificationMessage,
        ticket,
        attachment: fileUrl,
      });
    }

    res.status(200).json({
      success: true,
      message: "Attachment added successfully",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAttachment = async (req, res, next) => {
  try {
    const { id, attachmentIndex } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Check if the attachment index is valid
    if (
      !ticket.attachments ||
      attachmentIndex < 0 ||
      attachmentIndex >= ticket.attachments.length
    ) {
      return res.status(400).json({ message: "Invalid attachment index" });
    }

    // Extract actual file path from the full URL
    const attachmentUrl = ticket.attachments[attachmentIndex];
    const parsedUrl = url.parse(attachmentUrl);
    let filePath = decodeURIComponent(parsedUrl.pathname).replace(
      /^\/uploads\//,
      ""
    ); // Remove leading `/uploads/`

    const fullPath = path.join(__dirname, "../uploads", filePath);

    // Delete the file from the storage
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`[INFO] Deleted attachment: ${fullPath}`);
    } else {
      console.warn(`[WARNING] Attachment not found: ${fullPath}`);
    }

    // Remove the attachment from the ticket
    ticket.attachments.splice(attachmentIndex, 1);
    await ticket.save();

    res.status(200).json({
      success: true,
      message: "Attachment deleted successfully",
      data: ticket,
    });
  } catch (error) {
    console.error(`[ERROR] Failed to delete attachment: ${error.message}`);
    next(error);
  }
};
