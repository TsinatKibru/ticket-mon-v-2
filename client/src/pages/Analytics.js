import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../redux/slices/headerSlice";
import StatCard from "../components/StatCard";
import TitleCard from "../components/TitleCard";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    ChartBarIcon,
    ClockIcon,
    UserGroupIcon,
    CheckCircleIcon,
    FolderIcon,
} from "@heroicons/react/24/outline";
import {
    getAnalyticsMetrics,
    getResolutionTimeStats,
    getAgentPerformance,
    getCategoryBreakdown,
    getTrends,
} from "../utils/analyticsApi";

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

function Analytics() {
    const dispatch = useDispatch();
    const [metrics, setMetrics] = useState(null);
    const [resolutionStats, setResolutionStats] = useState(null);
    const [agentPerformance, setAgentPerformance] = useState([]);
    const [categoryBreakdown, setCategoryBreakdown] = useState([]);
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState("daily");

    useEffect(() => {
        dispatch(setPageTitle({ title: "Analytics Dashboard" }));
        loadAnalyticsData();
    }, [dispatch]);

    useEffect(() => {
        loadTrendsData();
    }, [period]);

    const loadAnalyticsData = async () => {
        try {
            setLoading(true);
            const [metricsData, resolutionData, agentData, categoryData, trendsData] = await Promise.all([
                getAnalyticsMetrics(),
                getResolutionTimeStats(),
                getAgentPerformance(),
                getCategoryBreakdown(),
                getTrends(period, 30),
            ]);

            setMetrics(metricsData);
            setResolutionStats(resolutionData);
            setAgentPerformance(agentData);
            setCategoryBreakdown(categoryData);
            setTrends(trendsData);
        } catch (error) {
            console.error("Error loading analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadTrendsData = async () => {
        try {
            const trendsData = await getTrends(period, 30);
            setTrends(trendsData);
        } catch (error) {
            console.error("Error loading trends:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Tickets"
                    value={metrics?.total || 0}
                    subtitle="All time"
                    icon={ChartBarIcon}
                    color="primary"
                />
                <StatCard
                    title="Open Tickets"
                    value={metrics?.open || 0}
                    subtitle="Awaiting response"
                    icon={FolderIcon}
                    color="warning"
                />
                <StatCard
                    title="In Progress"
                    value={metrics?.inProgress || 0}
                    subtitle="Being worked on"
                    icon={ClockIcon}
                    color="info"
                />
                <StatCard
                    title="Resolved"
                    value={metrics?.resolved || 0}
                    subtitle={`${metrics?.resolutionRate || 0}% resolution rate`}
                    icon={CheckCircleIcon}
                    color="success"
                />
            </div>

            {/* Trends Chart */}
            <TitleCard title="Ticket Trends" topMargin="mt-2">
                <div className="flex justify-end mb-4">
                    <select
                        className="select select-bordered select-sm"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="created" stroke="#8b5cf6" name="Created" />
                        <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved" />
                    </LineChart>
                </ResponsiveContainer>
            </TitleCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Agent Performance */}
                <TitleCard title="Agent Performance" topMargin="mt-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={agentPerformance}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="resolvedTickets" fill="#8b5cf6" name="Resolved" />
                            <Bar dataKey="assignedTickets" fill="#3b82f6" name="Assigned" />
                        </BarChart>
                    </ResponsiveContainer>
                </TitleCard>

                {/* Category Breakdown */}
                <TitleCard title="Category Distribution" topMargin="mt-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryBreakdown}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ category, count }) => `${category}: ${count}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {categoryBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </TitleCard>
            </div>

            {/* Resolution Time Stats */}
            <TitleCard title="Resolution Time Statistics" topMargin="mt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Average Resolution Time</div>
                        <div className="stat-value text-primary">{resolutionStats?.average || 0}h</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Median Resolution Time</div>
                        <div className="stat-value text-secondary">{resolutionStats?.median || 0}h</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Categories Tracked</div>
                        <div className="stat-value">{resolutionStats?.byCategory?.length || 0}</div>
                    </div>
                </div>

                {resolutionStats?.byCategory?.length > 0 && (
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={resolutionStats.byCategory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
                            <Tooltip />
                            <Bar dataKey="average" fill="#8b5cf6" name="Avg Resolution Time (hours)" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </TitleCard>

            {/* Agent Performance Table */}
            <TitleCard title="Detailed Agent Metrics" topMargin="mt-2">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Agent</th>
                                <th>Assigned</th>
                                <th>Resolved</th>
                                <th>Resolution Rate</th>
                                <th>Avg Resolution Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agentPerformance.map((agent) => (
                                <tr key={agent.agentId}>
                                    <td>
                                        <div className="font-bold">{agent.name}</div>
                                        <div className="text-sm opacity-50">{agent.email}</div>
                                    </td>
                                    <td>{agent.assignedTickets}</td>
                                    <td>{agent.resolvedTickets}</td>
                                    <td>
                                        <div className="badge badge-primary">{agent.resolutionRate}%</div>
                                    </td>
                                    <td>{agent.avgResolutionTime}h</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </TitleCard>
        </div>
    );
}

export default Analytics;
