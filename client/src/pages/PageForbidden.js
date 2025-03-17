import React, { Component } from "react";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";

class PageForbidden extends Component {
  render() {
    return (
      <div className="hero h-4/5 bg-base-200">
        <div className="hero-content text-error text-center">
          <div className="max-w-md">
            <LockClosedIcon className="h-48 w-48 inline-block" />
            <h1 className="text-5xl font-bold">403 - Forbidden</h1>
            <p className="py-6">
              You do not have permission to access this page.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default PageForbidden;
