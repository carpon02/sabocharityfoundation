import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Phone,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  registerUser,
  loginWithGoogle,
  clearError,
  logout,
} from "../../features/auth/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import apiClient from "../../config/apiConfig";

const formatAmount = (num) => {
  if (!num) return "₦0";
  if (num >= 1_000_000) return `₦${(num / 1_000_000).toFixed(1)}M+`;
  if (num >= 1_000) return `₦${(num / 1_000).toFixed(0)}K+`;
  return `₦${num.toLocaleString()}`;
};

const formatCount = (num) => {
  if (!num) return "0";
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K+`;
  return `${num.toLocaleString()}+`;
};

const InputField = ({ icon: Icon, label, error, ...props }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-gray-500 tracking-wide uppercase">
      {label}
    </label>
    <div className="relative group">
      <Icon
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none"
      />
      <input
        {...props}
        className={`w-full h-11 pl-10 pr-4 rounded-lg bg-gray-50 border text-sm text-gray-900 placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition-all
          ${error ? "border-red-300 bg-red-50" : "border-gray-200"}`}
      />
    </div>
    {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
  </div>
);

const Login = () => {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ fullName: "", email: "", password: "", phone: "" });
  const [stats, setStats] = useState({ totalRaised: 0, totalDonations: 0, livesImpacted: 0 });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, user, isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        toast.error("Admins must login via the Admin Portal.");
        dispatch(logout());
        return;
      }
      if (!user.isEmailVerified && mode === "register") {
        navigate("/verify", { replace: true });
      } else {
        const from = location.state?.from?.pathname || "/user/dashboard";
        navigate(from, { replace: true });
      }
    }
  }, [user, isAuthenticated, navigate, location, mode, dispatch]);

  useEffect(() => () => dispatch(clearError()), [dispatch]);

  // Fetch real analytics data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get("/analytics/overview");
        if (res.data?.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        // silently fail — we have fallback values
      }
    };
    fetchStats();
  }, []);

  const onChange = (e) => setData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.email || !data.password) { toast.error("Please fill in all required fields."); return; }
    try {
      if (mode === "login") {
        await dispatch(loginUser({ email: data.email.toLowerCase(), password: data.password })).unwrap();
      } else {
        await dispatch(registerUser({ fullName: data.fullName, email: data.email.toLowerCase(), password: data.password, phone: data.phone })).unwrap();
      }
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: "10px", fontSize: "14px" } }} />

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gray-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.15)_0%,_transparent_60%)]" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.08)_0%,_transparent_60%)]" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <img src={logo} alt="Sabo Charity Foundation" className="h-12 w-auto" />
          <span className="text-white font-bold text-base tracking-tight">Sabo Charity Foundation</span>
        </Link>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/30 rounded-full px-3 py-1">
              <Shield size={12} className="text-emerald-400" />
              <span className="text-emerald-400 text-xs font-medium">Trusted & Secure</span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Making a difference,<br />
              <span className="text-emerald-400">one donation</span> at a time.
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Join thousands of donors supporting education, healthcare, and community development in Sabo, Ibadan.
            </p>
          </div>

          <div className="space-y-3">
            {[
              "Track your donations in real-time",
              "Get impact reports from beneficiaries",
              "Secure payments via Paystack",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span className="text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stat row */}
        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            [formatAmount(stats.totalRaised), "Raised"],
            [formatCount(stats.totalDonations), "Donors"],
            [formatCount(stats.livesImpacted), "Helped"],
          ].map(([val, lbl]) => (
            <div key={lbl} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-white font-bold text-lg">{val}</p>
              <p className="text-gray-400 text-xs mt-0.5">{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — auth card */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        {/* Mobile logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-8 lg:hidden">
          <img src={logo} alt="Sabo Charity Foundation" className="h-10 w-auto" />
          <span className="font-bold text-gray-900 text-sm">Sabo Charity Foundation</span>
        </Link>

        <div className="w-full max-w-[400px]">
          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

            {/* Tab switcher */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              {["login", "register"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                    mode === m
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {m === "login" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {isLogin ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isLogin
                  ? "Sign in to manage your donations and impact."
                  : "Join us and start making a difference today."}
              </p>
            </div>

            {/* Google */}
            <div className="mb-5">
              <GoogleLogin
                onSuccess={(res) => dispatch(loginWithGoogle(res.credential))}
                onError={() => toast.error("Google login failed. Please try again.")}
                useOneTap
                theme="outline"
                shape="rectangular"
                width="100%"
                text={isLogin ? "signin_with" : "signup_with"}
              />
            </div>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-400 font-medium">or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <InputField
                  icon={User}
                  label="Full Name"
                  name="fullName"
                  value={data.fullName}
                  onChange={onChange}
                  placeholder="John Doe"
                  autoComplete="name"
                />
              )}

              <InputField
                icon={Mail}
                label="Email address"
                name="email"
                type="email"
                value={data.email}
                onChange={onChange}
                placeholder="you@example.com"
                autoComplete="email"
              />

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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={onChange}
                    placeholder="••••••••"
                    autoComplete={isLogin ? "current-password" : "new-password"}
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

              {!isLogin && (
                <InputField
                  icon={Phone}
                  label="Phone number (optional)"
                  name="phone"
                  type="tel"
                  value={data.phone}
                  onChange={onChange}
                  placeholder="+234 800 000 0000"
                  autoComplete="tel"
                />
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-semibold rounded-lg
                  flex items-center justify-center gap-2 transition-all mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Please wait...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? "Sign in" : "Create account"}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer link */}
          <p className="text-center text-sm text-gray-500 mt-5">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(isLogin ? "register" : "login")}
              className="text-emerald-600 font-semibold hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>

          <p className="text-center text-xs text-gray-400 mt-4">
            By continuing, you agree to our{" "}
            <a href="/terms" className="underline hover:text-gray-600">Terms</a>{" "}
            and{" "}
            <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
