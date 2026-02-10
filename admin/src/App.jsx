// App.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AdminLayout from "./component/layout/AdminLayout";
import Donors from "./component/pages/Donors";
import Help from "./component/pages/Help";
import Payments from "./component/pages/Payments";
import Reports from "./component/pages/Reports";
import Settings from "./component/pages/Settings";
import AdminDashboard from "./component/pages/AdminDashboard";
import Blog from "./component/pages/Blog";
import AdminLogin from "./component/pages/AdminLogin";
// import ProtectedRoute from "./component/ProtectedRoute";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Events from "./component/pages/Events";
import CreateEvent from "./component/pages/CreateEvent";
import EditEvent from "./component/pages/EditEvent";
import EventDetails from "./component/pages/EventDetails";
import Campaigns from "./component/pages/Campaigns";
import { loadAdminFromStorage } from "./features/auth/adminAuthSlice";

const App = () => {
  const dispatch = useDispatch();

  // Load admin token from localStorage on app mount
  useEffect(() => {
    dispatch(loadAdminFromStorage());
  }, [dispatch]);
  return (
    <ThemeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/admin-login" replace />} />

        {/* Admin Login Page (Public) */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="events" element={<Events />} />
          <Route path="events/create" element={<CreateEvent />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="events/:id/edit" element={<EditEvent />} />
          <Route path="donors" element={<Donors />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />
          <Route path="blogs" element={<Blog />} />

          {/* Redirect /admin to /admin/admin-dashboard */}
          <Route index element={<Navigate to="admin-dashboard" replace />} />
        </Route>

        {/* 404 catch-all - redirect to login */}
        <Route path="*" element={<Navigate to="/admin-login" replace />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
