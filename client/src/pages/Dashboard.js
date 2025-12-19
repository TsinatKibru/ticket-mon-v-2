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
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardStats
          title="Total Users"
          icon={<UserGroupIcon className="w-8 h-8 text-primary" />}
          value={users?.length || 0}
          description="Active Platform Users"
          colorIndex={0}
        />
        <DashboardStats
          title="Total Tickets"
          icon={<InboxArrowDownIcon className="w-8 h-8 text-secondary" />}
          value={tickets?.length || 0}
          description="All time tickets"
          colorIndex={1}
        />
        <DashboardStats
          title="Open Issues"
          icon={<ArrowPathIcon className="w-8 h-8 text-accent" />}
          value={statusDist.Open}
          description="Currently needing attention"
          colorIndex={2}
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl p-4">
          <h3 className="font-bold text-lg mb-4 text-center">Ticket Volume</h3>
          <MyTicketsChart tickets={tickets} />
        </div>
        <div className="card bg-base-100 shadow-xl p-4">
          <h3 className="font-bold text-lg mb-4 text-center">Status Breakdown</h3>
          <TicketStatusChart tickets={tickets} />
        </div>
      </div>

      {/* Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(statusDist).map(([status, count]) => (
          <div key={status} className="stats shadow-lg bg-base-100 border border-base-200">
            <div className="stat">
              <div className="stat-figure text-primary">
                {getStatusIcon(status)}
              </div>
              <div className="stat-title font-bold">{status}</div>
              <div className="stat-value text-2xl">{count}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tickets */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Recent Activity</h2>
          <RecentTickets tickets={tickets} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
