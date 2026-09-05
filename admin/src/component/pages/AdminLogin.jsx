// admin/src/component/pages/AdminLogin.jsx - Sabo Ibadan Youth Charity Foundation
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/logo.png";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Shield,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Activity,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { loginAdmin } from "../../features/auth/adminAuthSlice";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user, isAuthenticated } = useSelector(
    (state) => state.adminAuth,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      navigate("/admin/admin-dashboard", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please enter your credentials");
      return;
    }
    try {
      await dispatch(
        loginAdmin({
          email: formData.email.toLowerCase(),
          password: formData.password,
        }),
      ).unwrap();
    } catch (err) {
      // Error handled by redux slice/toast
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel — dark branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gray-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.12)_0%,_transparent_60%)]" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.06)_0%,_transparent_60%)]" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <img src={logo} alt="Sabo Charity Foundation" className="h-12 w-auto" />
          <div>
            <span className="text-white font-bold text-base tracking-tight block">Sabo Charity Foundation</span>
            <span className="text-emerald-400 text-[10px] font-semibold uppercase tracking-widest">Admin Portal</span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/30 rounded-full px-3 py-1">
              <Shield size={12} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-medium">Restricted Access</span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Foundation<br />
              <span className="text-emerald-400">Command Center</span>
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Manage donations, campaigns, events, and volunteers from a single secure dashboard.
            </p>
          </div>

          <div className="space-y-3">
            {[
              "Manage all donations & payments",
              "Create and publish campaigns",
              "Full analytics & reporting",
              "User & volunteer management",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span className="text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security badges */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <ShieldCheck size={18} className="text-emerald-500" />
            <div>
              <p className="text-white font-semibold text-xs">Encrypted</p>
              <p className="text-gray-500 text-[10px]">TLS Protected</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
            <Activity size={18} className="text-teal-500" />
            <div>
              <p className="text-white font-semibold text-xs">Monitored</p>
              <p className="text-gray-500 text-[10px]">Session Tracked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Mobile logo */}
        <div className="flex items-center gap-2.5 mb-8 lg:hidden">
          <img src={logo} alt="Sabo Charity Foundation" className="h-10 w-auto" />
          <div>
            <span className="font-bold text-gray-900 text-sm block">Sabo Charity Foundation</span>
            <span className="text-emerald-600 text-[10px] font-semibold uppercase tracking-wider">Admin Portal</span>
          </div>
        </div>

        <div className="w-full max-w-[400px]">
          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                <Shield size={14} className="text-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Portal</span>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-sm text-gray-500 mt-1">
                Sign in to manage foundation operations.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 tracking-wide uppercase">
                  Email address
                </label>
                <div className="relative group">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none"
                  />
                  <input
                    type="email"
                    placeholder="admin@saboyouth.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    autoComplete="email"
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400
                      focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 tracking-wide uppercase">
                  Password
                </label>
                <div className="relative group">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    autoComplete="current-password"
                    className="w-full h-11 pl-10 pr-11 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400
                      focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg
                  flex items-center justify-center gap-2 transition-all mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-400">
              Sabo Ibadan Youth Charity Foundation © {new Date().getFullYear()}
            </p>
            <div className="flex justify-center gap-6">
              <a
                href="http://localhost:5173"
                className="text-xs text-gray-500 hover:text-emerald-600 font-medium transition-colors"
              >
                Return to Website
              </a>
              <a
                href="http://localhost:5173/contact"
                className="text-xs text-gray-500 hover:text-emerald-600 font-medium transition-colors"
              >
                Need Help?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
