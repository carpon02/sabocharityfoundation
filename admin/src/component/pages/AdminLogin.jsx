// admin/src/component/pages/AdminLogin.jsx - Sabo Ibadan Youth Charity Foundation
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Shield,
  Activity,
  ArrowRight,
  ShieldCheck,
  Heart,
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
      toast.success("Welcome to Foundation Hub");
    } catch (err) {
      // Error handled by redux slice/toast
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-950 overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#10b98120_0%,transparent_50%)]" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-emerald-600/10 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-teal-600/10 blur-[150px] rounded-full"
        />
      </div>

      <div className="relative z-10 w-full max-w-xl p-4">
        {/* Foundation Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[2rem] bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-[0_0_50px_rgba(16,185,129,0.4)] mb-4 border border-white/20">
            <Heart size={28} />
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white mb-1">
            Sabo Ibadan Youth Charity Foundation
          </h1>
          <p className="text-sm font-semibold text-emerald-400 mb-2">
            Ibadan Community Impact Hub
          </p>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 flex items-center justify-center gap-2">
            <span className="w-8 h-px bg-gray-800" /> Admin Portal{" "}
            <span className="w-8 h-px bg-gray-800" />
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-20">
              <Shield size={32} className="text-emerald-400" />
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-black tracking-tight text-white mb-1">
                Welcome Back
              </h2>
              <p className="text-sm font-semibold text-gray-400">
                Sign in to manage foundation operations
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 ml-8">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="email"
                    placeholder="admin@saboyouth.org"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-8 py-5 font-semibold text-sm text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 ml-8">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-16 pr-20 py-5 font-semibold text-sm text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-all"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-5 rounded-[2rem] font-bold text-sm shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:shadow-emerald-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <Activity size={20} className="animate-spin" />
                  ) : (
                    <>
                      Sign In to Foundation Hub{" "}
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Security Indicators */}
            <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <ShieldCheck size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">
                    Secure Access
                  </span>
                  <span className="text-[10px] font-semibold text-gray-600">
                    Encrypted
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500">
                  <Activity size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">
                    Protected
                  </span>
                  <span className="text-[10px] font-semibold text-gray-600">
                    Session Tracked
                  </span>
                </div>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center space-y-3"
        >
          <p className="text-xs font-semibold text-gray-600">
            Sabo Ibadan Youth Charity Foundation © 2026
          </p>
          <div className="flex justify-center gap-8">
            <button
              onClick={() => navigate("/")}
              className="text-xs font-semibold text-gray-500 hover:text-emerald-400 transition-colors"
            >
              Return to Website
            </button>
            <button className="text-xs font-semibold text-gray-500 hover:text-emerald-400 transition-colors">
              Need Help?
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
