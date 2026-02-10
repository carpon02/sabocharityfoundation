// components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  // ✅ If authenticated → render child routes inside UserLayout
  return <Outlet />;
};

export default ProtectedRoute;
