import axios from "axios";

// Set the base URL for all requests
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5500"; // Default to localhost if no API URL is set

axios.defaults.baseURL = baseURL;

// Include credentials if needed (optional)
axios.defaults.withCredentials = true;

// Add an interceptor to include the JWT token from localStorage in headers
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
