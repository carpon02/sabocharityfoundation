import React, { useState, useEffect, useRef } from "react";
import { useLocation, NavLink, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, logout } from "../features/auth/authSlice";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  Heart,
  Settings,
  LayoutDashboard,
  Target,
  History,
  ExternalLink,
} from "lucide-react";
import { assets } from "../assets/assets";

// ── Nav link sets ─────────────────────────────────────────────────────────────
const PUBLIC_NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Campaigns", path: "/campaigns" },
  { name: "Contact", path: "/contact" },
];

// Quick links shown in the logged-in avatar dropdown
const USER_DROPDOWN_LINKS = [
  { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
  { name: "My Donations", path: "/user/my-donations", icon: History },
  { name: "My Campaigns", path: "/user/my-campaigns", icon: Target },
  { name: "Settings", path: "/user/settings", icon: Settings },
];

// Extra links shown ONLY in the mobile menu (keep footer-only items accessible)
const MOBILE_EXTRA_LINKS = [
  { name: "Get Involved", path: "/get-involved" },
  { name: "Media", path: "/media" },
  { name: "Blog", path: "/blogs" },
];

// ── NavbarModern ──────────────────────────────────────────────────────────────
const NavbarModern = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    // Synchronously clear Redux state — instant redirect via ProtectedRoute
    dispatch(logout());
    // Fire server logout in background (non-blocking)
    dispatch(logoutUser());
  };

  const firstName = user?.fullName?.split(" ")[0] || "Account";

  return (
    <>
      {/* ── Main Navbar ───────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/96 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2.5 group shrink-0">
              <img
                src={assets.logo}
                alt="Sabo Foundation"
                className="h-10 w-10 rounded-lg object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="hidden sm:block leading-tight">
                <span className="block text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  Sabo Ibadan Youth
                </span>
                <span className="block text-xs text-gray-500 font-medium">
                  Charity Foundation
                </span>
              </div>
            </NavLink>

            {/* ── Desktop Nav Links ───────────────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-0.5">
              {PUBLIC_NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/"}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-emerald-700 bg-emerald-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* ── Desktop Right Actions ───────────────────────────────────── */}
            <div className="hidden lg:flex items-center gap-2">

              {user ? (
                /* ── Authenticated: Dashboard shortcut + avatar dropdown ── */
                <>
                  <Link
                    to="/user/dashboard"
                    className="px-3.5 py-2 rounded-lg text-[13px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Link>

                  {/* Avatar dropdown */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen((p) => !p)}
                      aria-label="User menu"
                      aria-expanded={isUserMenuOpen}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${user.fullName || "User"}&background=059669&color=fff&size=64`
                        }
                        alt={firstName}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-200"
                      />
                      <span className="text-[13px] font-medium text-gray-700 max-w-[90px] truncate">
                        {firstName}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                          isUserMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl shadow-lg border border-gray-200/80 py-2 z-50 overflow-hidden">
                        {/* User identity */}
                        <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                            Signed in as
                          </p>
                          <p className="text-sm font-semibold text-gray-900 truncate mt-0.5">
                            {user.fullName || user.email}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                        </div>

                        {/* Quick links */}
                        {USER_DROPDOWN_LINKS.map(({ name, path, icon: Icon }) => (
                          <NavLink
                            key={path}
                            to={path}
                            onClick={() => setIsUserMenuOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-2.5 px-4 py-2.5 text-[13px] transition-colors ${
                                isActive
                                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`
                            }
                          >
                            <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                            {name}
                          </NavLink>
                        ))}

                        {/* Sign out */}
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4 shrink-0" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* ── Guest: Sign In + Donate ───────────────────────────── */
                <>
                  <NavLink
                    to="/login"
                    className="px-3.5 py-2 rounded-lg text-[13px] font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </NavLink>
                  <Link
                    to="/make-donation"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-[13px] font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    Donate
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 -mr-1 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Overlay ────────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* ── Mobile Slide-out Menu ──────────────────────────────────────────── */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] bg-white shadow-2xl z-50 lg:hidden flex flex-col transition-transform duration-300 ease-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <img src={assets.logo} alt="Logo" className="h-8 w-8 rounded-lg object-cover" />
            <span className="text-sm font-bold text-gray-900">Sabo Foundation</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Logged-in: user identity card ─────────────────────────── */}
          {user && (
            <div className="mx-4 mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${user.fullName || "User"}&background=059669&color=fff&size=64`
                }
                alt={firstName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-300 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{user.fullName}</p>
                <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* ── Primary nav links ──────────────────────────────────────── */}
          <div className="px-4 pt-4 pb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">
              Navigation
            </p>
            <div className="space-y-0.5">
              {PUBLIC_NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              {/* Extra links — only visible on mobile */}
              {MOBILE_EXTRA_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`
                  }
                >
                  {link.name}
                  <ExternalLink className="w-3.5 h-3.5 opacity-40" />
                </NavLink>
              ))}
            </div>
          </div>

          {/* ── Auth section ───────────────────────────────────────────── */}
          <div className="px-4 pt-3 pb-4 border-t border-gray-100 mt-2">
            {user ? (
              <>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">
                  My Account
                </p>
                <div className="space-y-0.5">
                  {USER_DROPDOWN_LINKS.map(({ name, path, icon: Icon }) => (
                    <NavLink
                      key={path}
                      to={path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                      {name}
                    </NavLink>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">
                  Join Us
                </p>
                <div className="space-y-2">
                  <NavLink
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 text-center hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </NavLink>
                  <Link
                    to="/make-donation"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    Donate Now
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Mobile footer — sign out ─────────────────────────────────── */}
        {user && (
          <div className="px-4 py-4 border-t border-gray-100 shrink-0">
            <button
              onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Navbar height spacer */}
      <div className="h-16" />
    </>
  );
};

export default NavbarModern;
