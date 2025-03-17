import React, { Component } from "react";
import { NavLink, Routes, Link, useLocation } from "react-router-dom"; // Import useLocation
import SidebarSubmenu from "./SidebarSubmenu";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { routes } from "../utils/routes";
import { connect } from "react-redux";

class LeftSidebar extends Component {
  componentWillUnmount() {
    window.removeEventListener("popstate", this.updateLocation);
  }

  closeSidebar = () => {
    document.getElementById("left-sidebar-drawer").click();
  };

  render() {
    // Access pathname from props

    const { pathname } = this.props.location;

    return (
      <div className="drawer-side z-30">
        <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
        <ul className="menu pt-2 w-80 bg-base-100 min-h-full text-base-content">
          {/* Close button */}
          <button
            className="btn btn-ghost bg-base-300 btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden"
            onClick={this.closeSidebar}
          >
            <XMarkIcon className="h-5 w-5 inline-block" />
          </button>

          {/* Logo and Title */}
          <li className="mb-2 font-semibold text-xl">
            <Link to="/app/welcome">
              <img
                className="mask mask-squircle w-10"
                src="/logoshortcut.png"
                alt="TicketMon Logo"
              />
              TicketMon
            </Link>
          </li>

          {/* Sidebar Menu Items */}
          {routes.map((route, k) => (
            <li key={k}>
              {route.submenu ? (
                <SidebarSubmenu {...route} />
              ) : (
                <NavLink
                  end
                  to={`/app${route.path}`}
                  className={({ isActive }) =>
                    `${isActive ? "font-semibold bg-base-200" : "font-normal"}`
                  }
                >
                  {route.icon} {route.name}
                  {pathname === `/app${route.path}` && ( // Use pathname for comparison
                    <span
                      className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary"
                      aria-hidden="true"
                    ></span>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  location: state.location,
});

// Wrap the component with withRouter to access location
function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    return <Component {...props} location={location} />;
  }

  return ComponentWithRouterProp;
}

export default connect(mapStateToProps)(withRouter(LeftSidebar));
