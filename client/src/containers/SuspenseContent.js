import React, { Component } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline"; // Ensure you have Heroicons installed

class SuspenseContent extends Component {
  render() {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-base-100">
        <div className="flex flex-col items-center">
          <ArrowPathIcon className="w-10 h-10 text-primary animate-spin" />
          <p className="text-lg text-gray-500 dark:text-gray-300 mt-4">
            Loading...
          </p>
        </div>
      </div>
    );
  }
}

export default SuspenseContent;
