import Ticket from "../models/ticket.model.js";
import Department from "../models/department.model.js";
import path from "path";
import fs from "fs";
import url from "url";
import { fileURLToPath } from "url";
import {
    leastRecentlyAssigned,
    loadBalancing,
    roundRobin,
} from "../utils/assignmentAlgorithms.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createTicketService = async (data, userId, file, baseUrl) => {
    const { title, description, priority, category } = data;
    let attachments = [];

    if (file) {
        // Construct the file URL logic
        // We need to know the uploads directory path relative to this file? 
        // The original code used __dirname relative to controller.
        // This service is in services/, controller in controllers/.
        // uploads is in server/uploads.
        // Let's passed the full fileUrl from controller to avoid path complexity here or handle it simply.
        // Actually, logic for URL construction is "business logic"? Or "presentation logic"?
        // Let's keep URL construction in controller for now or pass parameters.
        const fileUrl = `${baseUrl}/uploads/${file.filename}`;
        attachments.push(fileUrl);
    }

    const newTicket = new Ticket({
        title,
        description,
        priority,
        category,
        created_by: userId,
        attachments,
    });

    await newTicket.save();
    await newTicket.populate("created_by", "name email");
    return newTicket;
};

export const getTicketsService = async (userId, role) => {
    let query = {};
    if (role === "user") {
        query = { created_by: userId };
    }

    const tickets = await Ticket.find(query)
        .populate("created_by", "name email")
        .populate("assigned_to", "name email")
        .populate({
            path: "comments.created_by",
            select: "name email",
        })
        .populate({
            path: "comments.replies.created_by",
            select: "name email",
        });

    return tickets;
};

export const getTicketByIdService = async (id, userId, role) => {
    const ticket = await Ticket.findById(id)
        .populate("created_by", "name email")
        .populate("assigned_to", "name email")
        .populate({
            path: "comments.created_by",
            select: "name email",
        })
        .populate({
            path: "comments.replies.created_by",
            select: "name email",
        });

    if (!ticket) {
        const error = new Error("Ticket not found");
        error.statusCode = 404;
        throw error;
    }

    if (
        role !== "admin" &&
        role !== "support_agent" &&
        !ticket.created_by._id.equals(userId)
    ) {
        const error = new Error("Unauthorized access");
        error.statusCode = 403;
        throw error;
    }

    return ticket;
};

export const updateTicketService = async (id, userId, data) => {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
        const error = new Error("Ticket not found");
        error.statusCode = 404;
        throw error;
    }

    if (!ticket.created_by._id.equals(userId)) {
        const error = new Error("Unauthorized to update this ticket");
        error.statusCode = 403;
        throw error;
    }

    const { title, description, priority, category } = data;

    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (priority) ticket.priority = priority;
    if (category) ticket.category = category;

    await ticket.save();
    await ticket.populate("created_by", "name email");
    await ticket.populate("assigned_to", "name email");
    await ticket.populate({
        path: "comments.created_by",
        select: "name email",
    });
    await ticket.populate({
        path: "comments.replies.created_by",
        select: "name email",
    });

    return ticket;
};

export const updateTicketStatusService = async (id, status, userId, role) => {
    if (role !== "admin" && role !== "support_agent") {
        const error = new Error("Unauthorized to update status");
        error.statusCode = 403;
        throw error;
    }

    const validStatuses = ["Open", "In Progress", "Resolved"];
    if (!validStatuses.includes(status)) {
        const error = new Error("Invalid status");
        error.statusCode = 400;
        throw error;
    }

    const ticket = await Ticket.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );

    if (!ticket) {
        const error = new Error("Ticket not found");
        error.statusCode = 404;
        throw error;
    }

    return ticket;
};

export const assignTicketService = async (id, assigned_to, userId, role) => {
    if (role !== "admin") {
        const error = new Error("Unauthorized to assign tickets");
        error.statusCode = 403;
        throw error;
    }

    const ticket = await Ticket.findByIdAndUpdate(
        id,
        { assigned_to },
        { new: true }
    );

    if (!ticket) {
        const error = new Error("Ticket not found");
        error.statusCode = 404;
        throw error;
    }

    return ticket;
};

