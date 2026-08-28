// layouts/UserLayout.jsx - Sabo Ibadan Youth Charity Foundation
import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Settings,
  HelpCircle,
  Heart,
  Target,
  LayoutDashboard,
  CalendarDays,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

// Navigation Configuration - ONLY ONE DECLARATION
const NAVIGATION_CONFIG = {
  mainLinks: [
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "My Donations",
      path: "/user/my-donations",
      icon: Heart,
      badge: null,
    },
    {
      name: "Events",
      path: "/user/events",
      icon: CalendarDays,
      badge: null,
    },
    {
      name: "My Campaigns",
      path: "/user/my-campaigns",
      icon: Target,
      badge: null,
    },
  ],
  secondaryLinks: [
    {
      name: "Settings",
      path: "/user/settings",
      icon: Settings,
    },
    {
      name: "Help & Support",
      path: "/user/help",
      icon: HelpCircle,
    },
  ],
};

// Mobile Sidebar Component
const MobileSidebar = ({
  isOpen,
  setIsOpen,
  darkMode,
  location,
  onLogout,
  userName,
  user,
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
        />
        <motion.aside
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className={`fixed top-0 left-0 h-full w-[280px] z-50 flex flex-col
            ${darkMode ? "bg-dark-lighter" : "bg-white"}
            border-r ${darkMode ? "border-gray-800" : "border-gray-200"}
          `}
        >
          {/* Mobile Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center">
                  <Heart size={20} className="text-white fill-white" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-dark dark:text-white">
                    Sabo Ibadan
                  </h1>
                  <p className="text-[10px] text-gray-500 font-medium">
                    Youth Foundation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={18} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="w-10 h-10 rounded-full bg-gradient-premium overflow-hidden">
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${userName}&background=059669&color=fff`
                  }
                  alt={`${userName}'s profile`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-dark dark:text-white truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-500">Member</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1 mb-6">
              {NAVIGATION_CONFIG.mainLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group
                      ${
                        isActive
                          ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                  >
                    <Icon size={20} className={isActive ? "text-white" : ""} />
                    <span className="text-sm font-semibold flex-1">
                      {link.name}
                    </span>
                    {link.badge && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-primary-500 text-white">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-1">
              {NAVIGATION_CONFIG.secondaryLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                      ${
                        isActive
                          ? "bg-gray-100 dark:bg-gray-800 text-dark dark:text-white"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-semibold">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
            >
              <LogOut size={20} />
              <span className="text-sm font-semibold">Logout</span>
            </button>
          </div>
        </motion.aside>
      </>
    )}
  </AnimatePresence>
);

// Desktop Sidebar Component
const DesktopSidebar = ({
  darkMode,
  location,
  onLogout,
  userName,
  userStats,
  user,
}) => {
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(1)}K`;
    }
    return `₦${amount.toFixed(0)}`;
  };

  return (
    <aside
      className={`hidden lg:flex flex-col w-[280px] h-screen sticky top-0 border-r transition-colors
        ${darkMode ? "bg-dark-lighter border-gray-800" : "bg-white border-gray-200"}
      `}
    >
      {/* Logo & Branding */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <Link
          to="/user/dashboard"
          className="flex items-center gap-3 group mb-6"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-premium flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-primary-500/20">
            <Heart size={22} className="text-white fill-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-dark dark:text-white leading-tight">
              Sabo Ibadan
            </h1>
            <p className="text-[11px] text-gray-500 font-medium leading-tight">
              Youth Foundation
            </p>
          </div>
        </Link>

        {/* Impact Stats Card */}
        <div
          className={`p-4 rounded-xl border ${darkMode ? "bg-primary-950/20 border-primary-900/30" : "bg-primary-50 border-primary-100"}`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Heart size={16} className="text-primary-600 fill-primary-600" />
            <span className="text-xs font-bold text-primary-700 dark:text-primary-400">
              Your Impact
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Donated
              </p>
              <p className="text-xl font-bold text-dark dark:text-white">
                {formatCurrency(userStats.totalDonated)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Campaigns
                </p>
                <p className="text-sm font-bold text-dark dark:text-white">
                  {userStats.campaignsSupported}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Events
                </p>
                <p className="text-sm font-bold text-dark dark:text-white">
                  {userStats.eventsAttended}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1 mb-6">
          {NAVIGATION_CONFIG.mainLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group
                  ${
                    isActive
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                <Icon size={20} />
                <span className="text-sm font-semibold flex-1">
                  {link.name}
                </span>
                {link.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-primary-500 text-white"
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <ChevronRight size={16} className="text-white/60" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-1">
          {NAVIGATION_CONFIG.secondaryLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${
                    isActive
                      ? "bg-gray-100 dark:bg-gray-800 text-dark dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                <Icon size={20} />
                <span className="text-sm font-semibold">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <div className="w-10 h-10 rounded-full bg-gradient-premium overflow-hidden">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${userName}&background=059669&color=fff`
              }
              alt={`${userName}'s profile`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-dark dark:text-white truncate">
              {userName}
            </p>
            <p className="text-xs text-gray-500">Member</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
        >
          <LogOut size={20} />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
};

// Header Component
const Header = ({ darkMode, setDarkMode, userName, user, setIsOpen }) => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors
        ${darkMode ? "bg-dark/80 border-gray-800" : "bg-white/80 border-gray-200"}
      `}
    >
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open mobile menu"
            className="lg:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:scale-95 active:scale-90 transition-transform"
          >
            <Menu size={20} className="text-gray-700 dark:text-gray-300" />
          </button>

          <div>
            <h2 className="text-lg lg:text-xl font-bold text-dark dark:text-white">
              Welcome Back
            </h2>
            <p className="text-xs text-gray-500 font-medium hidden sm:block">
              Track your impact and manage donations
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Search - Desktop Only */}
          <div className="hidden xl:block relative">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none
                ${searchFocused ? "text-primary-600" : "text-gray-400"}
              `}
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`pl-11 pr-4 py-2.5 w-[280px] rounded-xl text-sm font-medium outline-none border-2 transition-all
                ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white focus:border-primary-500"
                    : "bg-gray-50 border-gray-200 text-gray-900 focus:border-primary-500 focus:bg-white"
                }
                focus:w-[360px]
              `}
            />
          </div>

          {/* Notification Button */}
          {/* <button
            aria-label="Show notifications"
            className={`relative p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95
              ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}
            `}
          >
            <Bell
              size={20}
              className={darkMode ? "text-gray-300" : "text-gray-700"}
            />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-white dark:border-dark animate-pulse" />
          </button> */}

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
            className={`p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95
              ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}
            `}
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-gray-700" />
            )}
          </button>

          {/* User Avatar - Desktop Only */}
          <div className="hidden lg:flex items-center gap-3 pl-3 ml-2 border-l border-gray-200 dark:border-gray-800">
            <div className="text-right">
              <p className="text-sm font-semibold text-dark dark:text-white">
                {userName}
              </p>
              <p className="text-xs text-gray-500">Member</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-premium overflow-hidden cursor-pointer hover:ring-4 hover:ring-primary-500/20 transition-all">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${userName}&background=059669&color=fff`
                }
                alt={`${userName}'s profile`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Main Layout Component
const UserLayout = () => {
  const { darkMode, setDarkMode } = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // User stats (will be populated from Redux or API)
  const [userStats, setUserStats] = useState({
    totalDonated: 0,
    campaignsSupported: 0,
    eventsAttended: 0,
  });

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location]);

  // Update user stats when user data changes
  useEffect(() => {
    if (user) {
      setUserStats({
        totalDonated: user.totalDonated || 0,
        campaignsSupported: user.campaignsSupported || 0,
        eventsAttended: user.eventsAttended || 0,
      });
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const userName = user?.fullName || "Member";

  return (
    <div
      className={`flex min-h-screen w-full transition-colors selection:bg-primary-500/30
        ${darkMode ? "bg-dark text-white" : "bg-gray-50 text-dark"}
      `}
    >
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary-500/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-secondary-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
        darkMode={darkMode}
        location={location}
        onLogout={handleLogout}
        userName={userName}
        userStats={userStats}
        user={user}
      />

      {/* Desktop Sidebar */}
      <DesktopSidebar
        darkMode={darkMode}
        location={location}
        onLogout={handleLogout}
        userName={userName}
        userStats={userStats}
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          userName={userName}
          user={user}
          setIsOpen={setIsMobileSidebarOpen}
        />

        <main className="flex-1 overflow-auto">
          <div className="max-w-[1600px] mx-auto p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
