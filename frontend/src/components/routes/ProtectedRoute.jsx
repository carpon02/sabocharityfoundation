import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "../LoadingSpinner";

const ProtectedRoute = () => {
  const { isAuthenticated, sessionChecked } = useSelector((state) => state.auth);

  if (!sessionChecked) {
    return <LoadingSpinner fullScreen message="Checking session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
