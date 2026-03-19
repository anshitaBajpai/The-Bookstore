import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ adminOnly = false }) => {
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

  return <Outlet />;
};

export default PrivateRoute;
