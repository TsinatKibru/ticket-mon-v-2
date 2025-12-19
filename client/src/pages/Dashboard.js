import React, { useEffect, useState } from "react";
import DashboardStats from "../components/DashboardStats";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import {
  ClockIcon,
  WrenchScrewdriverIcon,
  CheckBadgeIcon,
  ArrowPathIcon,
  InboxArrowDownIcon,
} from "@heroicons/react/24/outline";
import { useDispatch } from "react-redux";
import { getUsersContent } from "../redux/slices/userSlice";
import AmountStats from "../components/AmountStats";
import MyTicketsChart from "../components/MyTicketsChart";
import TicketStatusChart from "../components/TicketStatusChart";
import RecentTickets from "../components/RecentTickets";
import { fetchUsers, fetchTicketsAPi } from "../utils/api";
import { getTickets } from "../redux/slices/ticketSlice";
import { setPageTitle } from "../redux/slices/headerSlice";

function Dashboard() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Dashboard" }));
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    try {
      const usersData = await fetchUsers();
      const ticketsData = await fetchTicketsAPi();

      if (usersData && usersData._id === null) throw new Error(usersData.message);
      if (ticketsData && ticketsData._id === null) throw new Error(ticketsData.message);

      setUsers(usersData);
      setTickets(ticketsData);
      dispatch(getUsersContent(usersData));
      dispatch(getTickets(ticketsData));
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch data.");
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "open": return <ClockIcon className="w-8 h-8 text-secondary" />;
      case "inprogress": return <WrenchScrewdriverIcon className="w-8 h-8 text-primary" />;
      case "resolved": return <CheckBadgeIcon className="w-8 h-8 text-success" />;
      default: return <ClockIcon className="w-8 h-8 text-gray-500" />;
    }
  };

  const getTicketStatusDistribution = () => {
    const statusCounts = { Open: 0, "In Progress": 0, Resolved: 0 };
    tickets?.forEach((ticket) => {
      if (statusCounts[ticket.status] !== undefined) statusCounts[ticket.status]++;
      else statusCounts[ticket.status] = 1;
    });
    return statusCounts;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-32 w-full rounded-xl"></div>)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="skeleton h-64 w-full rounded-xl"></div>
          <div className="skeleton h-64 w-full rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) return <div className="p-6 text-error text-center font-bold">{error}</div>;

  const statusDist = getTicketStatusDistribution();

  return (
    <div className="p-4 md:p-6 space-y-8 min-h-screen">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1 ml-1">
        <h1 className="text-3xl font-bold font-outfit tracking-tight">System Overview</h1>
        <p className="text-base-content/60 text-sm">Real-time stats and performance metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <DashboardStats
          title="Total Users"
          icon={<UserGroupIcon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />}
          value={users?.length || 0}
          description="Active platform participants"
          colorIndex={0}
        />
        <DashboardStats
          title="Total Tickets"
          icon={<InboxArrowDownIcon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />}
          value={tickets?.length || 0}
          description="Consolidated ticket volume"
          colorIndex={1}
        />
        <DashboardStats
          title="Open Issues"
          icon={<ArrowPathIcon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />}
          value={statusDist.Open}
          description="Awaiting agent response"
          colorIndex={2}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-effect rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-transparent opacity-30"></div>
            <h3 className="font-bold text-xl mb-8 font-outfit flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full"></span>
              Ticket Volume Trends
            </h3>
            <div className="h-[300px]">
              <MyTicketsChart tickets={tickets} />
            </div>
          </div>

          {/* Recent Tickets Container */}
          <div className="glass-effect rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center">
              <h2 className="font-bold text-xl font-outfit">Recent Activity</h2>
              <button className="text-xs font-semibold text-primary hover:text-primary-focus transition-colors uppercase tracking-widest">
                View All
              </button>
            </div>
            <div className="p-2">
              <RecentTickets tickets={tickets} />
            </div>
          </div>
        </div>

        {/* Right Sidebar on Dashboard */}
        <div className="space-y-8">
          <div className="glass-effect rounded-3xl p-8 shadow-2xl">
            <h3 className="font-bold text-xl mb-8 font-outfit text-center">Status Distribution</h3>
            <div className="h-[250px]">
              <TicketStatusChart tickets={tickets} />
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(statusDist).map(([status, count]) => (
              <AmountStats
                key={status}
                status={status}
                title={status}
                value={count}
                icon={getStatusIcon(status)}
                colorIndex={status === "Resolved" ? 1 : 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
