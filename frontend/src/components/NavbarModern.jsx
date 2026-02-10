import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";
import { assets } from "../assets/assets";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Campaigns", path: "/campaigns" },
  { name: "Get Involved", path: "/get-involved" },
  { name: "Media", path: "/media" },
  { name: "Contact", path: "/contact" },
];

/**
 * Modern, Sleek Navbar Component
 * Professional design with smooth animations
 */
const NavbarModern = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen || isUserMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen, isUserMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <NavLink
              to="/"
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <img
                  src={assets.logo}
                  alt="Sabo Foundation Logo"
                  className="h-14 w-14 rounded-xl shadow-lg object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight">
                  Sabo Ibadan Youth
                  <br />
                  <span className="text-sm text-gray-600">Charity Foundation</span>
                </h1>
              </div>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "text-emerald-600 bg-emerald-50"
                        : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50"
                    }`
                  }
                >
                  {link.name}
                  {location.pathname === link.path && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full" />
                  )}
                </NavLink>
              ))}
            </div>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center gap-3">
              <NavLink
                to="/blogs"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50"
                  }`
                }
              >
                Blogs
              </NavLink>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      {user.fullName?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-scaleIn">
                        <NavLink
                          to="/user/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Dashboard
                        </NavLink>
                        <NavLink
                          to="/user/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Settings
                        </NavLink>
                        <div className="border-t border-gray-100 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="px-5 py-2.5 rounded-lg border-2 border-amber-500 text-amber-600 hover:bg-amber-50 transition-all duration-300 text-sm font-semibold"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/make-donation"
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm font-semibold shadow-md"
                  >
                    Donate Now
                  </NavLink>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-emerald-50 transition-colors"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-gray-900" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl flex flex-col transition-transform duration-500 z-50 lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img src={assets.logo} alt="logo" className="h-10 w-10 rounded-lg" />
            <span className="font-bold text-gray-900">Menu</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg font-semibold transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <NavLink
            to="/blogs"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg font-semibold transition-colors ${
                isActive
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            Blogs
          </NavLink>

          <div className="pt-6 space-y-3 border-t border-gray-200 mt-6">
            {user ? (
              <>
                <NavLink
                  to="/user/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg bg-emerald-50 text-emerald-700 font-semibold"
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-lg border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg border-2 border-amber-500 text-amber-600 font-semibold text-center hover:bg-amber-50 transition-colors"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/make-donation"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-center shadow-lg"
                >
                  Donate Now
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
};

export default NavbarModern;




