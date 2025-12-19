import axios from "./axiosConfig";

/**
 * Analytics API calls
 */
export const getAnalyticsMetrics = async () => {
    const response = await axios.get("/api/v1/analytics/metrics");
    return response.data.data;
};

export const getResolutionTimeStats = async () => {
    const response = await axios.get("/api/v1/analytics/resolution-time");
    return response.data.data;
};

export const getAgentPerformance = async () => {
    const response = await axios.get("/api/v1/analytics/agent-performance");
    return response.data.data;
};

export const getCategoryBreakdown = async () => {
    const response = await axios.get("/api/v1/analytics/category-breakdown");
    return response.data.data;
};

export const getTrends = async (period = "daily", days = 30) => {
    const response = await axios.get(`/api/v1/analytics/trends?period=${period}&days=${days}`);
    return response.data.data;
};
