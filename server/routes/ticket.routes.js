import { Router } from "express";
import {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  updateTicketStatus,
  assignTicket,
  addComment,
  deleteTicket,
  addAttachment,
  deleteAttachment,
  autoAssignTicket,
} from "../controllers/ticket.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const ticketRouter = Router();

// Public Routes
ticketRouter.get(
  "/",
  authorize(["admin", "support_agent", "user"]),
  getTickets
);
ticketRouter.post("/:id/autoassign", authorize(["admin"]), autoAssignTicket);
ticketRouter.get(
  "/:id",
  authorize(["admin", "support_agent", "user"]),
  getTicket
);
ticketRouter.post(
  "/",
  authorize(["user", "admin", "support_agent"]),
  upload.single("attachment"), // Use the upload middleware
  createTicket
);
ticketRouter.put(
  "/:id",
  authorize(["user", "admin", "support_agent"]),
  updateTicket
);
ticketRouter.put(
  "/:id/status",
  authorize(["admin", "support_agent"]),
  updateTicketStatus
);
ticketRouter.put("/:id/assign", authorize(["admin"]), assignTicket);

ticketRouter.post(
  "/:id/comments",
  authorize(["user", "support_agent", "admin"]),
  addComment
);
ticketRouter.delete("/:id", authorize(["admin"]), deleteTicket);

// Add route for uploading attachments
ticketRouter.post(
  "/:id/attachments",
  authorize(["user", "admin", "support_agent"]),
  upload.single("attachment"),
  addAttachment
);

ticketRouter.delete(
  "/:id/attachments/:attachmentIndex",
  authorize(["user", "admin", "support_agent"]),
  deleteAttachment
);

export default ticketRouter;
