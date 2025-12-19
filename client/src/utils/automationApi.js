import axios from "./axiosConfig";

/**
 * Automation API calls
 */
export const getAutomations = async () => {
    const response = await axios.get("/api/v1/automations");
    return response.data.data;
};

export const createAutomation = async (automationData) => {
    const response = await axios.post("/api/v1/automations", automationData);
    return response.data.data;
};

export const updateAutomation = async (id, automationData) => {
    const response = await axios.put(`/api/v1/automations/${id}`, automationData);
    return response.data.data;
};

export const deleteAutomation = async (id) => {
    const response = await axios.delete(`/api/v1/automations/${id}`);
    return response.data;
};
