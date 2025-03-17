import { jwtDecode } from "jwt-decode";
import axios from "./axiosConfig";

const API_URL = "/api/v1";

const handleError = (error, message) => {
  console.error(`${message}:`, error?.response?.data || error.message);
  return {
    success: false,
    message: error?.response?.data?.error || "An unexpected error occurred.",
  };
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/`);
    return response.data.data;
  } catch (error) {
    return handleError(error, "Error fetching users");
  }
};

export const fetchTicketsAPi = async () => {
  try {
    const response = await axios.get(`${API_URL}/tickets/`);
    return response.data.data;
  } catch (error) {
    return null;
  }
};

export const deleteUserById = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    return handleError(error, "Error deleting user");
  }
};

export const addNewUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/sign-up`, userData);
    return response.data;
  } catch (error) {
    return handleError(error, "Error adding new user");
  }
};

// export const addTicketsAPi = async (ticketdata) => {
//   try {
//     const response = await axios.post(`${API_URL}/tickets/`, ticketdata);
//     return response.data.data;
//   } catch (error) {
//     return handleError(error, "Error adding new ticket");
//   }
// };
export const addTicketsAPi = async (formData) => {
  try {
    const response = await axios.post("/api/v1/tickets", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set the content type for file uploads
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTicketsAPi = async (ticketId) => {
  try {
    const response = await axios.delete(`${API_URL}/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    return handleError(error, "Error deleting ticket");
  }
};

export const updateTicketsAPi = async (ticketId, ticket) => {
  try {
    const response = await axios.put(`${API_URL}/tickets/${ticketId}`, ticket);

    return response.data.data;
  } catch (error) {
    return handleError(error, "Error updating ticket");
  }
};

export const updateUserRole = async (userId, newRole, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/${userId}/role`,
      { role: newRole },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    return handleError(error, "Error updating user role");
  }
};

export const getCurrentUserApi = async (token) => {
  try {
    const decoded = jwtDecode(token);
    const userId = decoded.userId;
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data.data;
  } catch (error) {
    return handleError(error, "Error updating ticket");
  }
};

export const uploadAttachment = async (ticketId, file) => {
  const formData = new FormData();
  formData.append("attachment", file);

  try {
    const response = await axios.post(
      `/api/v1/tickets/${ticketId}/attachments`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error uploading attachment:", error);
  }
};

export const deleteAttachment = async (ticketId, attachmentIndex) => {
  try {
    const response = await axios.delete(
      `/api/v1/tickets/${ticketId}/attachments/${attachmentIndex}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error deleting attachment:", error);
  }
};
