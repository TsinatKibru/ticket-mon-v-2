import React, { Component } from "react";

class NotificationContainer extends Component {
  render() {
    return (
      <div className="fixed bottom-4 right-4 bg-white shadow-lg p-4 rounded-lg">
        <h2 className="text-lg font-bold">Notifications</h2>
        <p>No new notifications</p>
      </div>
    );
  }
}

export default NotificationContainer;
