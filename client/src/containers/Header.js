

import { themeChange } from "theme-change";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";
import { openRightDrawer } from "../redux/slices/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";
import { Link } from "react-router-dom";
import socket from "../utils/socket";
import { LogOutIcon, UserIcon } from "lucide-react";
import { fixImageUrl } from "../utils/imageUtils";
import { getUnreadNotifications } from "../redux/slices/notificationSlice";

function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { pageTitle } = useSelector((state) => state.header);
  const { notifications } = useSelector((state) => state.notification);

  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    themeChange(false);
    if (!localStorage.getItem("theme")) {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setCurrentTheme(isDark ? "dark" : "light");
    }
    dispatch(getUnreadNotifications());
  }, [dispatch]);

  const openNotification = () => {
    dispatch(openRightDrawer({
      header: "Notifications",
      bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION,
    }));
  };

  const logoutUser = () => {
    if (socket) {
      socket.disconnect();
    }
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="navbar sticky top-0 bg-base-100/80 backdrop-blur-md z-10 shadow-sm border-b border-base-200">
      <div className="flex-1">
        <label
          htmlFor="left-sidebar-drawer"
          className="btn btn-ghost drawer-button lg:hidden"
        >
          <Bars3Icon className="h-5 inline-block w-5" />
        </label>
        <h1 className="text-xl font-bold ml-2 text-primary">{pageTitle}</h1>
      </div>

      <div className="flex-none gap-2">
        {/* Theme Toggle */}
        <label className="swap swap-rotate btn btn-ghost btn-circle">
          <input
            type="checkbox"
            onChange={(e) => {
              const newTheme = e.target.checked ? "business" : "light";
              setCurrentTheme(newTheme);
              localStorage.setItem("theme", newTheme);
              document.documentElement.setAttribute('data-theme', newTheme);
            }}
            checked={currentTheme === "business"}
          />
          <SunIcon
            className="swap-on fill-current w-5 h-5"
          />
          <MoonIcon
            className="swap-off fill-current w-5 h-5"
          />
        </label>

        {/* Notifications */}
        <button
          className="btn btn-ghost btn-circle"
          onClick={openNotification}
        >
          <div className="indicator">
            <BellIcon className="h-6 w-6" />
            {notifications.length > 0 && (
              <span className="indicator-item badge badge-primary badge-xs">
                {notifications.length}
              </span>
            )}
          </div>
        </button>

        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar ring ring-primary/20 ring-offset-base-100 ring-offset-2">
            <div className="w-10 rounded-full">
              <img src={fixImageUrl(user?.profileImage) || "/dummyprofile.jpeg"} alt="profile" />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-200"
          >
            <li className="menu-title">
              <span>{user?.email}</span>
            </li>
            <li>
              <Link to={"/app/settings"} className="justify-between">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Profile Settings
                </div>
              </Link>
            </li>
            <div className="divider my-0"></div>
            <li>
              <a onClick={logoutUser} className="text-error">
                <LogOutIcon className="h-4 w-4" /> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
