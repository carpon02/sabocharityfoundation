import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "../LoadingSpinner";

const ProtectedRoute = () => {
  const { isAuthenticated, sessionChecked } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!sessionChecked) {
    return <LoadingSpinner fullScreen message="Checking session..." />;
  }

  if (!isAuthenticated) {
    // Preserve the attempted URL so login can redirect back after auth
    const redirectTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectTo}`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
