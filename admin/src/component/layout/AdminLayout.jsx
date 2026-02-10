// layouts/AdminLayout.jsx - Sabo Ibadan Youth Charity Foundation
import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Search,
  Bell,
  Settings,
  HelpCircle,
  DollarSign,
  Users,
  Target,
  BarChart3,
  LayoutDashboard,
  Sun,
  Moon,
  Plus,
  LogOut,
  Menu,
  X,
  Rss,
  Calendar,
  Activity,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { logoutAdmin } from "../../features/auth/adminAuthSlice";

// Navigation Configuration
const NAVIGATION_CONFIG = {
  mainLinks: [
    {
      name: "Dashboard",
      path: "/admin/admin-dashboard",
      icon: LayoutDashboard,
    },
    { name: "Projects", path: "/admin/campaigns", icon: Target },
    { name: "Events", path: "/admin/events", icon: Calendar },
    { name: "Donors", path: "/admin/donors", icon: Users },
    { name: "Donations", path: "/admin/payments", icon: DollarSign },
    { name: "Analytics", path: "/admin/reports", icon: BarChart3 },
    { name: "Stories", path: "/admin/blogs", icon: Rss },
  ],
  supportLinks: [
    { name: "Settings", path: "/admin/settings", icon: Settings },
    { name: "Help", path: "/admin/help", icon: HelpCircle },
  ],
};

// Sidebar Component
const Sidebar = ({ darkMode, location, onLogout, isOpen, setIsOpen }) => {
  const [isLargeScreen, setIsLargeScreen] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <>
      {/* Overlay for Mobile */}
      <AnimatePresence>
        {isOpen && !isLargeScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isLargeScreen || isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed top-0 left-0 h-full w-80 z-50 lg:translate-x-0 lg:static flex flex-col transition-all duration-500
        ${
          darkMode
            ? "bg-dark-lighter border-gray-800"
            : "bg-white border-gray-200 shadow-2xl"
        }
        border-r overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <Link
              to="/admin/admin-dashboard"
              className="flex items-center gap-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/25 group-hover:scale-110 transition-transform">
                <Heart size={24} />
              </div>
              <div>
                <h1
                  className={`text-lg font-bold ${
                    darkMode ? "text-white" : "text-dark"
                  }`}
                >
                  Sabo Foundation
                </h1>
                <p className="text-xs font-semibold text-primary-600">
                  Admin Portal
                </p>
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <X
                size={20}
                className={darkMode ? "text-gray-400" : "text-gray-600"}
              />
            </button>
          </div>

          {/* Status Card */}
          <div
            className={`p-4 rounded-xl border ${
              darkMode
                ? "bg-primary-950/20 border-primary-900/30"
                : "bg-primary-50 border-primary-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} className="text-primary-600" />
              <span className="text-xs font-bold text-primary-600">
                Foundation Status
              </span>
            </div>
            <p
              className={`text-xs leading-relaxed mb-3 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              All systems operational. 3 items need review.
            </p>
            <div className="flex items-center gap-2">
              <div
                className={`flex-1 h-2 rounded-full overflow-hidden ${
                  darkMode ? "bg-gray-800" : "bg-gray-200"
                }`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "78%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-primary-600 to-secondary-600"
                />
              </div>
              <span className="text-xs font-bold text-primary-600">78%</span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NAVIGATION_CONFIG.mainLinks.map((link, index) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={link.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-500/25"
                      : darkMode
                        ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-dark"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={20} />
                  <span className="font-semibold text-sm">{link.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Support Links */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="space-y-1">
            {NAVIGATION_CONFIG.supportLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-500/25"
                      : darkMode
                        ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-dark"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={20} />
                  <span className="font-semibold text-sm">{link.name}</span>
                </Link>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                darkMode
                  ? "text-red-400 hover:bg-red-950/30 hover:text-red-300"
                  : "text-red-600 hover:bg-red-50 hover:text-red-700"
              }`}
            >
              <LogOut size={20} />
              <span className="font-semibold text-sm">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

// Header Component
const Header = ({
  darkMode,
  setDarkMode,
  setIsOpen,
  adminName = "Admin User",
}) => {
  const location = useLocation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getQuickActionButton = () => {
    if (location.pathname.includes("/admin/campaigns")) {
      return {
        path: "/admin/campaigns/new",
        icon: Target,
        text: "New Project",
      };
    } else if (location.pathname.includes("/admin/events")) {
      return {
        path: "/admin/events/create",
        icon: Calendar,
        text: "New Event",
      };
    } else if (location.pathname.includes("/admin/blogs")) {
      return {
        path: "/admin/blogs/new",
        icon: Rss,
        text: "New Story",
      };
    }
    return {
      path: "/admin/campaigns/new",
      icon: Plus,
      text: "Quick Add",
    };
  };

  const quickAction = getQuickActionButton();
  const QuickIcon = quickAction.icon;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${
        darkMode
          ? "bg-dark-lighter border-gray-800"
          : "bg-white border-gray-200 shadow-lg"
      } border-b backdrop-blur-md px-6 lg:px-8 py-4 sticky top-0 z-30`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <button
          className={`lg:hidden p-3 rounded-xl transition-all ${
            darkMode
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => setIsOpen(true)}
        >
          <Menu
            size={24}
            className={darkMode ? "text-gray-300" : "text-gray-700"}
          />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-1 bg-primary-500 rounded-full" />
            <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
              Foundation Hub
            </span>
          </div>
          <h2
            className={`text-2xl lg:text-3xl font-bold ${
              darkMode ? "text-white" : "text-dark"
            }`}
          >
            {getGreeting()}, {adminName.split(" ")[0]}
          </h2>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              className={`pl-12 pr-6 py-3 rounded-xl w-60 lg:w-80 text-sm ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-200 text-dark placeholder-gray-400"
              } border focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all`}
            />
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-xl transition-all ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications */}
          <button
            className={`p-3 rounded-xl relative transition-all ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* Quick Action Button */}
          <Link
            to={quickAction.path}
            className="hidden sm:flex bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-xl font-semibold items-center gap-2 hover:shadow-lg hover:shadow-primary-500/25 transition-all text-sm active:scale-95"
          >
            <QuickIcon size={18} />
            <span>{quickAction.text}</span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

// Main Admin Layout Component
const AdminLayout = () => {
  const { darkMode, setDarkMode } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.adminAuth);
  const adminName = user?.fullName || "Admin User";

  const handleLogout = async () => {
    try {
      await dispatch(logoutAdmin()).unwrap();
      navigate("/admin-login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/admin-login", { replace: true });
    }
  };

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden ${
        darkMode ? "bg-dark text-white" : "bg-gray-50 text-dark"
      }`}
    >
      {/* Sidebar */}
      <Sidebar
        darkMode={darkMode}
        location={location}
        onLogout={handleLogout}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setIsOpen={setIsOpen}
          adminName={adminName}
        />

        {/* Page Content */}
        <main className="overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1800px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
