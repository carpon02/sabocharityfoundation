import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Recovery link transmitted successfully.");
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary-50 rounded-full blur-[140px] opacity-40" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-[4rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-50 space-y-10 animate-fade-in-up">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-dark flex items-center justify-center mx-auto shadow-2xl">
              <Lock className="text-secondary-400" size={32} />
            </div>
            <h2 className="text-4xl font-black text-dark tracking-tighter">
              Access Recovery.
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Enter your registered electronic mail address to receive a secure
              recovery transmission.
            </p>
          </div>

          {submitted ? (
            <div className="space-y-8 animate-scale-in">
              <div className="p-8 rounded-[2.5rem] bg-primary-50 border border-primary-100 flex flex-col items-center text-center gap-4">
                <ShieldCheck className="text-primary-600" size={40} />
                <p className="text-sm font-bold text-primary-900">
                  Recovery link sent to <br />{" "}
                  <span className="font-black underline">{email}</span>
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="w-full py-5 bg-dark text-white font-black rounded-2xl hover:bg-primary-950 transition-all flex items-center justify-center gap-3"
              >
                Enter Different Email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
                  Identity Email
                </label>
                <div className="relative group">
                  <Mail
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary-600 transition-colors"
                    size={18}
                  />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-5 pl-14 pr-8 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 outline-none transition-all font-bold text-dark"
                    placeholder="strategist@foundation.org"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full py-6 bg-primary-900 hover:bg-dark text-white font-black rounded-[2rem] shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? "Transmitting..." : "Initiate Recovery"}
                <ArrowRight size={20} />
              </button>
            </form>
          )}

          <div className="pt-6 border-t border-gray-100 flex justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-dark transition-all"
            >
              <ChevronLeft size={16} /> Back to Terminal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
