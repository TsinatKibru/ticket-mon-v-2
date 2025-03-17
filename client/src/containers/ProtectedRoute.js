import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";

class ProtectedRoute extends Component {
  render() {
    const { user, loading } = this.props.auth;
    const { element: Component, allowedRoles } = this.props;

    if (user == null) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-lg font-semibold">Loading...</p>
          </div>
        </div>
      );
    }

    if (user != null && !allowedRoles.includes(user.role)) {
      return <Navigate to="/app/page401" />;
    }

    return <Component />;
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(ProtectedRoute);
