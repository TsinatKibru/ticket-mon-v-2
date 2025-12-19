import Automation from "../models/automation.model.js";
import Ticket from "../models/ticket.model.js";
import { sendEmail } from "./email.service.js"; // Helper function if needed

/**
 * Evaluate and execute automation rules for a ticket
 */
export const evaluateAutomationRules = async (ticket, triggerType) => {
    try {
        const rules = await Automation.find({ trigger: triggerType, isActive: true });

        for (const rule of rules) {
            if (checkConditions(ticket, rule.trigger.conditions)) {
                await executeActions(ticket, rule.actions);
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

    if (category && ticket.category !== category) return false;
    if (priority && ticket.priority !== priority) return false;

    if (keywords && keywords.length > 0) {
        const content = `${ticket.title} ${ticket.description}`.toLowerCase();
        const hasKeyword = keywords.some((kw) => content.includes(kw.toLowerCase()));
        if (!hasKeyword) return false;
    }

    return true;
};

/**
 * Execute automated actions
 */
const executeActions = async (ticket, actions) => {
    let modified = false;

    for (const action of actions) {
        switch (action.type) {
            case "AssignTo":
                ticket.assigned_to = action.params.userId;
                modified = true;
                break;
            case "SetPriority":
                ticket.priority = action.params.value;
                modified = true;
                break;
            case "SetStatus":
                ticket.status = action.params.value;
                modified = true;
                break;
            case "SendNotification":
                // Custom logic for extra notifications if needed
                break;
        }
    }

    if (modified) {
        await ticket.save();
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
