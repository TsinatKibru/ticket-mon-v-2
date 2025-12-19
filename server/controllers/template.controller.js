import {
    createTemplateService,
    getTemplatesService,
    updateTemplateService,
    deleteTemplateService,
} from "../services/template.service.js";

export const createTemplate = async (req, res, next) => {
    try {
        const template = await createTemplateService(req.body, req.user._id);
        res.status(201).json({ success: true, data: template });
    } catch (error) {
        next(error);
    }
};

export const getTemplates = async (req, res, next) => {
    try {
        const { includeInactive } = req.query;
        const templates = await getTemplatesService(includeInactive === "true");
        res.status(200).json({ success: true, data: templates });
    } catch (error) {
        next(error);
    }
};

export const updateTemplate = async (req, res, next) => {
    try {
        const template = await updateTemplateService(req.params.id, req.body);
        if (!template) {
            const error = new Error("Template not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, data: template });
    } catch (error) {
        next(error);
    }
};

export const deleteTemplate = async (req, res, next) => {
    try {
        const template = await deleteTemplateService(req.params.id);
        if (!template) {
            const error = new Error("Template not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ success: true, message: "Template deleted" });
    } catch (error) {
        next(error);
    }
};
