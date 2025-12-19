import React, { Component } from "react";
import PageContent from "./PageContent";
import LeftSidebar from "./LeftSidebar";
import ModalLayout from "../components/ModalLayout";
import { Toaster } from "sonner";
import RightSidebar from "./RightSidebar";

class Layout extends Component {
  render() {
    return (
      <>
        {/* Left drawer - containing page content and sidebar (always open) */}
        <div className="drawer lg:drawer-open">
          <input
            id="left-sidebar-drawer"
            type="checkbox"
            className="drawer-toggle"
          />
          <PageContent />
          <LeftSidebar />
        </div>

        {/* Premium Notification System */}
        <Toaster
          position="top-right"
          richColors
          expand={true}
          closeButton
          duration={4000}
        />

        <RightSidebar />

        {/* Modal layout container */}
        <ModalLayout />
      </>
    );
  }
}

export default Layout;
