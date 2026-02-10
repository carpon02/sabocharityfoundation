// App.jsx
import React, { useEffect, Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { loadUserFromStorage } from "./features/auth/authSlice";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import { ScrollToTop, ScrollToTopButton } from "./components";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/public/Home"));
const About = lazy(() => import("./pages/public/About"));
const Blogs = lazy(() => import("./pages/public/Blogs"));
const Campaigns = lazy(() => import("./pages/public/Campaigns"));
const Contact = lazy(() => import("./pages/public/Contact"));
const GetInvolved = lazy(() => import("./pages/public/GetInvolved"));
const Media = lazy(() => import("./pages/public/Media"));
const Donation = lazy(() => import("./pages/public/Donation"));
const Login = lazy(() => import("./pages/public/Login"));
const Verify = lazy(() => import("./pages/public/Verify"));
const ForgotPassword = lazy(() => import("./pages/public/ForgotPassword"));
const PrivacyPolicy = lazy(() => import("./pages/public/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/public/TermsOfService"));
const Sitemap = lazy(() => import("./pages/public/Sitemap"));
const FAQ = lazy(() => import("./pages/public/FAQ"));

const Dashboard = lazy(() => import("./pages/user/Dashboard"));
const Events = lazy(() => import("./pages/user/Events"));
const EventDetails = lazy(() => import("./pages/user/EventDetails"));
const Settings = lazy(() => import("./pages/user/Settings"));
const MyDonation = lazy(() => import("./pages/user/MyDonation"));
const Help = lazy(() => import("./pages/user/Help"));
const MyCampaigns = lazy(() => import("./pages/user/MyCampaigns"));

import PublicLayout from "./layout/PublicLayout";
import UserLayout from "./layout/UserLayout";
import ProgramDetail from "./components/CampaignDetail";
import NotFound from "./pages/public/NotFound";
import CampaignDetail from "./components/CampaignDetail";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Load user from storage on app mount
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <ThemeProvider>
      <ScrollToTop />
      <ScrollToTopButton />
      <ErrorBoundary>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1f2937",
              color: "#fff",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "14px",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />

        <Suspense fallback={<LoadingSpinner fullScreen message="Loading..." />}>
          <Routes>
            {/* 🌍 Public Pages with Navbar/Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<ProgramDetail />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/campaigns/:id" element={<CampaignDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/get-involved" element={<GetInvolved />} />
              <Route path="/media" element={<Media />} />
              <Route path="/make-donation" element={<Donation />} />
              <Route path="/updates/:id" element={<ProgramDetail />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/faq" element={<FAQ />} />
            </Route>

            {/* 📝 Auth Pages WITHOUT Navbar/Footer */}
            <Route
              path="/login"
              element={
                user ? <Navigate to="/user/dashboard" replace /> : <Login />
              }
            />

            {/* Verification page - accessible if logged in but not verified */}
            {/* Verification page - accessible via registration redirect or email link */}
            <Route path="/verify" element={<Verify />} />

            {/* Verification with token in URL */}
            <Route path="/verify/:token" element={<Verify />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* 🔒 Protected User Pages WITHOUT Navbar/Footer */}
            <Route element={<ProtectedRoute />}>
              <Route element={<UserLayout />}>
                <Route path="/user/dashboard" element={<Dashboard />} />
                <Route path="/user/events" element={<Events />} />
                <Route path="/user/events/:id" element={<EventDetails />} />
                <Route path="/user/settings" element={<Settings />} />
                <Route path="/user/my-donations" element={<MyDonation />} />
                <Route path="/user/my-campaigns" element={<MyCampaigns />} />
                <Route path="/user/help" element={<Help />} />
              </Route>
            </Route>

            {/* ⚠️ Catch-all 404 Page WITHOUT Navbar/Footer */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
