// layout/UserLayout.jsx — Clerk-style redesign (Aligned with AdminLayout)
import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logoutUser, logout } from "../features/auth/authSlice";
import { useTheme } from "../context/ThemeContext";
import {
  LayoutDashboard,
  Heart,
  Target,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  Bell,
  Search
} from "lucide-react";

// ── Navigation Configuration ──────────────────────────────────────────────────
const NAVIGATION_CONFIG = {
  mainLinks: [
    { name: "Dashboard",     path: "/user/dashboard",    icon: LayoutDashboard },
    { name: "Donations",     path: "/user/my-donations", icon: Heart },
    { name: "My Campaigns",  path: "/user/my-campaigns", icon: Target },
    { name: "Events",        path: "/user/events",       icon: Calendar },
  ],
  supportLinks: [
    { name: "Settings", path: "/user/settings", icon: Settings },
    { name: "Help",     path: "/user/help",     icon: HelpCircle },
  ],
};

const PAGE_TITLES = {
  "/user/dashboard":    "Dashboard",
  "/user/my-donations": "Donations",
  "/user/my-campaigns": "My Campaigns",
  "/user/events":       "Events",
  "/user/settings":     "Settings",
  "/user/help":         "Help Center",
};

// ── Sidebar Component ─────────────────────────────────────────────────────────
const Sidebar = ({ darkMode, setDarkMode, location, onLogout, isOpen, setIsOpen, user }) => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const userName = user?.fullName || "Member";
  const initials = userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isLargeScreen || isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed top-0 left-0 h-full w-64 z-50 lg:translate-x-0 lg:static flex flex-col ${
          darkMode
            ? "bg-[#111] lg:bg-dark-lighter border-gray-800/80"
            : "bg-white border-gray-200/80"
        } border-r`}
      >
        {/* Sidebar Header — Logo */}
        <div className={`px-5 py-5 border-b ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
          <div className="flex justify-between items-center">
            <Link to="/user/dashboard" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-sm">
                <Heart size={18} fill="white" />
              </div>
              <div>
                <h1 className={`text-sm font-bold leading-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Sabo Foundation
                </h1>
                <p className="text-[10px] font-medium text-gray-400">
                  User Portal
                </p>
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X size={18} className={darkMode ? "text-gray-400" : "text-gray-500"} />
            </button>
          </div>
        </div>

        {/* User Profile Header (Optional: showing user briefly at top of nav) */}
        <div className={`p-4 border-b ${darkMode ? "border-gray-800/60" : "border-gray-100"} flex items-center gap-3`}>
          <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 text-xs font-bold overflow-hidden shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={userName} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
              {userName}
            </p>
            <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className={`px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            Menu
          </p>
          <div className="space-y-0.5">
            {NAVIGATION_CONFIG.mainLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || (link.path !== "/user/dashboard" && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all relative ${
                    isActive
                      ? darkMode
                        ? "bg-gray-800/80 text-white"
                        : "bg-emerald-50 text-emerald-700"
                      : darkMode
                      ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeUserNav"
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full ${darkMode ? "bg-emerald-400" : "bg-emerald-600"}`}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon size={18} className={isActive ? "" : "opacity-70"} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Support Links + Footer */}
        <div className={`px-3 py-3 border-t ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
          <p className={`px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            Support
          </p>
          <div className="space-y-0.5">
            {NAVIGATION_CONFIG.supportLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all relative ${
                    isActive
                      ? darkMode
                        ? "bg-gray-800/80 text-white"
                        : "bg-emerald-50 text-emerald-700"
                      : darkMode
                      ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeUserNavSupport"
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full ${darkMode ? "bg-emerald-400" : "bg-emerald-600"}`}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon size={18} className={isActive ? "" : "opacity-70"} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className={`mt-3 pt-3 border-t ${darkMode ? "border-gray-800/40" : "border-gray-100"} flex items-center justify-between`}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all ${
                darkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={onLogout}
              className={`p-2 rounded-lg transition-all ${
                darkMode ? "text-gray-400 hover:text-red-400 hover:bg-red-950/30" : "text-gray-500 hover:text-red-600 hover:bg-red-50"
              }`}
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

// ── Header Component ──────────────────────────────────────────────────────────
const Header = ({ darkMode, setIsOpen, user }) => {
  const location = useLocation();

  const getPageTitle = () => {
    if (PAGE_TITLES[location.pathname]) return PAGE_TITLES[location.pathname];
    const segments = location.pathname.split("/").filter(Boolean);
    if (segments.length >= 2) {
      const base = `/${segments[0]}/${segments[1]}`;
      if (PAGE_TITLES[base]) return PAGE_TITLES[base];
    }
    return "Dashboard";
  };

  const getBreadcrumb = () => {
    const segments = location.pathname.split("/").filter(Boolean);
    if (segments.length <= 2) return null;
    const parent = `/${segments[0]}/${segments[1]}`;
    return PAGE_TITLES[parent] || segments[1];
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header
      className={`${
        darkMode
          ? "bg-[#111]/95 lg:bg-dark-lighter/95 border-gray-800/60"
          : "bg-white/95 border-gray-200/60"
      } border-b backdrop-blur-md px-5 lg:px-6 py-3 sticky top-0 z-30`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile menu + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            className={`lg:hidden p-2 rounded-lg transition-all ${
              darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
            }`}
            onClick={() => setIsOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            {breadcrumb && (
              <>
                <span className={`text-sm hidden sm:inline-block ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  {breadcrumb}
                </span>
                <ChevronRight size={14} className={`hidden sm:inline-block ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
              </>
            )}
            <h1 className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Search Placeholder */}
          <div className="relative hidden md:block">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
              size={15}
            />
            <input
              type="text"
              placeholder="Search..."
              className={`pl-9 pr-4 py-1.5 rounded-lg w-48 text-sm ${
                darkMode
                  ? "bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-200/80 text-gray-900 placeholder-gray-400"
              } border focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all`}
            />
          </div>

          {/* Avatar (Mobile primarily) */}
          <Link to="/user/settings" className="lg:hidden w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[11px] font-bold overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              (user?.fullName || "U").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

// ── Main Layout ───────────────────────────────────────────────────────────────
const UserLayout = () => {
  const { darkMode, setDarkMode } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(logoutUser());
    navigate("/");
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden ${
        darkMode ? "bg-[#0a0a0a] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <Sidebar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        location={location}
        onLogout={handleLogout}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        user={user}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          darkMode={darkMode}
          setIsOpen={setIsOpen}
          user={user}
        />
        
        {/* Page Content */}
        <main className="overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
