import Dashboard from "../pages/Dashboard";
import Tickets from "../pages/Tickets";
import TicketDetails from "../pages/TicketDetails";
import UserList from "../pages/UserList";
import Settings from "../pages/Settings";
import Analytics from "../pages/Analytics";
import Templates from "../pages/Templates";
import Automation from "../pages/Automation";

import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";

import InboxArrowDownIcon from "@heroicons/react/24/outline/InboxArrowDownIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import ChartBarIcon from "@heroicons/react/24/outline/ChartBarIcon";
import DocumentDuplicateIcon from "@heroicons/react/24/outline/DocumentDuplicateIcon";
import Cog6ToothIcon from "@heroicons/react/24/outline/Cog6ToothIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import TicketsList from "../pages/TicketsList";
import { Building2, Ticket } from "lucide-react";
import DepartmentsPage from "../pages/department/DepartmentsPage";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

export const routes = [
  {
    path: "/",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
    component: Dashboard,
    allowedRoles: ["admin", "user", "support_agent"],
    section: "Overview",
  },
  {
    path: "/analytics",
    icon: <ChartBarIcon className={iconClasses} />,
    name: "Analytics",
    component: Analytics,
    allowedRoles: ["admin", "support_agent"],
    section: "Overview",
  },
  {
    path: "/tickets",
    icon: <Ticket className={iconClasses} />,
    name: "Tickets",
    component: TicketsList,
    allowedRoles: ["admin", "user", "support_agent"],
    section: "Support",
  },
  {
    path: "/teams",
    icon: <Building2 className={iconClasses} />,
    name: "Departments",
    component: DepartmentsPage,
    allowedRoles: ["admin", "user", "support_agent"],
    section: "Support",
  },
  {
    path: "/users",
    icon: <UsersIcon className={submenuIconClasses} />,
    name: "Users List",
    component: UserList,
    allowedRoles: ["admin"],
    section: "Manage",
  },
  {
    path: "/templates",
    icon: <DocumentDuplicateIcon className={iconClasses} />,
    name: "Templates",
    component: Templates,
    allowedRoles: ["admin"],
    section: "Manage",
  },
  {
    path: "/automation",
    icon: <BoltIcon className={iconClasses} />,
    name: "Automation",
    component: Automation,
    allowedRoles: ["admin"],
    section: "Manage",
  },
  {
    path: "/settings",
    icon: <UsersIcon className={iconClasses} />,
    name: "Settings",
    component: Settings,
    allowedRoles: ["admin", "user", "support_agent"],
    section: "Settings",
  },
];
