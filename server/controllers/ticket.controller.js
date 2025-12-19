
import path from "path";
import { fileURLToPath } from "url";
import { Types } from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  createTicketService,
  getTicketsService,
  getTicketByIdService,
  updateTicketService,
  updateTicketStatusService,
  assignTicketService,
  addCommentService,
  deleteTicketService,
  addAttachmentService,
  deleteAttachmentService,
  autoAssignTicketService
} from "../services/ticket.service.js";

export const createTicket = async (req, res, next) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const newTicket = await createTicketService(
      req.body,
      req.user._id,
      req.file,
      baseUrl
    );

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
    const tickets = await getTicketsService(req.user._id, req.user.role);
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    next(error);
  }
};


export const getTicket = async (req, res, next) => {
  try {
    const ticket = await getTicketByIdService(
      req.params.id,
      req.user._id,
      req.user.role
    );
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};


export const updateTicket = async (req, res, next) => {
  try {
    const ticket = await updateTicketService(
      req.params.id,
      req.user._id,
      req.body
    );

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
    const ticket = await updateTicketStatusService(
      req.params.id,
      req.body.status,
      req.user._id,
      req.user.role
    );

    // const notificationMessage = `Ticket "${ticket.title}" status updated to ${status}.`;
    const notificationMessage = generateNotificationMessage({
      type: "status",
      reqUser: req.user,
      ticket: ticket,
      status: req.body.status,
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
    const ticket = await assignTicketService(
      req.params.id,
      req.body.assigned_to,
      req.user._id,
      req.user.role
    );

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

// export const addComment = async (req, res, next) => {
//   try {
//     const { text } = req.body;

//     // Check if the comment text is empty
//     if (!text || text.trim().length === 0) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Comment cannot be empty" });
//     }

//     const ticket = await Ticket.findById(req.params.id);

//     if (!ticket) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Ticket not found" });
//     }

//     const newComment = { text, created_by: req.user._id };
//     ticket.comments.push(newComment);
//     await ticket.save();

//     // const notificationMessage = `<strong>${req.user.name}</strong> added a new comment to ticket: <em>"${ticket.title}"</em>.`;
//     const notificationMessage = generateNotificationMessage({
//       type: "comment",
//       reqUser: req.user,
//       ticket: ticket,
//       commentText: text, // Assuming 'text' is the comment content
//     });

//     if (!ticket.created_by._id.equals(req.user._id)) {
//       io.to(ticket.created_by._id.toString()).emit("newComment", {
//         message: notificationMessage,
//         ticket,
//         comment: newComment,
//       });
//     }

//     if (ticket.assigned_to && !ticket.assigned_to._id.equals(req.user._id)) {
//       io.to(ticket.assigned_to._id.toString()).emit("newComment", {
//         message: notificationMessage,
//         ticket,
//         comment: newComment,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Comment added successfully",
//       data: ticket,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
export const addComment = async (req, res, next) => {
  try {
    const { text, parentCommentId } = req.body;

    // Call service to add comment
    const ticket = await addCommentService(
      req.params.id,
      text,
      parentCommentId,
      req.user._id
    );

    // Generate notification message
    const notificationMessage = generateNotificationMessage({
      type: "comment",
      reqUser: req.user,
      ticket: ticket,
      commentText: text,
    });

    const notecomment = {
      text,
      created_by: req.user,
    };

    // Notify the ticket creator and assigned user
    if (!ticket.created_by._id.equals(req.user._id)) {
      io.to(ticket.created_by._id.toString()).emit("newComment", {
        message: notificationMessage,
        ticket,
        comment: notecomment,
        parentCommentId,
      });
    }

    if (ticket.assigned_to && !ticket.assigned_to._id.equals(req.user._id)) {
      io.to(ticket.assigned_to._id.toString()).emit("newComment", {
        message: notificationMessage,
        ticket,
        comment: notecomment,
        parentCommentId,
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
    const result = await deleteTicketService(req.params.id, req.user.role);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const addAttachment = async (req, res, next) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const { ticket, fileUrl } = await addAttachmentService(
      req.params.id,
      req.file,
      baseUrl
    );

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
    const ticket = await deleteAttachmentService(id, attachmentIndex);

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

export const autoAssignTicket = async (req, res, next) => {
  try {
    const ticket = await autoAssignTicketService(
      req.params.id,
      req.body.departmentId,
      req.user.role
    );

    res.status(200).json({
      success: true,
      message: "Ticket assigned successfully",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};
