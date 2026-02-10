import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom"; // ✅ React Router
import { assets } from "../assets/assets";

// Mock logo - replace with your actual import
const logo = "https://via.placeholder.com/40";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Campaigns", path: "/campaigns" },
  { name: "Get Involved", path: "/get-involved" },
  { name: "Media", path: "/media" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState("/");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // ✅ Update active path on route change
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  // const handleNavClick = (path) => {
  //   navigate(path); // ✅ Navigate using React Router
  //   setIsMenuOpen(false);
  // };

  return (
    <>
        <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 sm:px-6 lg:px-20 py-4 transition-all duration-300 z-50
          ${isScrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-gradient from-emerald-50 to-white"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={assets.logo}
            alt="Sabo Foundation Logo"
            className="h-20 w-20 sm:h-15 sm:w-15 rounded-xl shadow-md object-cover"
          />
          <div className="flex flex-col">
            <NavLink
              to="/"
              className="font-bold text-base sm:text-lg text-gray-900 hover:text-emerald-600 transition-colors leading-tight text-left"
            >
              Sabo Ibadan Youth Charity Foundation
            </NavLink>
            <span className="text-xs text-gray-500">Empowering Communities</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <NavLink
              key={i}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-semibold relative group transition-colors duration-300 py-2 ${
                  isActive ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600"
                }`
              }
            >
              {link.name}
              <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-300 group-hover:w-full" />
            </NavLink>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center gap-3">
          <NavLink
            to="/blogs"
            className={({ isActive }) =>
              `px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                isActive
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-gray-700 hover:text-emerald-600 hover:bg-emerald-50"
              }`
            }
          >
            Blogs
          </NavLink>
          <NavLink
            to="/login"
            className="px-5 py-2 rounded-full border-2 border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white transition-all duration-300 text-sm font-semibold"
          >
            Login
          </NavLink>
          <NavLink
            to="/make-donation"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-300 text-sm font-semibold shadow-md"
          >
            Donate Now
          </NavLink>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden z-50 p-2 rounded-lg hover:bg-emerald-50 transition-colors"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <svg
            className="h-6 w-6 text-gray-900"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-screen w-80 bg-white shadow-2xl flex flex-col transition-transform duration-500 z-50 lg:hidden
            ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
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
              <svg
                className="h-6 w-6 text-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-2">
              {navLinks.map((link, i) => (
                <NavLink
                  key={i}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `w-full block text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
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
                  `w-full block text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                Blogs
              </NavLink>
            </div>

            <div className="mt-8 space-y-3 space-x-6">
              <NavLink
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full px-5 py-3 rounded-lg border-2 border-amber-500 text-amber-600 font-semibold hover:bg-amber-50 transition-colors"
              >
                Login
              </NavLink>
                <NavLink
                  to="/make-donation"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-5 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-lg"
                >
                  Donate Now
                </NavLink>
            </div>
          </div>
        </div>
      </nav>


      {/* Spacer to prevent content being hidden behind navbar */}
      <div className="h-20" />
    </>
  );
};

export default Navbar;
