import axios from "./axiosConfig";

/**
 * Template API calls
 */
export const getTemplates = async (includeInactive = false) => {
    const response = await axios.get(`/api/v1/templates?includeInactive=${includeInactive}`);
    return response.data.data;
};

export const createTemplate = async (templateData) => {
    const response = await axios.post("/api/v1/templates", templateData);
    return response.data.data;
};

export const updateTemplate = async (id, templateData) => {
    const response = await axios.put(`/api/v1/templates/${id}`, templateData);
    return response.data.data;
};

export const deleteTemplate = async (id) => {
    const response = await axios.delete(`/api/v1/templates/${id}`);
    return response.data;
};
