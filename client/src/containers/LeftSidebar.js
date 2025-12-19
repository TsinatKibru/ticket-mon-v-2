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
import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import SidebarSubmenu from "./SidebarSubmenu";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { routes } from "../utils/routes";
import { useSelector } from "react-redux";
import { Boxes } from "lucide-react";
import { fixImageUrl } from "../utils/imageUtils";

function LeftSidebar() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const closeSidebar = () => {
    const drawer = document.getElementById("left-sidebar-drawer");
    if (drawer) drawer.click();
  };

  return (
    <div className="drawer-side z-30">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <div className="w-72 min-h-full premium-sidebar flex flex-col text-neutral-content sidebar-glass">
        {/* Close button for mobile */}
        <button
          className="btn btn-ghost btn-circle z-50 top-4 right-4 absolute lg:hidden text-white hover:bg-white/10"
          onClick={closeSidebar}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Branding Section */}
        <div className="px-8 pt-10 pb-6">
          <Link to="/app/dashboard" className="flex items-center gap-3 group transition-all duration-300">
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors logo-glow">
              <Boxes className="h-8 w-8 text-primary shadow-primary/50 shadow-sm" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white font-outfit">
              TaskFlow
            </span>
          </Link>
        </div>

        {/* Profile Section - Moved to Top */}
        <div className="px-4 mb-8">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 glass-item group hover:bg-white/[0.08]">
            <div className="relative">
              <img
                src={fixImageUrl(user?.profileImage) || "/intro.png"}
                alt="profile"
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all shadow-lg shadow-black/20"
              />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#1a1c23] rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate font-outfit">
                {user?.name}
              </p>
              <p className="text-[11px] text-neutral-content/50 truncate tracking-wider uppercase font-semibold">
                {user?.role?.replace("_", " ")}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar pb-10">
          {Object.entries(
            routes
              .filter(route => !route.allowedRoles || route.allowedRoles.includes(user?.role))
              .reduce((acc, route) => {
                const section = route.section || "Other";
                if (!acc[section]) acc[section] = [];
                acc[section].push(route);
                return acc;
              }, {})
          ).map(([section, sectionRoutes], idx) => (
            <div key={section} className="space-y-3">
              <h3 className="px-4 text-[11px] font-bold text-neutral-content/30 uppercase tracking-[0.2em] font-outfit">
                {section}
              </h3>
              <div className="space-y-1">
                {sectionRoutes.map((route, k) => (
                  <div key={k} className="group">
                    {route.submenu ? (
                      <SidebarSubmenu {...route} />
                    ) : (
                      <NavLink
                        end
                        to={`/app${route.path}`}
                        className={({ isActive }) =>
                          `flex items-center gap-4 py-2.5 px-4 rounded-xl transition-all duration-300 glass-item ${isActive
                            ? "active-nav-item"
                            : "text-neutral-content/60 hover:text-white"
                          }`
                        }
                        onClick={closeSidebar}
                      >
                        <span className="text-xl transition-transform duration-300 group-hover:scale-110">
                          {route.icon}
                        </span>
                        <span className="text-[14px] font-medium tracking-wide">
                          {route.name}
                        </span>
                      </NavLink>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Spacer for bottom */}
        <div className="h-4"></div>
      </div>
    </div>
  );
}

export default LeftSidebar;
