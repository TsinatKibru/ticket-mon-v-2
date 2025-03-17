import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./containers/Layout";
import Register from "./pages/Register";
import { connect } from "react-redux";

class App extends Component {
  render() {
    const { token } = this.props.auth;

    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            element={<Navigate to={token ? "/app" : "/login"} />}
          />
          <Route
            path="/app/*"
            element={token ? <Layout /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(App);
