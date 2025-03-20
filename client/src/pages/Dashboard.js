import React, { Component } from "react";
import axios from "axios";
import DashboardStats from "../components/DashboardStats";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import {
  ClockIcon,
  WrenchScrewdriverIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { connect } from "react-redux";
import { getUsersContent } from "../redux/slices/userSlice";
import { ArrowPathIcon, InboxArrowDownIcon } from "@heroicons/react/24/outline";
import AmountStats from "../components/AmountStats";
import MyTicketsChart from "../components/MyTicketsChart";
import TicketStatusChart from "../components/TicketStatusChart";
import RecentTickets from "../components/RecentTickets";
import { fetchUsers, fetchTicketsAPi } from "../utils/api";
import { getTickets } from "../redux/slices/ticketSlice";
import { setPageTitle } from "../redux/slices/headerSlice";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      tickets: [],
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.applyTheme();
    this.fetchData();
    this.props.setPageTitle({
      title: "Home",
    });
  }

  applyTheme = () => {
    const theme = localStorage.getItem("theme") || "light"; // Default to 'light'
    document.documentElement.setAttribute("data-theme", theme);
  };

  getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return <ClockIcon className="w-10 h-10 text-yellow-500" />;
      case "inprogress":
        return <WrenchScrewdriverIcon className="w-10 h-10 text-blue-500" />;
      case "resolved":
        return <CheckBadgeIcon className="w-10 h-10 text-green-500" />;
      default:
        return <ClockIcon className="w-10 h-10 text-gray-500" />;
    }
  };

  fetchData = async () => {
    try {
      // Fetch users
      const usersResponse = await fetchUsers();
      console.log("res", usersResponse);

      if (usersResponse && usersResponse._id === null) {
        throw new Error(usersResponse.message || "Failed to fetch users");
      }

      // Fetch tickets
      const ticketsResponse = await fetchTicketsAPi();
      if (ticketsResponse && ticketsResponse._id === null) {
        throw new Error(ticketsResponse.message || "Failed to fetch tickets");
      }

      // Update state
      this.setState({
        users: usersResponse,
        tickets: ticketsResponse,
        loading: false,
      });

      // Update Redux store (if needed)
      this.props.getUsersContent(usersResponse);
      this.props.getTickets(ticketsResponse);
    } catch (error) {
      this.setState({
        error: error.message || "Failed to fetch data. Please try again later.",
        loading: false,
      });
      console.error("Error fetching data:", error);
    }
  };

  // Calculate ticket status distribution
  getTicketStatusDistribution = () => {
    const { tickets } = this.state;
    const statusCounts = {
      Open: 0,
      "In Progress": 0,
      Resolved: 0,
    };

    tickets != null &&
      tickets?.forEach((ticket) => {
        if (statusCounts[ticket.status]) {
          statusCounts[ticket.status]++;
        } else {
          statusCounts[ticket.status] = 1;
        }
      });

    return statusCounts;
  };

  render() {
    const { users, tickets, loading, error } = this.state;

    if (loading) {
      return (
        <div className="px-0 py-6  md:px-6 ">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* Skeleton for Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="skeleton h-32 w-full"></div>
            ))}
          </div>

          {/* Skeleton for Charts Section */}
          <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
            <div className="skeleton h-64 w-full"></div>
            <div className="skeleton h-64 w-full"></div>
          </div>

          {/* Skeleton for Ticket Status Distribution Section */}
          <div className="px-0 py-6  md:px-6  rounded-lg shadow-md mb-8">
            <h2 className="text-lg font-semibold mb-4">
              Ticket Status Distribution
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="skeleton h-24 w-full"></div>
              ))}
            </div>
          </div>

          {/* Skeleton for Recent Tickets Section */}
          <div className="skeleton h-64 w-full"></div>
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    const ticketStatusDistribution = this.getTicketStatusDistribution();

    return (
      <div className="px-0 py-6  md:px-6  ">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {users && (
            <DashboardStats
              title={"Total Users"}
              icon={<UserGroupIcon className="w-8 h-8" />}
              value={users.length}
              description={"↗︎ 2300 (22%)"}
              colorIndex={1}
            />
          )}
          {tickets && (
            <DashboardStats
              title={"Total Tickets"}
              icon={<InboxArrowDownIcon className="w-8 h-8" />}
              value={tickets.length}
              description={"↗︎ 2300 (22%)"}
              colorIndex={3}
            />
          )}
          <DashboardStats
            title={"Open Tickets"}
            icon={<ArrowPathIcon className="w-8 h-8" />}
            value={ticketStatusDistribution.Open}
            description={"↗︎ 2300 (22%)"}
            colorIndex={3}
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
          {tickets != null && (
            <>
              <MyTicketsChart tickets={tickets} />
              <TicketStatusChart tickets={tickets} />
            </>
          )}
        </div>

        {/* Ticket Status Distribution Section */}
        <div className="px-0 py-6  md:px-6  rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Ticket Status Distribution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(ticketStatusDistribution).map(([status, count]) => (
              <div key={status} className="p-4 rounded-lg">
                <AmountStats
                  title={status}
                  icon={this.getStatusIcon(status)}
                  value={count}
                  colorIndex={3}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tickets Section */}
        {tickets != null && <RecentTickets tickets={tickets} />}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  users: state.user.users,
});

const mapDispatchToProps = {
  getUsersContent,
  getTickets,
  setPageTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
