import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Send,
  Mail,
  ExternalLink,
} from "lucide-react";
import { verifyEmail, resendVerification } from "../../features/auth/authSlice";
import { toast } from "react-hot-toast";
import { motion as Motion } from "framer-motion";

const Verify = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const handleVerification = async (t) => {
      try {
        await dispatch(verifyEmail(t)).unwrap();
        setVerificationStatus("success");
        setTimeout(() => {
          navigate("/user/dashboard");
        }, 3000);
      } catch {
        setVerificationStatus("error");
      }
    };

    if (token) {
      handleVerification(token);
    }
  }, [token, dispatch, navigate]);

  const handleResend = async () => {
    if (!user?.email) {
      toast.error("No email associated with this session.");
      return;
    }
    setResendLoading(true);
    try {
      await dispatch(resendVerification(user.email)).unwrap();
      toast.success("Identity packet transmitted to your inbox.");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Failed to resend");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <Motion.div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <Motion.div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-100/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, delay: 2 }}
      />

      <Motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card-premium p-10 md:p-12 rounded-[3.5rem] border-white/50 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] text-center space-y-8 relative z-10"
      >
        {verificationStatus === "pending" && !token ? (
          <div className="space-y-8 py-4">
            <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 flex items-center justify-center mx-auto shadow-inner text-indigo-500 animate-pulse">
              <Mail size={48} strokeWidth={1.5} />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-black text-dark tracking-tight uppercase">
                Check Your <br />
                <span className="text-indigo-600">Inbox.</span>
              </h1>
              <p className="text-gray-400 font-medium text-sm">
                We've transmitted a secure identity packet to your email. Click
                the link to synchronize your account.
              </p>
            </div>
            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 flex flex-col gap-4">
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="flex items-center justify-center gap-3 w-full py-4 bg-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-900 disabled:opacity-50 transition-all shadow-xl"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Retransmitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Resend Packets
                  </>
                )}
              </button>
            </div>
          </div>
        ) : verificationStatus === "pending" ? (
          <div className="space-y-8 py-4">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-[2rem] bg-primary-50 flex items-center justify-center text-primary-600 animate-pulse">
                <Loader2 className="animate-spin" size={40} strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl shadow-lg border border-gray-50 flex items-center justify-center">
                <ShieldCheck size={16} className="text-secondary-500" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-black text-dark tracking-tight uppercase">
                Verifying <br />
                <span className="text-primary-600">Identity.</span>
              </h1>
              <p className="text-gray-400 font-medium text-sm">
                Establishing the encrypted link to the Sabo Ibadan Foundation
                network. Please wait...
              </p>
            </div>
          </div>
        ) : null}

        {verificationStatus === "success" && (
          <div className="space-y-8 py-4">
            <Motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, 0] }}
              className="w-24 h-24 rounded-[2rem] bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-inner"
            >
              <CheckCircle2 size={48} strokeWidth={1.5} />
            </Motion.div>
            <div className="space-y-4">
              <h1 className="text-3xl font-black text-dark tracking-tight uppercase">
                Access <br />
                <span className="text-emerald-500">Authorized.</span>
              </h1>
              <p className="text-gray-400 font-medium text-sm">
                Your credentials have been verified. Redirecting you to the
                intelligence hub in 3 seconds...
              </p>
            </div>
            <Link
              to="/user/dashboard"
              className="inline-flex items-center gap-2 text-[10px] font-black text-primary-600 uppercase tracking-widest hover:gap-4 transition-all"
            >
              Enter Dashboard Now <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {verificationStatus === "error" && (
          <div className="space-y-8 py-4">
            <div className="w-24 h-24 rounded-[2rem] bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-inner">
              <XCircle size={48} strokeWidth={1.5} />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-black text-dark tracking-tight uppercase">
                Protocol <br />
                <span className="text-red-500">Failure.</span>
              </h1>
              <p className="text-gray-400 font-medium text-sm">
                The verification token has expired or is invalid. Your identity
                packet could not be processed.
              </p>
            </div>

            <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 flex flex-col gap-4">
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="flex items-center justify-center gap-3 w-full py-4 bg-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-900 disabled:opacity-50 transition-all shadow-xl"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Retransmitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Resend Packets
                  </>
                )}
              </button>
              <Link
                to="/login"
                className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-dark transition-colors"
              >
                Return to Login Base
              </Link>
            </div>
          </div>
        )}

        <div className="pt-8 border-t border-gray-100 flex items-center justify-between text-[10px] font-black text-gray-300 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Mail size={12} />
            SIYCF Support
          </div>
          <a
            href="https://saboibadanyouth.org"
            className="flex items-center gap-1 hover:text-primary-500 transition-colors"
          >
            Main Site <ExternalLink size={10} />
          </a>
        </div>
      </Motion.div>
    </div>
  );
};

export default Verify;
