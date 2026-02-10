import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Heart,
  Shield,
  CheckCircle,
  Phone,
  ArrowRight,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  registerUser,
  clearError,
  logout,
} from "../../features/auth/authSlice";

const Login = () => {
  const [state, setState] = useState("login"); // login or register
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { loading, user, isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        toast.error("Admins must login via the Admin Portal.");
        dispatch(logout()); // Auto-logout if admin tries to login here
        return;
      }

      if (state === "register") {
        navigate("/verify", { replace: true });
      } else {
        const from = location.state?.from?.pathname || "/user/dashboard";
        navigate(from, { replace: true });
      }
    }
  }, [user, isAuthenticated, navigate, location, state, dispatch]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const onChangeHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.email || !data.password) {
      toast.error("Credentials required.");
      return;
    }

    try {
      if (state === "login") {
        await dispatch(
          loginUser({
            email: data.email.toLowerCase(),
            password: data.password,
          })
        ).unwrap();
      } else {
        await dispatch(
          registerUser({
            fullName: data.fullName,
            email: data.email.toLowerCase(),
            password: data.password,
            phone: data.phone,
          })
        ).unwrap();
      }
    } catch {}
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 overflow-hidden relative">
      <Toaster position="top-right" />

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-secondary-50 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center relative z-10">
        {/* Visual Content Column */}
        <div className="hidden lg:block space-y-12 p-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-700 font-black text-sm uppercase tracking-widest hover:gap-4 transition-all"
          >
            <ChevronLeft size={16} /> Back to Haven
          </Link>

          <div className="space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-primary-900 flex items-center justify-center shadow-2xl">
              <Heart className="text-primary-400 fill-primary-400" size={32} />
            </div>
            <h1 className="text-7xl font-black text-dark leading-[0.9] tracking-tighter">
              Impact <br />
              Starts <span className="text-primary-700">Here.</span>
            </h1>
            <p className="text-xl text-gray-500 font-medium max-w-md">
              Join the circle of progress. Your account is your command center
              for change in Sabo, Ibadan.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-10">
            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 flex items-center gap-4">
              <Shield className="text-secondary-600" />
              <span className="text-xs font-black uppercase text-gray-400">
                Secure Protocol
              </span>
            </div>
            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100 flex items-center gap-4">
              <Sparkles className="text-primary-600" />
              <span className="text-xs font-black uppercase text-gray-400">
                Early Access
              </span>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="w-full max-w-[480px] mx-auto">
          <div className="bg-white rounded-[4rem] p-10 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-50 animate-fade-in-up">
            <div className="text-center mb-10 space-y-2">
              <h2 className="text-3xl font-black text-dark tracking-tight">
                {state === "login" ? "Authentication" : "Registration"}
              </h2>
              <p className="text-gray-400 text-sm font-medium">
                {state === "login"
                  ? "Enter your secure credentials"
                  : "Create your impact identity"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {state === "register" && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                    Legal Name
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-600 transition-colors"
                      size={18}
                    />
                    <input
                      name="fullName"
                      value={data.fullName}
                      onChange={onChangeHandler}
                      className="w-full py-5 pl-14 pr-8 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 outline-none transition-all font-bold text-dark"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-600 transition-colors"
                    size={18}
                  />
                  <input
                    name="email"
                    value={data.email}
                    onChange={onChangeHandler}
                    type="email"
                    className="w-full py-5 pl-14 pr-8 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 outline-none transition-all font-bold text-dark"
                    placeholder="name@impact.org"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                  Secret Shield
                </label>
                <div className="relative group">
                  <Lock
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-600 transition-colors"
                    size={18}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-dark transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <input
                    name="password"
                    value={data.password}
                    onChange={onChangeHandler}
                    type={showPassword ? "text" : "password"}
                    className="w-full py-5 pl-14 pr-14 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 outline-none transition-all font-bold text-dark"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {state === "login" && (
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    size="sm"
                    className="text-xs font-black text-primary-700 hover:underline"
                  >
                    Revoke Access?
                  </Link>
                </div>
              )}

              <button
                disabled={loading}
                className="w-full py-6 bg-primary-900 hover:bg-dark text-white font-black rounded-[2rem] shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : state === "login"
                  ? "Grant Access"
                  : "Create Identity"}
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-gray-100 text-center">
              <p className="text-sm font-medium text-gray-400">
                {state === "login"
                  ? "Haven't joined yet?"
                  : "Already a strategist?"}
                <button
                  onClick={() =>
                    setState(state === "login" ? "register" : "login")
                  }
                  className="ml-2 text-primary-700 font-black hover:underline"
                >
                  {state === "login" ? "Initialize" : "Authenticate"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
