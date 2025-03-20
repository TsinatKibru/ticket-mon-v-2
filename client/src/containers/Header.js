import { themeChange } from "theme-change";
import React, { Component } from "react";
import { connect } from "react-redux";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";
import { openRightDrawer } from "../redux/slices/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios for making HTTP requests
import { updateUser } from "../redux/slices/userSlice";
import socket from "../utils/socket";
import { setUser } from "../redux/slices/authSlice";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTheme: localStorage.getItem("theme") || "light",
      profileImage: this.props.auth.user?.profileImage || "/dummyprofile.jpeg", // Default profile image
    };
  }

  componentDidMount() {
    themeChange(false);
    if (!this.state.currentTheme) {
      this.setState({
        currentTheme: window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
      });
    }
  }

  openNotification = () => {
    this.props.openRightDrawer({
      header: "Notifications",
      bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION,
    });
  };

  logoutUser = () => {
    if (socket) {
      socket.disconnect(); // Disconnect from the socket server
    }
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Handle profile image upload
  handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await axios.post(
        `/api/v1/users/${this.props.auth.user._id}/upload-profile-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update the profile image in the state
      this.setState({ profileImage: response.data.data.profileImage });

      // Optionally, update the user in the Redux store
      this.props.updateUser({ updatedUser: response.data.data });
      this.props.setUser(response.data.data);
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  render() {
    const { currentTheme, profileImage } = this.state;
    const { user } = this.props.auth;
    const { notifications } = this.props;
    const { pageTitle } = this.props;

    return (
      <>
        <div className="navbar sticky top-0 bg-base-100 z-10 shadow-md">
          {/* Menu toggle for mobile view or small screen */}
          <div className="flex-1">
            <label
              htmlFor="left-sidebar-drawer"
              className="btn btn-primary drawer-button lg:hidden"
            >
              <Bars3Icon className="h-5 inline-block w-5" />
            </label>
            <h1 className="text-xl  ml-2">{pageTitle}</h1>
          </div>

          <div className="flex-none">
            <label className="swap">
              <input type="checkbox" />
              <SunIcon
                data-set-theme="light"
                data-act-class="ACTIVECLASS"
                className={
                  "fill-current w-6 h-6 " +
                  (currentTheme === "dark" ? "swap-on" : "swap-off")
                }
              />
              <MoonIcon
                data-set-theme="dark"
                data-act-class="ACTIVECLASS"
                className={
                  "fill-current w-6 h-6 " +
                  (currentTheme === "light" ? "swap-on" : "swap-off")
                }
              />
            </label>

            {/* Notification icon */}
            <button
              className="btn btn-ghost ml-4 btn-circle"
              onClick={this.openNotification}
            >
              <div className="indicator">
                <BellIcon className="h-6 w-6" />
                {notifications.length > 0 ? (
                  <span className="indicator-item badge badge-secondary badge-sm">
                    {notifications.length}
                  </span>
                ) : null}
              </div>
            </button>

            {/* Profile icon, opening menu on click */}
            <div className="dropdown dropdown-end ml-4">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={user?.profileImage || profileImage} alt="profile" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li className="justify-between">
                  <Link to={"/app/"}>
                    {user?.name}
                    <span className="badge">New</span>
                  </Link>
                </li>

                {/* Add a file input for uploading profile image */}
                <li>
                  <label
                    htmlFor="profileImageUpload"
                    className="cursor-pointer"
                  >
                    Upload Profile Image
                  </label>
                  <input
                    id="profileImageUpload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={this.handleProfileImageUpload}
                  />
                </li>

                <div className="divider mt-0 mb-0"></div>
                <li>
                  <a onClick={this.logoutUser}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  users: state.user.users,
  auth: state.auth,
  notifications: state.notification.notifications,
  pageTitle: state.header.pageTitle,
});

const mapDispatchToProps = {
  updateUser,
  openRightDrawer,
  setUser,
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
