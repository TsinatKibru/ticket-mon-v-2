import React, { Component, Suspense, createRef } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import SuspenseContent from "./SuspenseContent";
import ProtectedRoute from "./ProtectedRoute";
import Page404 from "../pages/Page404";
import { routes } from "../utils/routes"; // Assuming routes is an array of route objects
import PageForbidden from "../pages/PageForbidden";

class PageContent extends Component {
  constructor(props) {
    super(props);
    this.mainContentRef = createRef();
  }

  render() {
    return (
      <div className="drawer-content flex flex-col">
        <Header />
        <main
          className="flex-1 overflow-y-auto md:pt-4 pt-4 px-1 md:px-6 bg-base-200"
          ref={this.mainContentRef}
        >
          <Suspense fallback={<SuspenseContent />}>
            <Routes>
              {routes.map((route, key) => (
                <Route
                  key={key}
                  path={route.path}
                  element={
                    <ProtectedRoute
                      element={route.component}
                      allowedRoles={route.allowedRoles}
                    />
                  }
                />
              ))}
              {/* Redirect unknown URLs to 404 page */}
              <Route path="/page401" element={<PageForbidden />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </Suspense>
          <div className="h-16"></div>
        </main>
      </div>
    );
  }
}

export default PageContent;
