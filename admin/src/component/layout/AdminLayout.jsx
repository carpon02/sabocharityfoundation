// layouts/AdminLayout.jsx - Sabo Ibadan Youth Charity Foundation — Clerk-Style UI
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
  LogOut,
  Menu,
  X,
  Rss,
  Calendar,
  HandHeart,
  CheckCheck,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { logoutAdmin } from "../../features/auth/adminAuthSlice";
import apiClient from "../../config/apiConfig";

// Navigation Configuration
const NAVIGATION_CONFIG = {
  mainLinks: [
    {
      name: "Dashboard",
      path: "/admin/admin-dashboard",
      icon: LayoutDashboard,
      roles: ["super_admin", "finance_admin", "content_editor"],
    },
    {
      name: "Campaigns",
      path: "/admin/campaigns",
      icon: Target,
      roles: ["super_admin", "content_editor"],
    },
    {
      name: "Events",
      path: "/admin/events",
      icon: Calendar,
      roles: ["super_admin", "content_editor"],
    },
    {
      name: "Donors",
      path: "/admin/donors",
      icon: Users,
      roles: ["super_admin", "finance_admin"],
    },
    {
      name: "Donations",
      path: "/admin/payments",
      icon: DollarSign,
      roles: ["super_admin", "finance_admin"],
    },
    {
      name: "Analytics",
      path: "/admin/reports",
      icon: BarChart3,
      roles: ["super_admin", "finance_admin"],
    },
    {
      name: "Volunteers",
      path: "/admin/volunteers",
      icon: HandHeart,
      roles: ["super_admin"],
    },
    {
      name: "Blog",
      path: "/admin/blogs",
      icon: Rss,
      roles: ["super_admin", "content_editor"],
    },
  ],
  supportLinks: [
    { name: "Settings", path: "/admin/settings", icon: Settings },
    { name: "Help", path: "/admin/help", icon: HelpCircle },
  ],
};

// Page title mapping for breadcrumb header
const PAGE_TITLES = {
  "/admin/admin-dashboard": "Dashboard",
  "/admin/campaigns": "Campaigns",
  "/admin/events": "Events",
  "/admin/events/create": "Create Event",
  "/admin/donors": "Donors",
  "/admin/payments": "Donations",
  "/admin/reports": "Analytics",
  "/admin/volunteers": "Volunteers",
  "/admin/blogs": "Blog",
  "/admin/settings": "Settings",
  "/admin/help": "Help Center",
};

