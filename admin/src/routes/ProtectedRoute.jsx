import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, sessionChecked, user } = useSelector(
    (state) => state.adminAuth,
  );

  if (!sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedRoute;
