import {
    createAutomationRule,
    getAutomationRules,
    updateAutomationRule,
    deleteAutomationRule,
} from "../services/automation.service.js";

export const createAutomation = async (req, res, next) => {
    try {
        const rule = await createAutomationRule(req.body, req.user._id);
        res.status(201).json({ success: true, data: rule });
    } catch (error) {
        next(error);
    }
};

export const getAutomations = async (req, res, next) => {
    try {
        const { includeInactive } = req.query;
        const rules = await getAutomationRules(includeInactive === "true");
        res.status(200).json({ success: true, data: rules });
    } catch (error) {
        next(error);
    }
};

export const updateAutomation = async (req, res, next) => {
    try {
        const rule = await updateAutomationRule(req.params.id, req.body);
        if (!rule) {
            const error = new Error("Automation rule not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: rule });
    } catch (error) {
        next(error);
    }
};

export const deleteAutomation = async (req, res, next) => {
    try {
        const rule = await deleteAutomationRule(req.params.id);
        if (!rule) {
            const error = new Error("Automation rule not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, message: "Automation rule deleted" });
    } catch (error) {
        next(error);
    }
};