// Sidebar Component — Clerk-style: slim, clean, minimal
const Sidebar = ({ darkMode, setDarkMode, location, onLogout, isOpen, setIsOpen, user }) => {
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isLargeScreen || isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed top-0 left-0 h-full w-64 z-50 lg:translate-x-0 lg:static flex flex-col
        ${
          darkMode
            ? "bg-dark-lighter border-gray-800/80"
            : "bg-white border-gray-200/80"
        }
        border-r`}
      >
        {/* Sidebar Header — Logo */}
        <div className={`px-5 py-5 border-b ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
          <div className="flex justify-between items-center">
            <Link
              to="/admin/admin-dashboard"
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white shadow-sm">
                <Heart size={18} />
              </div>
              <div>
                <h1
                  className={`text-sm font-bold leading-tight ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Sabo Foundation
                </h1>
                <p className="text-[10px] font-medium text-gray-400">
                  Admin Portal
                </p>
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X
                size={18}
                className={darkMode ? "text-gray-400" : "text-gray-500"}
              />
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {/* Section Label */}
          <p className={`px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}>
            Main
          </p>

          <div className="space-y-0.5">
            {NAVIGATION_CONFIG.mainLinks
              .filter((link) => {
                const adminRole = user?.adminRole;
                return (
                  Boolean(adminRole) &&
                  (link.roles.includes(adminRole) ||
                    adminRole === "super_admin")
                );
              })
              .map((link) => {
                const Icon = link.icon;
                const isActive =
                  location.pathname === link.path ||
                  (link.path !== "/admin/admin-dashboard" &&
                    location.pathname.startsWith(link.path));

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all relative ${
                      isActive
                        ? darkMode
                          ? "bg-gray-800/80 text-white"
                          : "bg-primary-50 text-primary-700"
                        : darkMode
                        ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full ${
                          darkMode ? "bg-primary-400" : "bg-primary-600"
                        }`}
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
          {/* Section Label */}
          <p className={`px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest ${
            darkMode ? "text-gray-500" : "text-gray-400"
          }`}>
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
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all relative ${
                    isActive
                      ? darkMode
                        ? "bg-gray-800/80 text-white"
                        : "bg-primary-50 text-primary-700"
                      : darkMode
                      ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavSupport"
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full ${
                        darkMode ? "bg-primary-400" : "bg-primary-600"
                      }`}
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
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all ${
                darkMode
                  ? "text-gray-400 hover:text-white hover:bg-gray-800"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
              aria-label="Toggle dark mode"
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              className={`p-2 rounded-lg transition-all ${
                darkMode
                  ? "text-gray-400 hover:text-red-400 hover:bg-red-950/30"
                  : "text-gray-500 hover:text-red-600 hover:bg-red-50"
              }`}
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

// Notification Bell Component
const NotificationBell = ({ darkMode }) => {
  const [notifications, setNotifications] = React.useState([]);
  const [showDropdown, setShowDropdown]   = React.useState(false);
  const [soundEnabled, setSoundEnabled]   = React.useState(() => {
    try { return localStorage.getItem("adminSoundEnabled") !== "false"; }
    catch { return true; }
  });
  const dropdownRef   = React.useRef(null);
  const prevCountRef  = React.useRef(null); // null = first load (don't alert)
  const navigate      = useNavigate();

  // ── Web Audio chime (no external file needed) ─────────────────────────────
  const playChime = React.useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playTone = (freq, startTime, duration, gain = 0.3) => {
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        env.gain.setValueAtTime(0, startTime);
        env.gain.linearRampToValueAtTime(gain, startTime + 0.01);
        env.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        osc.connect(env);
        env.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const t = ctx.currentTime;
      playTone(880, t,        0.25, 0.25); // A5
      playTone(1108, t + 0.15, 0.25, 0.2); // C#6
      playTone(1320, t + 0.30, 0.35, 0.18); // E6
      setTimeout(() => ctx.close(), 1200);
    } catch (_) { /* AudioContext unavailable (e.g. server-side) */ }
  }, []);

  // ── Vibrate (mobile) ──────────────────────────────────────────────────────
  const vibrate = React.useCallback(() => {
    if ("vibrate" in navigator) navigator.vibrate([120, 60, 80]);
  }, []);

  // ── Browser Push Notification ─────────────────────────────────────────────
  const pushBrowserNotif = React.useCallback((notif) => {
    if (!("Notification" in window)) return;
    const show = () => {
      try {
        new Notification("Sabo Foundation — New Alert", {
          body: notif.message || "You have a new notification",
          icon: "/favicon.ico",
          tag:  "admin-notif",
        });
      } catch (_) {}
    };
    if (Notification.permission === "granted") {
      show();
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((p) => { if (p === "granted") show(); });
    }
  }, []);

  // ── Alert helper — fires all three signals ────────────────────────────────
  const alertAdmin = React.useCallback((newNotifs) => {
    if (soundEnabled) { playChime(); vibrate(); }
    if (newNotifs.length > 0) pushBrowserNotif(newNotifs[0]);
  }, [soundEnabled, playChime, vibrate, pushBrowserNotif]);

  // ── Fetch + diff ──────────────────────────────────────────────────────────
  const fetchNotifications = React.useCallback(async () => {
    try {
      const res = await apiClient.get("/notifications");
      if (!res.data.success) return;
      const fresh     = res.data.data;
      const unread    = fresh.filter((n) => !n.isRead);
      const prevCount = prevCountRef.current;

      setNotifications(fresh);

      // First load: just set baseline, don't alert
      if (prevCount === null) {
        prevCountRef.current = unread.length;
        return;
      }

      // Subsequent polls: alert if unread count grew
      if (unread.length > prevCount) {
        const brandNew = unread.slice(0, unread.length - prevCount);
        alertAdmin(brandNew);
        prevCountRef.current = unread.length;
      } else {
        prevCountRef.current = unread.length;
      }
    } catch (err) {
      console.error(err);
    }
  }, [alertAdmin]);

  React.useEffect(() => {
    fetchNotifications();
    // Poll every 30 s
    const interval = setInterval(fetchNotifications, 30_000);
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fetchNotifications]);

  // Persist sound preference
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try { localStorage.setItem("adminSoundEnabled", String(next)); } catch (_) {}
      return next;
    });
  };

  const markAsRead = async (id) => {
    try { await apiClient.patch(`/notifications/${id}/read`); fetchNotifications(); }
    catch (err) { console.error(err); }
  };

  const markAllAsRead = async () => {
    try { await apiClient.patch(`/notifications/read-all`); fetchNotifications(); }
    catch (err) { console.error(err); }
  };

  const handleNotificationClick = (notif) => {
    markAsRead(notif._id);
    setShowDropdown(false);
    if (notif.link) navigate(notif.link);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`p-2 rounded-lg relative transition-all ${
          darkMode
            ? "text-gray-400 hover:text-white hover:bg-gray-800"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
        }`}
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        )}
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-xl shadow-2xl border overflow-hidden z-50 ${
              darkMode
                ? "bg-dark-lighter border-gray-800"
                : "bg-white border-gray-200"
            }`}
          >
            <div
              className={`px-4 py-3 border-b flex justify-between items-center gap-2 ${
                darkMode ? "border-gray-800" : "border-gray-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <h3
                  className={`text-sm font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* Sound / Vibration toggle */}
                <button
                  onClick={toggleSound}
                  title={soundEnabled ? "Mute notification sounds" : "Unmute notification sounds"}
                  className={`p-1.5 rounded-lg transition-all ${
                    soundEnabled
                      ? darkMode ? "text-primary-400 hover:bg-gray-800" : "text-primary-600 hover:bg-gray-100"
                      : darkMode ? "text-gray-600 hover:bg-gray-800" : "text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                </button>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
                  >
                    <CheckCheck size={13} /> Mark all read
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`px-4 py-3 border-b cursor-pointer transition-colors ${
                      !notif.isRead
                        ? darkMode
                          ? "bg-primary-950/10"
                          : "bg-primary-50/50"
                        : ""
                    } ${
                      darkMode
                        ? "border-gray-800/50 hover:bg-gray-800/50"
                        : "border-gray-50 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-0.5">
                      <h4
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />
                      )}
                    </div>
                    <p
                      className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {notif.message}
                    </p>
                    <span
                      className={`text-[10px] mt-1.5 block ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Header Component — Clerk-style: minimal breadcrumb, clean actions
const Header = ({
  darkMode,
  setIsOpen,
}) => {
  const location = useLocation();

  // Get page title from path
  const getPageTitle = () => {
    if (PAGE_TITLES[location.pathname]) {
      return PAGE_TITLES[location.pathname];
    }
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length >= 2) {
      const basePath = `/${pathSegments[0]}/${pathSegments[1]}`;
      if (PAGE_TITLES[basePath]) {
        return PAGE_TITLES[basePath];
      }
    }
    return "Dashboard";
  };

  // Get breadcrumb segments
  const getBreadcrumb = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length <= 2) return null;
    const parentPath = `/${pathSegments[0]}/${pathSegments[1]}`;
    return PAGE_TITLES[parentPath] || pathSegments[1];
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header
      className={`${
        darkMode
          ? "bg-dark-lighter/95 border-gray-800/60"
          : "bg-white/95 border-gray-200/60"
      } border-b backdrop-blur-md px-5 lg:px-6 py-3 sticky top-0 z-30`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile menu + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            className={`lg:hidden p-2 rounded-lg transition-all ${
              darkMode
                ? "hover:bg-gray-800 text-gray-400"
                : "hover:bg-gray-100 text-gray-500"
            }`}
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2">
            {breadcrumb && (
              <>
                <span
                  className={`text-sm ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {breadcrumb}
                </span>
                <ChevronRight
                  size={14}
                  className={darkMode ? "text-gray-600" : "text-gray-300"}
                />
              </>
            )}
            <h1
              className={`text-sm font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
              size={15}
            />
            <input
              type="text"
              placeholder="Search..."
              className={`pl-9 pr-4 py-1.5 rounded-lg w-48 lg:w-56 text-sm ${
                darkMode
                  ? "bg-gray-800/60 border-gray-700/50 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-200/80 text-gray-900 placeholder-gray-400"
              } border focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all`}
            />
          </div>

          <NotificationBell darkMode={darkMode} />
        </div>
      </div>
    </header>
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
        darkMode ? "bg-dark text-white" : "bg-gray-50 text-gray-900"
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
        {/* Header */}
        <Header
          darkMode={darkMode}
          setIsOpen={setIsOpen}
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

export default AdminLayout;
