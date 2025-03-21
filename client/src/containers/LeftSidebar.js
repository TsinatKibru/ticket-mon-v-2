// // import React, { Component } from "react";
// // import { NavLink, Routes, Link, useLocation } from "react-router-dom"; // Import useLocation
// // import SidebarSubmenu from "./SidebarSubmenu";
// // import { XMarkIcon } from "@heroicons/react/24/outline";
// // import { routes } from "../utils/routes";
// // import { connect } from "react-redux";
// // import { Boxes } from "lucide-react";

// // class LeftSidebar extends Component {
// //   componentWillUnmount() {
// //     window.removeEventListener("popstate", this.updateLocation);
// //   }

// //   closeSidebar = () => {
// //     document.getElementById("left-sidebar-drawer").click();
// //   };

// //   render() {
// //     // Access pathname from props
// //     const { pathname } = this.props.location;

// //     return (
// //       <div className="drawer-side z-30 border-r border-gray-200 dark:border-white/15">
// //         <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
// //         <ul className="menu pt-2 w-64 bg-base-100 min-h-full text-base-content">
// //           {/* Close button */}
// //           <button
// //             className="btn btn-ghost bg-base-300 btn-circle z-50 top-0 right-0 mt-2 mr-2 absolute lg:hidden"
// //             onClick={this.closeSidebar}
// //           >
// //             <XMarkIcon className="h-5 w-5 inline-block" />
// //           </button>

// //           {/* Logo and Title */}
// //           <li className="mb-6 font-semibold text-xl">
// //             {" "}
// //             <div className="flex items-center gap-2">
// //               <Boxes className="h-8 w-8 text-purple-800 " />
// //               <span className="text-xl font-bold">TaskFlow</span>
// //             </div>
// //           </li>

// //           {/* Sidebar Menu Items */}
// //           {routes.map((route, k) => (
// //             <li key={k} className="mb-1">
// //               {" "}
// //               {/* Added margin-bottom for spacing */}
// //               {route.submenu ? (
// //                 <SidebarSubmenu {...route} />
// //               ) : (
// //                 <NavLink
// //                   end
// //                   to={`/app${route.path}`}
// //                   className={
// //                     ({ isActive }) =>
// //                       `${
// //                         isActive ? "font-semibold bg-base-200" : "font-normal"
// //                       } py-1 px-2 rounded-lg` // Increased padding and rounded corners
// //                   }
// //                   onClick={this.closeSidebar}
// //                 >
// //                   <div className="flex items-center gap-3 ">
// //                     {" "}
// //                     {/* Added gap for icon and text spacing */}
// //                     <div className="text-2xl ">{route.icon}</div>
// //                     <span className="text-lg font-normal font-serif">
// //                       {route.name}
// //                     </span>{" "}
// //                     {/* Increased font size */}
// //                   </div>
// //                   {pathname === `/app${route.path}` && ( // Use pathname for comparison
// //                     <span
// //                       className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary"
// //                       aria-hidden="true"
// //                     ></span>
// //                   )}
// //                 </NavLink>
// //               )}
// //             </li>
// //           ))}
// //         </ul>
// //       </div>
// //     );
// //   }
// // }

// // const mapStateToProps = (state) => ({
// //   location: state.location,
// // });

// // // Wrap the component with withRouter to access location
// // function withRouter(Component) {
// //   function ComponentWithRouterProp(props) {
// //     let location = useLocation();
// //     return <Component {...props} location={location} />;
// //   }

// //   return ComponentWithRouterProp;
// // }

// // export default connect(mapStateToProps)(withRouter(LeftSidebar));
import React, { Component } from "react";
import { NavLink, Routes, Link, useLocation } from "react-router-dom"; // Import useLocation
import SidebarSubmenu from "./SidebarSubmenu";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { routes } from "../utils/routes";
import { connect } from "react-redux";
import { Boxes } from "lucide-react";

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
    const { user } = this.props.auth;

    return (
      <div className="drawer-side z-30">
        <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
        <ul className="menu pt-2 w-64 bg-base-100 min-h-full text-base-content">
          {/* Close button */}
          <button
            className="btn btn-ghost bg-base-300 btn-circle z-50 top-0 right-0 mt-2 mr-2 absolute lg:hidden"
            onClick={this.closeSidebar}
          >
            <XMarkIcon className="h-5 w-5 inline-block" />
          </button>

          {/* Logo and Title */}
          <li className="mb-4 font-semibold text-xl">
            <div className="flex items-center gap-2">
              <Boxes className="h-8 w-8 text-purple-800 " />
              <span className="text-xl font-bold ">TaskFlow</span>
            </div>
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
                  onClick={this.closeSidebar}
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
          <li className="mt-auto border-t border-base-200 pt-4">
            <div className="flex items-center gap-2 p-4">
              <img
                src={user?.profileImage || "/intro.png"}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-base-content/70">{user?.email}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  location: state.location,
  auth: state.auth,
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
