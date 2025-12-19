import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Layout from "./containers/Layout";
import Register from "./pages/Register";

const App = () => {
  const { token } = useSelector((state) => state.auth);

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
};

export default App;
