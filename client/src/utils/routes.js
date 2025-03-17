import Dashboard from "../pages/Dashboard";
import Tickets from "../pages/Tickets";
import TicketDetails from "../pages/TicketDetails";
import UserList from "../pages/UserList";

import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";

import InboxArrowDownIcon from "@heroicons/react/24/outline/InboxArrowDownIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import TicketsList from "../pages/TicketsList";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

export const routes = [
  {
    path: "/",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
    component: Dashboard,
    allowedRoles: ["admin", "user", "support_agent"],
  },
  {
    path: "/users",
    icon: <UsersIcon className={submenuIconClasses} />,
    name: "Users List",
    component: UserList,
    allowedRoles: ["admin"],
  },
  {
    path: "/tickets",
    icon: <InboxArrowDownIcon className={iconClasses} />,
    name: "Tickets",
    component: TicketsList,
    allowedRoles: ["admin", "user", "support_agent"],
  },
];
