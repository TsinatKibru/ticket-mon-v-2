import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js";

/**
 * Get overall ticket metrics
 */
export const getTicketMetrics = async () => {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: "Open" });
    const inProgressTickets = await Ticket.countDocuments({ status: "In Progress" });
    const resolvedTickets = await Ticket.countDocuments({ status: "Resolved" });

    return {
        total: totalTickets,
        open: openTickets,
        inProgress: inProgressTickets,
        resolved: resolvedTickets,
        resolutionRate: totalTickets > 0 ? ((resolvedTickets / totalTickets) * 100).toFixed(1) : 0,
    };
};

/**
 * Get resolution time statistics
 */
export const getResolutionTimeStats = async () => {
    const resolvedTickets = await Ticket.find({ status: "Resolved" }).select("createdAt updatedAt category");

    if (resolvedTickets.length === 0) {
        return { average: 0, median: 0, byCategory: [] };
    }

    // Calculate resolution times in hours
    const resolutionTimes = resolvedTickets.map((ticket) => {
        const created = new Date(ticket.createdAt);
        const resolved = new Date(ticket.updatedAt);
        return {
            hours: (resolved - created) / (1000 * 60 * 60),
            category: ticket.category,
        };
    });

    // Average
    const average = resolutionTimes.reduce((sum, t) => sum + t.hours, 0) / resolutionTimes.length;

    // Median
    const sorted = resolutionTimes.map((t) => t.hours).sort((a, b) => a - b);
    const median = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];

    // By category
    const byCategory = {};
    resolutionTimes.forEach((t) => {
        if (!byCategory[t.category]) {
            byCategory[t.category] = [];
        }
        byCategory[t.category].push(t.hours);
    });

    const categoryStats = Object.keys(byCategory).map((category) => ({
        category,
        average: (byCategory[category].reduce((sum, h) => sum + h, 0) / byCategory[category].length).toFixed(1),
        count: byCategory[category].length,
    }));

    return {
        average: average.toFixed(1),
        median: median.toFixed(1),
        byCategory: categoryStats,
    };
};

/**
 * Get agent performance metrics
 */
export const getAgentPerformance = async () => {
    const agents = await User.find({ role: { $in: ["admin", "support_agent"] } }).select("name email");

    const performance = await Promise.all(
        agents.map(async (agent) => {
            const assignedTickets = await Ticket.countDocuments({ assigned_to: agent._id });
            const resolvedTickets = await Ticket.countDocuments({
                assigned_to: agent._id,
                status: "Resolved",
            });

            // Calculate average resolution time for this agent
            const resolved = await Ticket.find({
                assigned_to: agent._id,
                status: "Resolved",
            }).select("createdAt updatedAt");

            let avgResolutionTime = 0;
            if (resolved.length > 0) {
                const totalTime = resolved.reduce((sum, ticket) => {
                    const created = new Date(ticket.createdAt);
                    const resolvedDate = new Date(ticket.updatedAt);
                    return sum + (resolvedDate - created) / (1000 * 60 * 60);
                }, 0);
                avgResolutionTime = (totalTime / resolved.length).toFixed(1);
            }

            return {
                agentId: agent._id,
                name: agent.name,
                email: agent.email,
                assignedTickets,
                resolvedTickets,
                avgResolutionTime: parseFloat(avgResolutionTime),
                resolutionRate: assignedTickets > 0 ? ((resolvedTickets / assignedTickets) * 100).toFixed(1) : 0,
            };
        })
    );

    return performance.sort((a, b) => b.resolvedTickets - a.resolvedTickets);
};

/**
 * Get category breakdown
 */
export const getCategoryBreakdown = async () => {
    const categories = await Ticket.aggregate([
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 },
                open: {
                    $sum: { $cond: [{ $eq: ["$status", "Open"] }, 1, 0] },
                },
                inProgress: {
                    $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] },
                },
                resolved: {
                    $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] },
                },
            },
        },
        {
            $project: {
                _id: 0,
                category: "$_id",
                count: 1,
                open: 1,
                inProgress: 1,
                resolved: 1,
            },
        },
        { $sort: { count: -1 } },
    ]);

    return categories;
};

/**
 * Get time series data for trends
 */
export const getTimeSeriesData = async (period = "daily", days = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const tickets = await Ticket.find({
        createdAt: { $gte: startDate },
    }).select("createdAt status");

    // Group by date
    const grouped = {};
    tickets.forEach((ticket) => {
        const date = new Date(ticket.createdAt);
        let key;

        if (period === "daily") {
            key = date.toISOString().split("T")[0];
        } else if (period === "weekly") {
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            key = weekStart.toISOString().split("T")[0];
        } else {
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        }

        if (!grouped[key]) {
            grouped[key] = { date: key, created: 0, resolved: 0 };
        }
        grouped[key].created++;
        if (ticket.status === "Resolved") {
            grouped[key].resolved++;
        }
    });

    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
};
