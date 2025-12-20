import Automation from "../models/automation.model.js";
import Ticket from "../models/ticket.model.js";
import {
    sendTicketAssignedEmail,
    sendTicketStatusUpdatedEmail,
} from "./email.service.js";
import { io } from "../app.js";
import { generateNotificationMessage } from "../utils/notifications.util.js";
import { createNotificationService } from "./notification.service.js";

/**
 * Evaluate and execute automation rules for a ticket
 */
export const evaluateAutomationRules = async (ticket, triggerType) => {
    try {
        const rules = await Automation.find({ "trigger.type": triggerType, isActive: true });

        for (const rule of rules) {
            console.log(`[Automation] Checking rule: ${rule.name}`);
            if (checkConditions(ticket, rule.trigger.conditions)) {
                console.log(`[Automation] Match found! Executing actions for rule: ${rule.name}`);
                await executeActions(ticket, rule.actions, rule.createdBy);
            } else {
                console.log(`[Automation] No match for rule: ${rule.name}`);
            }
        }
    } catch (error) {
        console.error("Automation error:", error);
    }
};

/**
 * Check if ticket meets rule conditions
 */
const checkConditions = (ticket, conditions) => {
    if (!conditions) return true;

    const { category, priority, keywords } = conditions;

    if (category && ticket.category !== category) {
        console.log(`[Automation] Category mismatch. Ticket: ${ticket.category}, Rule: ${category}`);
        return false;
    }
    if (priority && ticket.priority !== priority) {
        console.log(`[Automation] Priority mismatch. Ticket: ${ticket.priority}, Rule: ${priority}`);
        return false;
    }

    if (keywords && keywords.length > 0) {
        const content = `${ticket.title} ${ticket.description}`.toLowerCase();
        const hasKeyword = keywords.some((kw) => content.includes(kw.toLowerCase()));
        if (!hasKeyword) {
            console.log(`[Automation] Keyword mismatch. Content: ${content}, Keywords: ${keywords}`);
            return false;
        }
    }

    return true;
};

/**
 * Execute automated actions
 */
/**
 * Execute automated actions
 */
const executeActions = async (ticket, actions, ruleCreatorId) => {
    let modified = false;
    let assignmentChanged = false;
    let statusChanged = false;
    let newStatus = "";

    for (const action of actions) {
        switch (action.type) {
            case "AssignTo":
                if (ticket.assigned_to?.toString() !== action.params.userId) {
                    ticket.assigned_to = action.params.userId;
                    modified = true;
                    assignmentChanged = true;
                }
                break;
            case "SetPriority":
                if (ticket.priority !== action.params.value) {
                    ticket.priority = action.params.value;
                    modified = true;
                }
                break;
            case "SetStatus":
                if (ticket.status !== action.params.value) {
                    ticket.status = action.params.value;
                    newStatus = action.params.value;
                    modified = true;
                    statusChanged = true;
                }
                break;
            case "SendNotification":
                // Custom logic for extra notifications if needed
                break;
        }
    }

    if (modified) {
        await ticket.save();

        // Safe sender ID (rule creator or system/ticket creator fallback)
        const senderId = ruleCreatorId || ticket.created_by._id || ticket.created_by;

        if (assignmentChanged) {
            await ticket.populate("assigned_to", "name email");
            if (ticket.assigned_to) {
                // Email
                sendTicketAssignedEmail(ticket, ticket.assigned_to)
                    .catch(err => console.error("[Automation] Email notification failed:", err));
                console.log(`[Automation] Sent assignment email to ${ticket.assigned_to.email}`);

                // Socket & In-App Notification
                try {
                    const notificationMessageAssign = generateNotificationMessage({
                        type: "assign",
                        reqUser: { name: "System Automation" }, // Dummy user name for template
                        ticket: ticket,
                    });

                    // Create Notification Record
                    await createNotificationService({
                        recipient: ticket.assigned_to._id,
                        sender: senderId,
                        ticket: ticket._id,
                        type: "assign",
                        message: notificationMessageAssign,
                    });

                    // Emit Socket Event
                    if (io) {
                        io.to(ticket.assigned_to._id.toString()).emit("ticketAssigned", {
                            message: notificationMessageAssign,
                            ticket,
                        });
                        console.log(`[Automation] Sent socket event 'ticketAssigned' to ${ticket.assigned_to._id}`);
                    } else {
                        console.warn("[Automation] Socket.io instance not available");
                    }
                } catch (err) {
                    console.error("[Automation] Socket/Notification failed:", err);
                }
            }
        }

        if (statusChanged) {
            await ticket.populate("created_by", "name email");
            // Email
            sendTicketStatusUpdatedEmail(ticket, ticket.created_by, newStatus)
                .catch(err => console.error("[Automation] Email notification failed:", err));
            console.log(`[Automation] Sent status update email to ${ticket.created_by.email}`);

            // Socket & In-App Notification (for creator)
            try {
                const notificationMessage = generateNotificationMessage({
                    type: "status",
                    reqUser: { name: "System Automation" },
                    ticket: ticket,
                    status: newStatus,
                });

                await createNotificationService({
                    recipient: ticket.created_by._id,
                    sender: senderId,
                    ticket: ticket._id,
                    type: "status",
                    message: notificationMessage,
                });

                if (io) {
                    io.to(ticket.created_by._id.toString()).emit("ticketStatusUpdated", {
                        message: notificationMessage,
                        ticket,
                    });
                }
            } catch (err) {
                console.error("[Automation] Socket/Notification failed:", err);
            }
        }
    }
};

/**
 * CRUD for Automation Rules
 */
export const createAutomationRule = async (data, userId) => {
    const rule = new Automation({
        ...data,
        createdBy: userId,
    });
    return await rule.save();
};

export const getAutomationRules = async (includeInactive = false) => {
    const query = includeInactive ? {} : { isActive: true };
    return await Automation.find(query).populate("createdBy", "name email");
};

export const updateAutomationRule = async (id, data) => {
    return await Automation.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteAutomationRule = async (id) => {
    return await Automation.findByIdAndDelete(id);
};
