import Template from "../models/template.model.js";

export const createTemplateService = async (data, userId) => {
    const template = new Template({
        ...data,
        createdBy: userId,
    });
    return await template.save();
};

export const getTemplatesService = async (includeInactive = false) => {
    const query = includeInactive ? {} : { isActive: true };
    return await Template.find(query).populate("createdBy", "name email");
};

export const updateTemplateService = async (id, data) => {
    return await Template.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteTemplateService = async (id) => {
    return await Template.findByIdAndDelete(id);
};
