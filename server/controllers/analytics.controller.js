import {
    getTicketMetrics,
    getResolutionTimeStats,
    getAgentPerformance,
    getCategoryBreakdown,
    getTimeSeriesData,
} from "../services/analytics.service.js";

/**
 * Get overall ticket metrics
 */
export const getMetrics = async (req, res, next) => {
    try {
        const metrics = await getTicketMetrics();
        res.status(200).json({ success: true, data: metrics });
    } catch (error) {
        next(error);
    }
};

/**
 * Get resolution time statistics
 */
export const getResolutionTime = async (req, res, next) => {
    try {
        const stats = await getResolutionTimeStats();
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};

/**
 * Get agent performance data
 */
export const getAgentStats = async (req, res, next) => {
    try {
        const performance = await getAgentPerformance();
        res.status(200).json({ success: true, data: performance });
    } catch (error) {
        next(error);
    }
};

/**
 * Get category breakdown
 */
export const getCategoryStats = async (req, res, next) => {
    try {
        const breakdown = await getCategoryBreakdown();
        res.status(200).json({ success: true, data: breakdown });
    } catch (error) {
        next(error);
    }
};

/**
 * Get time series trends
 */
export const getTrends = async (req, res, next) => {
    try {
        const { period = "daily", days = 30 } = req.query;
        const trends = await getTimeSeriesData(period, parseInt(days));
        res.status(200).json({ success: true, data: trends });
    } catch (error) {
        next(error);
    }
};
