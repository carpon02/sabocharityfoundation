import React, { useState, useReducer, memo, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiClient from "../../config/apiConfig";
import toast from "react-hot-toast";
import {
  Globe,
  ArrowRight,
  CreditCard,
  Clipboard,
  CheckCircle2,
  X,
  Zap,
  DollarSign,
  Phone,
  Mail,
  User,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Star,
  Loader,
  Heart,
  Upload,
  CheckCircle,
  Clock,
  Building2,
  GraduationCap,
  Stethoscope,
  Lightbulb,
  Users2,
  HandHeart,
} from "lucide-react";
import { motion as Motion } from "framer-motion";

// ============= CONSTANTS =============
const DONATION_TYPES = {
  education: {
    icon: GraduationCap,
    label: "Education Initiatives",
    impact: "Providing learning resources & scholarships",
  },
  healthcare: {
    icon: Stethoscope,
    label: "Healthcare Support",
    impact: "Medical bills & essential treatments",
  },
  "youth-empowerment": {
    icon: Lightbulb,
    label: "Youth Empowerment",
    impact: "Skill acquisition & business grants",
  },
  "community-development": {
    icon: Users2,
    label: "Community Development",
    impact: "Infrastructure & welfare programs",
  },
  general: {
    icon: HandHeart,
    label: "General Support",
    impact: "Support where it's needed most",
  },
};

const SUGGESTED_AMOUNTS = [
  { amount: 1000, label: "Textbooks" },
  { amount: 5000, label: "Health Check" },
  { amount: 10000, label: "Tech Kit" },
  { amount: 25000, label: "Business Seed" },
  { amount: 100000, label: "Hub Solar" },
];

const BANK_DETAILS = {
  bankName: "First Bank of Nigeria",
  accountName: "Sabo Ibadan Youth Charity Foundation",
  accountNumber: "1234567890",
};

const SUCCESS_STORIES = [
  {
    id: 1,
    name: "Aisha's Journey",
    description: "Life-saving healthcare and nursing degree pursuit.",
    fullDescription:
      "Aisha received essential treatment and is now studying to become a nurse, giving back to her community.",
    impact: "Healthcare + Education",
    date: "2025-08-15",
    donationType: "healthcare",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&fit=crop",
  },
];

// ============= REDUCER & STATE =============
const initialState = {
  intent: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    donationType: "general",
    amount: "10000",
    agreedToTerms: true,
    donationMode: "one-time",
    paymentMethod: "online",
  },
  ui: {
    showPopup: false,
    popupStep: "bank",
    isSubmitting: false,
    submitSuccess: false,
    pollStatus: "idle", // "idle" | "polling" | "verified" | "failed"
  },
};

const donationReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_INTENT":
      return { ...state, intent: { ...state.intent, ...action.payload } };
    case "SET_POPUP":
      return {
        ...state,
        ui: {
          ...state.ui,
          showPopup: action.payload.show,
          popupStep: action.payload.step || state.ui.popupStep,
        },
      };
    case "SET_SUBMITTING":
      return { ...state, ui: { ...state.ui, isSubmitting: action.payload } };
    case "SET_POLL_STATUS":
      return { ...state, ui: { ...state.ui, pollStatus: action.payload } };
    case "SUBMISSION_SUCCESS":
      return {
        ...initialState,
        ui: {
          ...initialState.ui,
          submitSuccess: true,
          showPopup: true,
          popupStep: "thanks",
        },
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

// ============= COMPONENTS =============
const InputField = memo((props) => {
  const {
    icon: Icon,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    id,
    "aria-label": ariaLabel,
    ...rest
  } = props;
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors">
        <Icon size={18} />
      </div>
      <input
        id={id || name}
        aria-label={ariaLabel || placeholder || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-dark font-medium transition-all outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-100 shadow-sm"
        {...rest}
      />
    </div>
  );
});

const Donation = () => {
  const [state, dispatch] = useReducer(donationReducer, initialState);
  const { intent, ui } = state;
  const [activeCampaignId, setActiveCampaignId] = useState(null);

  // ─── Bank transfer state ──────────────────────────────────────────────
  const [transferRef, setTransferRef] = useState(null);
  const [transferExpiry, setTransferExpiry] = useState(null);
  const [bankTimer, setBankTimer] = useState(0);
  const [transferChecking, setTransferChecking] = useState(false);
  const [transferNotFound, setTransferNotFound] = useState(false);
  const [accountDetails, setAccountDetails] = useState(null);
  const bankTimerRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // ─── Format MM:SS ─────────────────────────────────────────────────────
  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ─── Load Paystack inline script once ────────────────────────────────
  useEffect(() => {
    if (document.getElementById("paystack-inline-script")) return;
    const script = document.createElement("script");
    script.id = "paystack-inline-script";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // ─── 30-minute bank transfer countdown ───────────────────────────────
  useEffect(() => {
    if (!transferExpiry) return;
    const tick = () =>
      setBankTimer(Math.max(0, Math.ceil((transferExpiry - Date.now()) / 1000)));
    tick();
    bankTimerRef.current = setInterval(tick, 1000);
    return () => clearInterval(bankTimerRef.current);
  }, [transferExpiry]);

  // ─── Clean up bank state when popup closes ───────────────────────────
  useEffect(() => {
    if (!ui.showPopup) {
      clearInterval(bankTimerRef.current);
      setTransferRef(null);
      setTransferExpiry(null);
      setBankTimer(0);
      setTransferNotFound(false);
      setAccountDetails(null);
    }
  }, [ui.showPopup]);

  // ─── Polling refs ─────────────────────────────────────────────────────
  const pollIntervalRef = useRef(null);
  const pollAttemptsRef = useRef(0);
  const MAX_POLL_ATTEMPTS = 5;

  const startPolling = useCallback((reference) => {
    dispatch({ type: "SET_POLL_STATUS", payload: "polling" });
    pollAttemptsRef.current = 0;

    pollIntervalRef.current = setInterval(async () => {
      pollAttemptsRef.current += 1;
      try {
        const { data } = await apiClient.get(`/donations/status/${reference}`);
        if (data.data?.paymentVerified || data.data?.status === "verified") {
          clearInterval(pollIntervalRef.current);
          dispatch({ type: "SET_POLL_STATUS", payload: "verified" });
        } else if (pollAttemptsRef.current >= MAX_POLL_ATTEMPTS) {
          clearInterval(pollIntervalRef.current);
          dispatch({ type: "SET_POLL_STATUS", payload: "idle" });
        }
      } catch {
        if (pollAttemptsRef.current >= MAX_POLL_ATTEMPTS) {
          clearInterval(pollIntervalRef.current);
          dispatch({ type: "SET_POLL_STATUS", payload: "idle" });
        }
      }
    }, 2000);
  }, []);

  // ─── Clean up polling on unmount ─────────────────────────────────────
  useEffect(() => {
    return () => clearInterval(pollIntervalRef.current);
  }, []);

  // ─── Auto-dismiss success modal after 8 seconds ──────────────────────
  useEffect(() => {
    if (!ui.showPopup || ui.popupStep !== "thanks") return;
    const timer = setTimeout(() => {
      clearInterval(pollIntervalRef.current);
      dispatch({ type: "RESET" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 8000);
    return () => clearTimeout(timer);
  }, [ui.showPopup, ui.popupStep]);

  // ─── Fetch active campaign ────────────────────────────────────────────
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const { data } = await apiClient.get("/campaigns");
        if (data.success && data.data.length > 0) {
          const general =
            data.data.find((c) => c.category === "general") || data.data[0];
          setActiveCampaignId(general._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCampaign();
  }, []);

  // ─── Initialize bank transfer session ────────────────────────────────
  const initBankTransfer = async () => {
    dispatch({ type: "SET_SUBMITTING", payload: true });
    try {
      const { data } = await apiClient.post("/donations/initialize-transfer", {
        campaignId: activeCampaignId,
        amount: parseFloat(intent.amount),
        email: intent.email,
        donorInfo: {
          firstName: intent.firstName,
          lastName: intent.lastName,
          phone: intent.phone,
        },
      });
      const ref = data.data?.payment?.reference;
      const details = data.data?.payment?.accountDetails;
      setTransferRef(ref || `SCF-${Date.now().toString(36).toUpperCase()}`);
      if (details) setAccountDetails(details);
    } catch {
      // Graceful fallback with local reference
      setTransferRef(`SCF-${Date.now().toString(36).toUpperCase()}`);
    } finally {
      setTransferExpiry(Date.now() + 30 * 60 * 1000);
      setTransferNotFound(false);
      dispatch({ type: "SET_POPUP", payload: { show: true, step: "bank" } });
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  // ─── "I've Transferred the Money" ────────────────────────────────────
  const handleIveTransferred = async () => {
    if (bankTimer === 0) return;
    setTransferChecking(true);
    setTransferNotFound(false);
    try {
      let verified = false;
      for (let i = 0; i < 3; i++) {
        if (i > 0) await new Promise((r) => setTimeout(r, 2500));
        try {
          const { data } = await apiClient.get(
            `/donations/transfer-status/${transferRef}`
          );
          if (
            data.data?.paymentVerified ||
            data.data?.status === "verified" ||
            data.data?.approvalStatus === "approved" ||
            data.data?.status === "completed"
          ) {
            verified = true;
            break;
          }
        } catch {
          // continue polling
        }
      }
      if (verified) {
        toast.success("Transfer confirmed! Thank you for your donation!");
        dispatch({ type: "SET_POPUP", payload: { show: true, step: "thanks" } });
      } else {
        setTransferNotFound(true);
      }
    } finally {
      setTransferChecking(false);
    }
  };

  // ─── Main form submit ─────────────────────────────────────────────────
  const handleDonateSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to make a donation.");
      navigate("/login");
      return;
    }

    if (!intent.firstName || !intent.lastName || !intent.email || !intent.amount) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (!intent.agreedToTerms) {
      toast.error("You must accept our Terms of Service to proceed.");
      return;
    }

    // Bank transfer → open timed modal
    if (intent.paymentMethod === "bank") {
      await initBankTransfer();
      return;
    }

    // Card / Online → Paystack inline
    dispatch({ type: "SET_SUBMITTING", payload: true });
    try {
      const payload = {
        campaignId: activeCampaignId,
        amount: parseFloat(intent.amount),
        email: intent.email,
        donorInfo: {
          firstName: intent.firstName,
          lastName: intent.lastName,
          phone: intent.phone,
        },
        paymentMethod: "card",
        isRecurring: intent.donationMode === "monthly",
      };

      const { data } = await apiClient.post("/donations/initialize", payload);

      if (!data.success) {
        toast.error(data.message || "Could not initialize payment.");
        dispatch({ type: "SET_SUBMITTING", payload: false });
        return;
      }

      const { reference } = data.data.payment;
      const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";

      if (typeof window.PaystackPop === "undefined") {
        toast.error(
          "Payment system is still loading. Please try again in a moment."
        );
        dispatch({ type: "SET_SUBMITTING", payload: false });
        return;
      }

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: intent.email,
        amount: Math.round(parseFloat(intent.amount) * 100),
        ref: reference,
        currency: "NGN",
        firstname: intent.firstName,
        lastname: intent.lastName,
        phone: intent.phone,
        label: `Donation — ${intent.firstName} ${intent.lastName}`,
        onClose: () => {
          toast("Payment cancelled.");
          dispatch({ type: "SET_SUBMITTING", payload: false });
        },
        callback: (response) => {
          dispatch({ type: "SET_POPUP", payload: { show: true, step: "thanks" } });
          toast.success("Donation received! Thank you!");
          dispatch({ type: "SET_SUBMITTING", payload: false });
          startPolling(response.reference);
        },
      });

      handler.openIframe();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Payment initialization failed. Please try again."
      );
      console.error(err);
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  // ─────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white min-h-screen overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative pt-28 pb-32 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950/40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-emerald-400 animate-pulse" />
            Make an Impact Today
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Support Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Mission
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            We are building a brighter future for the youth of Sabo, Ibadan.
            Your generous donation is the catalyst for sustainable transformation.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="relative -mt-16 z-20 px-4 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-4 space-y-5">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-7 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="w-11 h-11 bg-gray-900 rounded-xl flex items-center justify-center text-emerald-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Community Trust</div>
                  <div className="text-emerald-600 font-bold text-sm">Verified NGO</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-extrabold text-gray-900">15k+</div>
                  <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">Lives Touched</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-gray-900">94%</div>
                  <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Story Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg h-72 group">
              <img
                src={SUCCESS_STORIES[0].image}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Success Story"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 space-y-2">
                <div className="inline-block px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-semibold uppercase tracking-wider">
                  Success Story
                </div>
                <h4 className="text-lg font-bold text-white leading-tight">{SUCCESS_STORIES[0].name}</h4>
                <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed">{SUCCESS_STORIES[0].fullDescription}</p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: ShieldCheck, label: "SSL Secure", sub: "AES-256 Bit" },
                { icon: CheckCircle2, label: "CAC Registered", sub: "IT/NO/123456" },
                { icon: Globe, label: "100% Program", sub: "Direct Allocation" },
                { icon: Star, label: "Audited", sub: "Financial Clarity" },
              ].map((badge, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 py-4 px-3 rounded-xl flex flex-col items-center text-center gap-1.5">
                  <badge.icon size={17} className="text-emerald-600" />
                  <div className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">{badge.label}</div>
                  <div className="text-[9px] text-gray-400">{badge.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Donation Engine */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 sm:p-10">
              <form onSubmit={handleDonateSubmit} className="space-y-10">
                {/* 1. Cause */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">1</div>
                    <h2 className="text-xl font-bold text-gray-900">Select Donation Cause</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(DONATION_TYPES).map(([key, value]) => (
                      <label
                        key={key}
                        className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          intent.donationType === key
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-100 hover:border-gray-200 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="donationType"
                          value={key}
                          className="hidden"
                          checked={intent.donationType === key}
                          onChange={(e) =>
                            dispatch({ type: "UPDATE_INTENT", payload: { donationType: e.target.value } })
                          }
                        />
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              intent.donationType === key ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500"
                            }`}>
                              <value.icon size={14} />
                            </div>
                            <span className="text-sm font-semibold text-gray-900">{value.label}</span>
                          </div>
                          {intent.donationType === key && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <p className="mt-2 text-xs text-gray-500 leading-relaxed pl-9">{value.impact}</p>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. Your Details */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">2</div>
                    <h2 className="text-xl font-bold text-gray-900">Your Details</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      icon={User}
                      name="firstName"
                      placeholder="First Name"
                      value={intent.firstName}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_INTENT",
                          payload: { firstName: e.target.value },
                        })
                      }
                    />
                    <InputField
                      icon={User}
                      name="lastName"
                      placeholder="Last Name"
                      value={intent.lastName}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_INTENT",
                          payload: { lastName: e.target.value },
                        })
                      }
                    />
                    <InputField
                      icon={Mail}
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={intent.email}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_INTENT",
                          payload: { email: e.target.value },
                        })
                      }
                    />
                    <InputField
                      icon={Phone}
                      name="phone"
                      placeholder="Phone Number"
                      value={intent.phone}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_INTENT",
                          payload: { phone: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                {/* 3. Amount */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">3</div>
                    <h2 className="text-xl font-bold text-gray-900">Donation Amount</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {SUGGESTED_AMOUNTS.map((amt) => (
                        <button
                          key={amt.amount}
                          type="button"
                          onClick={() => dispatch({ type: "UPDATE_INTENT", payload: { amount: amt.amount.toString() } })}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            intent.amount === amt.amount.toString()
                              ? "border-emerald-500 bg-emerald-50 shadow-sm"
                              : "border-gray-100 bg-gray-50 hover:border-gray-200"
                          }`}
                        >
                          <div className="text-base font-bold text-gray-900">₦{amt.amount.toLocaleString()}</div>
                          <div className="text-[10px] text-gray-400 font-medium mt-0.5">{amt.label}</div>
                        </button>
                      ))}
                    </div>
                    <InputField
                      icon={DollarSign}
                      name="amount"
                      placeholder="Enter Custom Amount (₦)"
                      type="number"
                      value={intent.amount}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_INTENT",
                          payload: { amount: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                {/* 4. Payment Method */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-bold">4</div>
                    <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      intent.paymentMethod === "online" ? "border-emerald-500 bg-emerald-50 shadow-sm" : "border-gray-100 hover:border-gray-200 bg-white"
                    }`}>
                      <input type="radio" name="paymentMethod" value="online" className="hidden"
                        checked={intent.paymentMethod === "online"}
                        onChange={(e) => dispatch({ type: "UPDATE_INTENT", payload: { paymentMethod: e.target.value } })} />
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        intent.paymentMethod === "online" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400"
                      }`}><CreditCard size={22} /></div>
                      <div className="text-center">
                        <span className="block font-semibold text-sm text-gray-900">Pay with Card</span>
                        <span className="text-[10px] text-gray-400 mt-0.5 block">Instant · Secure</span>
                      </div>
                      {intent.paymentMethod === "online" && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center"><CheckCircle size={12} className="text-white" /></div>
                      )}
                    </label>

                    <label className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      intent.paymentMethod === "bank" ? "border-emerald-500 bg-emerald-50 shadow-sm" : "border-gray-100 hover:border-gray-200 bg-white"
                    }`}>
                      <input type="radio" name="paymentMethod" value="bank" className="hidden"
                        checked={intent.paymentMethod === "bank"}
                        onChange={(e) => dispatch({ type: "UPDATE_INTENT", payload: { paymentMethod: e.target.value } })} />
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        intent.paymentMethod === "bank" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400"
                      }`}><Building2 size={22} /></div>
                      <div className="text-center">
                        <span className="block font-semibold text-sm text-gray-900">Bank Transfer</span>
                        <span className="text-[10px] text-gray-400 mt-0.5 block">Manual Transfer</span>
                      </div>
                      {intent.paymentMethod === "bank" && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center"><CheckCircle size={12} className="text-white" /></div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-100 cursor-pointer"
                      checked={intent.agreedToTerms}
                      onChange={(e) => dispatch({ type: "UPDATE_INTENT", payload: { agreedToTerms: e.target.checked } })} />
                    <span className="text-xs font-medium text-gray-500">Accept Terms of Service</span>
                  </label>
                  <button type="submit" disabled={ui.isSubmitting}
                    className="w-full sm:w-auto px-10 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 group"
                  >
                    {ui.isSubmitting ? <Loader className="animate-spin" size={18} /> : <Zap size={18} className="group-hover:fill-white transition-colors" />}
                    Complete Donation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUCCESS MODAL ── */}
      {ui.showPopup && ui.popupStep === "thanks" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md">
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-teal-400" />
            <div className="px-8 py-8 text-center space-y-5">
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-40" />
                <div className="relative w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg">
                  {ui.pollStatus === "polling" ? <Loader size={36} className="text-white animate-spin" /> : <CheckCircle2 size={36} className="text-white" />}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Thank You!</h3>
                <p className="text-emerald-600 font-semibold mt-1">₦{parseFloat(intent.amount || 0).toLocaleString()} donated</p>
              </div>
              {ui.pollStatus === "verified" ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-left">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Payment Confirmed</p>
                  <p className="text-sm text-emerald-600">Your donation is now pending admin approval. A confirmation email is on its way!</p>
                </div>
              ) : ui.pollStatus === "polling" ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-left">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Confirming…</p>
                  <p className="text-sm text-blue-600">Verifying your payment with the server, just a moment.</p>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-left">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Received</p>
                  <p className="text-sm text-gray-500">Your donation has been received. We'll send a confirmation email once it's approved.</p>
                </div>
              )}
              <p className="text-xs text-gray-400">This window closes automatically in a few seconds.</p>
              <button onClick={() => { clearInterval(pollIntervalRef.current); dispatch({ type: "RESET" }); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className="w-full py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
                Return to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── BANK TRANSFER MODAL ── */}
      {ui.showPopup && ui.popupStep === "bank" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

            {/* Timer progress bar */}
            <div className="h-1.5 bg-gray-100 w-full">
              <div
                className={`h-full transition-all duration-1000 ${
                  bankTimer < 300
                    ? "bg-red-500"
                    : bankTimer < 600
                    ? "bg-amber-500"
                    : "bg-primary-500"
                }`}
                style={{ width: `${(bankTimer / (30 * 60)) * 100}%` }}
              />
            </div>

            <div className="px-7 py-7 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Transfer to Foundation</h3>
                  <p className="text-sm text-gray-500 mt-1">Send the exact amount to the account below</p>
                </div>
                <button onClick={() => dispatch({ type: "SET_POPUP", payload: { show: false } })}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {bankTimer === 0 ? (
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle size={28} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Session Expired</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">This 30-minute payment window has closed. Please start a new donation to try again.</p>
                  </div>
                  <button onClick={() => { dispatch({ type: "SET_POPUP", payload: { show: false } }); dispatch({ type: "RESET" }); }}
                    className="w-full py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
                    Start a New Donation
                  </button>
                </div>
              ) : (
                <>
                  {/* Countdown */}
                  <div
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl border ${
                      bankTimer < 300
                        ? "bg-red-50 border-red-200"
                        : bankTimer < 600
                        ? "bg-amber-50 border-amber-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock
                        size={16}
                        className={
                          bankTimer < 300
                            ? "text-red-500"
                            : bankTimer < 600
                            ? "text-amber-600"
                            : "text-gray-500"
                        }
                      />
                      <span
                        className={`text-xs font-black uppercase tracking-widest ${
                          bankTimer < 300
                            ? "text-red-500"
                            : bankTimer < 600
                            ? "text-amber-600"
                            : "text-gray-500"
                        }`}
                      >
                        Session expires in
                      </span>
                    </div>
                    <span
                      className={`text-2xl font-black tabular-nums ${
                        bankTimer < 300
                          ? "text-red-600"
                          : bankTimer < 600
                          ? "text-amber-700"
                          : "text-dark"
                      }`}
                    >
                      {formatTimer(bankTimer)}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5 text-center">
                    <p className="text-[10px] font-semibold uppercase text-emerald-500 tracking-wider mb-1">Transfer Exactly This Amount</p>
                    <p className="text-4xl font-extrabold text-emerald-700">₦{parseFloat(intent.amount || 0).toLocaleString()}</p>
                  </div>

                  {/* Bank details */}
                  <div className="space-y-2.5">
                    {[
                      { label: "Foundation", value: accountDetails?.accountName || BANK_DETAILS.accountName },
                      { label: "Bank", value: accountDetails?.bankName || BANK_DETAILS.bankName },
                      {
                        label: "Account Number",
                        value: accountDetails?.accountNumber || BANK_DETAILS.accountNumber,
                        copy: true,
                      },
                      {
                        label: "Reference / Narration",
                        value: transferRef || "SCF-DONATION",
                        copy: true,
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl"
                      >
                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest shrink-0">
                          {item.label}
                        </span>
                        {item.copy ? (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(item.value);
                              toast.success(`${item.label} copied!`);
                            }}
                            className="flex items-center gap-2 font-black text-primary-700 hover:text-primary-900 transition-colors text-sm ml-4"
                          >
                            <span className="truncate max-w-[200px]">
                              {item.value}
                            </span>
                            <Clipboard size={13} className="shrink-0" />
                          </button>
                        ) : (
                          <span className="font-bold text-dark text-sm text-right ml-4 truncate max-w-[200px]">
                            {item.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Not received yet */}
                  {transferNotFound && (
                    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
                      <AlertCircle
                        size={18}
                        className="text-orange-500 shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-black text-orange-800 mb-1">
                          Transfer Not Received Yet
                        </p>
                        <p className="text-xs text-orange-700 leading-relaxed">
                          We are still waiting for your transfer to this account.
                          If you've already transferred, please wait a few
                          minutes and try again.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <button onClick={handleIveTransferred} disabled={transferChecking}
                    className="w-full py-4 bg-gray-900 text-white font-semibold rounded-xl shadow-lg disabled:opacity-60 transition-all flex items-center justify-center gap-2 hover:bg-emerald-700">
                    {transferChecking ? <><Loader size={18} className="animate-spin" /> Checking your transfer…</> : <><CheckCircle size={18} /> I've Transferred the Money</>}
                  </button>
                  <p className="text-center text-xs text-gray-400">Include the reference in your transfer narration for faster processing.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donation;
