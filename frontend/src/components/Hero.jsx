import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom"; // ✅ use NavLink
import { assets } from "../assets/assets";

// Mock assets - replace with your actual imports

const heroImg =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=600&fit=crop";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Campaigns", path: "/campaigns" },
  { name: "Get Involved", path: "/get-involved" },
  { name: "Media", path: "/media" },
  { name: "Contact", path: "/contact" },
];

const Hero = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  return (
    <section className="relative bg-gradient-to-b from-emerald-50 to-white overflow-hidden min-h-screen">
      {/* --- NAVBAR --- */}
      <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 sm:px-6 lg:px-20 py-4 transition-all duration-300 z-50
          ${isScrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-transparent"}`}
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

            <div className="mt-8 space-y-3">
              <NavLink
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full px-5 py-3 rounded-lg border-2 border-emerald-500 text-emerald-600 font-semibold hover:bg-emerald-50 transition-colors"
              >
                Login
              </NavLink>
              <NavLink
                to="/make-donation"
                onClick={() => setIsMenuOpen(false)}
                className="w-full px-5 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg"
              >
                Donate Now
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO CONTENT (unchanged) --- */}
       <div className="relative pt-10 pb-10 px-4 sm:px-6 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-200 shadow-sm">
              <div className="flex -space-x-2">
                <img
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=50&h=50&fit=crop"
                  alt="volunteer"
                />
                <img
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop"
                  alt="volunteer"
                />
                <img
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop"
                  alt="volunteer"
                />
              </div>
              <span className="text-xs font-medium text-gray-700">Join 500+ volunteers</span>
            </div>

            <h1 className="text-5xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Empowering <span className="text-emerald-600">Youth</span>,
              <br />
              Transforming <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Lives</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Sabo Ibadan Youth Charity Foundation is dedicated to supporting
              underprivileged youth through education, skill development, and
              community initiatives. Together, we create opportunities and hope
              for a brighter tomorrow.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/campaigns"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Donate Now</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                to="/get-involved"
                className="w-full sm:w-auto px-8 py-4 border-2 border-amber-500 text-amber-600 rounded-full font-semibold hover:bg-amber-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Get Involved</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              {[
                { number: "500+", label: "Volunteers" },
                { number: "50+", label: "Projects" },
                { number: "1000+", label: "Lives Changed" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {stat.number}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <img
                src={heroImg}
                alt="Empowering youth through education"
                className="w-full h-[500px] lg:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent"></div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6 max-w-xs hidden lg:block">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">₦2.5M+</p>
                  <p className="text-sm text-gray-600">Raised This Year</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-400 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-400 rounded-full blur-3xl opacity-40"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
