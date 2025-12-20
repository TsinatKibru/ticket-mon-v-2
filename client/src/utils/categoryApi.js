import axios from "axios";

export const getCategories = async (activeOnly = false) => {
    const response = await axios.get(`/api/v1/categories?activeOnly=${activeOnly}`);
    return response.data.data;
};

export const createCategory = async (data) => {
    const response = await axios.post("/api/v1/categories", data);
    return response.data.data;
};

export const updateCategory = async (id, data) => {
    const response = await axios.put(`/api/v1/categories/${id}`, data);
    return response.data.data;
};

export const deleteCategory = async (id) => {
    const response = await axios.delete(`/api/v1/categories/${id}`);
    return response.data;
};
