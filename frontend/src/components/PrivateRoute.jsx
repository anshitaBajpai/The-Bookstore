import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    // User not logged in → redirect to AuthPage
    return <Navigate to="/auth" />;
  }

  if (adminOnly && role !== "admin") {
    // Non-admin trying to access admin page
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