export const addCommentService = async (id, text, parentCommentId, userId) => {
    if (!text || text.trim().length === 0) {
        const error = new Error("Comment cannot be empty");
        error.statusCode = 400;
        throw error;
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
        const error = new Error("Ticket not found");
        error.statusCode = 404;
        throw error;
    }

    if (parentCommentId) {
        const parentComment = ticket.comments.id(parentCommentId);
        if (!parentComment) {
            const error = new Error("Parent comment not found");
            error.statusCode = 404;
            throw error;
        }
        parentComment.replies.push({ text, created_by: userId });
    } else {
        ticket.comments.push({ text, created_by: userId });
    }

    await ticket.save();

    // Populate for return
    await ticket.populate("created_by", "name email");
    await ticket.populate("assigned_to", "name email");
    await ticket.populate({
        path: "comments.created_by",
        select: "name email",
    });
    await ticket.populate({
        path: "comments.replies.created_by",
        select: "name email",
    });

    return ticket;
};

export const deleteTicketService = async (id, role) => {
    if (role !== "admin") {
        const error = new Error("Unauthorized to delete tickets");
        error.statusCode = 403;
        throw error;
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
        const error = new Error("Ticket not found");
        error.statusCode = 404;
        throw error;
    }

    await ticket.deleteOne();
    return { message: "Ticket deleted successfully" };
};

export const addAttachmentService = async (id, file, baseUrl) => {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
        const error = new Error("Ticket not found");
        error.statusCode = 404;
        throw error;
    }

    const fileUrl = `${baseUrl}/uploads/${file.filename}`;
    ticket.attachments.push(fileUrl);

    await ticket.save();
    await ticket.populate("created_by", "name email");

    return { ticket, fileUrl };
};

export const deleteAttachmentService = async (id, attachmentIndex) => {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
        const error = new Error("Ticket not found");
        error.statusCode = 404;
        throw error;
    }

    if (!ticket.attachments || attachmentIndex < 0 || attachmentIndex >= ticket.attachments.length) {
        const error = new Error("Invalid attachment index");
        error.statusCode = 400;
        throw error;
    }

    const attachmentUrl = ticket.attachments[attachmentIndex];
    // We need to parse the URL to get the filename on disk
    // Assuming structure: http://host/uploads/filename
    const filename = attachmentUrl.split('/').pop();
    // The uploads directory is at server/uploads. 
    // This service file is at server/services/ticket.service.js
    // So uploads is at ../../uploads relative to this file?
    // Wait, createTicketService used: `${baseUrl}/uploads/${file.filename}`
    // So the file is directly in uploads/.

    const filePath = path.join(__dirname, "../uploads", filename);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    ticket.attachments.splice(attachmentIndex, 1);
    await ticket.save();

    return ticket;
};

export const autoAssignTicketService = async (id, departmentId, role) => {
    if (role !== "admin") {
        const error = new Error("Unauthorized to assign tickets");
        error.statusCode = 403;
        throw error;
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
        const error = new Error("Ticket not found");
        error.statusCode = 404;
        throw error;
    }

    const department = await Department.findById(departmentId).populate("users");
    if (!department) {
        const error = new Error("Department not found");
        error.statusCode = 404;
        throw error;
    }

    if (department.users.length === 0) {
        const error = new Error("No users available in the department");
        error.statusCode = 400;
        throw error;
    }

    let assignedUserId;
    switch (department.assignmentAlgorithm) {
        case "roundRobin":
            assignedUserId = roundRobin(department.users, department.lastAssignedUserId);
            break;
        case "leastRecentlyAssigned":
            assignedUserId = await leastRecentlyAssigned(department.users);
            break;
        case "loadBalancing":
            assignedUserId = await loadBalancing(department.users);
            break;
        default:
            const error = new Error("Invalid assignment algorithm");
            error.statusCode = 400;
            throw error;
    }

    if (assignedUserId) {
        ticket.assigned_to = assignedUserId;
        ticket.department = departmentId;
        await ticket.save();

        department.lastAssignedUserId = assignedUserId;
        await department.save();
    }

    return ticket;
};
