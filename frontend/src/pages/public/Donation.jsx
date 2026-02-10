import React, { useState, useReducer, memo, useEffect } from "react";
import apiClient from "../../config/apiConfig";
import toast from "react-hot-toast";
import { usePaystackPayment } from "react-paystack";
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
} from "lucide-react";

// ============= CONSTANTS =============
const DONATION_TYPES = {
  education: {
    label: "🎓 Education Support",
    impact: "Sponsors a child's education for 3 months",
  },
  healthcare: {
    label: "🩺 Healthcare Assistance",
    impact: "Provides medical care for 5 families",
  },
  "youth-empowerment": {
    label: "💡 Youth Empowerment",
    impact: "Trains 10 youths in digital skills",
  },
  "community-development": {
    label: "🌍 Community Development",
    impact: "Supports community infrastructure",
  },
  general: { label: "❤️ General Donation", impact: "Goes where needed most" },
};

const SUGGESTED_AMOUNTS = [5000, 10000, 25000, 50000, 100000];

const BANK_DETAILS = {
  bankName: "First Bank of Nigeria",
  accountName: "Sabo Youth Foundation",
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
  paystackConfig: {
    reference: new Date().getTime().toString(),
    email: "",
    amount: 0,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
  },
  ui: {
    showPopup: false,
    popupStep: "bank",
    isSubmitting: false,
    submitSuccess: false,
  },
};

const donationReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_INTENT":
      return { ...state, intent: { ...state.intent, ...action.payload } };
    case "SET_PAYSTACK_CONFIG":
      return {
        ...state,
        paystackConfig: { ...state.paystackConfig, ...action.payload },
      };
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
    ...rest
  } = props;
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors">
        <Icon size={18} />
      </div>
      <input
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
  const [triggerPaystack, setTriggerPaystack] = useState(false);

  const initializePayment = usePaystackPayment(state.paystackConfig);

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

  const handleDonateSubmit = async (e) => {
    e.preventDefault();
    if (
      !intent.firstName ||
      !intent.lastName ||
      !intent.email ||
      !intent.phone ||
      !intent.amount
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (intent.paymentMethod === "online") {
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
        if (data.success) {
          dispatch({
            type: "SET_PAYSTACK_CONFIG",
            payload: {
              reference: data.data.payment.reference,
              email: intent.email,
              amount: parseFloat(intent.amount) * 100,
            },
          });
          setTriggerPaystack(true);
        }
      } catch (err) {
        toast.error("Payment initialization failed");
        console.error(err);
      } finally {
        dispatch({ type: "SET_SUBMITTING", payload: false });
      }
    } else {
      dispatch({ type: "SET_POPUP", payload: { show: true, step: "bank" } });
    }
  };

  useEffect(() => {
    if (triggerPaystack) {
      initializePayment(
        (ref) => {
          apiClient.post(`/donations/verify/${ref.reference}`).then(() => {
            dispatch({
              type: "SET_POPUP",
              payload: { show: true, step: "thanks" },
            });
            toast.success("Donation Successful!");
          });
        },
        () => toast("Payment Cancelled")
      );
      setTriggerPaystack(false);
    }
  }, [triggerPaystack, initializePayment]);

  return (
    <div className="bg-paper min-h-screen overflow-hidden selection:bg-primary-100">
      {/* --- LEGENDARY HERO --- */}
      <section className="relative pt-32 pb-32 bg-dark overflow-hidden">
        <div className="scan-line opacity-5" />
        <div className="absolute inset-0 bg-primary-900/5 backdrop-blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-12">
          <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full glass-card-dark border-white/5 text-secondary-500 font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl">
            <Zap className="w-4 h-4 fill-secondary-500 animate-pulse" />
            Empowerment Protocol Activated
          </div>

          <h1 className="text-7xl md:text-[8rem] font-black text-white leading-[0.8] tracking-[-0.05em] animate-fade-in-up">
            Fuel the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-primary-300 text-glow-primary">
              Evolution.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
            We architecturalize futures for the youth of Ibadan. Your liquidity
            is the catalyst for sustainable transformation across communities.
          </p>
        </div>
      </section>

      {/* --- MISSION CONTROL CENTER --- */}
      <section className="relative -mt-24 z-20 px-4 mb-40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Panel: Analytics & Stories */}
          <div className="lg:col-span-4 space-y-10">
            {/* Impact Node Card */}
            <div className="glass-card-premium p-10 rounded-[3.5rem] space-y-8 group hover-scale-subtle transition-all duration-700">
              <div className="flex justify-between border-b border-gray-100 pb-8">
                <div className="h-16 w-16 bg-primary-900 rounded-[1.5rem] flex items-center justify-center text-primary-400">
                  <Globe className="w-8 h-8" />
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Global Status
                  </div>
                  <div className="text-primary-600 font-black text-sm uppercase text-glow-primary">
                    Active
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-black text-dark tracking-tighter">
                    15k+
                  </div>
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Impact Nodes
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-black text-dark tracking-tighter">
                    94%
                  </div>
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Success Rate
                  </div>
                </div>
              </div>
            </div>

            {/* Success Story Preview */}
            <div className="relative group rounded-[3.5rem] overflow-hidden shadow-2xl h-[500px]">
              <img
                src={SUCCESS_STORIES[0].image}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[5s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 space-y-4">
                <div className="inline-block px-4 py-1.5 bg-primary-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                  Impact Log
                </div>
                <h4 className="text-3xl font-black text-white leading-tight">
                  {SUCCESS_STORIES[0].name}
                </h4>
                <p className="text-gray-300 font-medium text-sm line-clamp-2">
                  {SUCCESS_STORIES[0].fullDescription}
                </p>
                <button className="flex items-center gap-2 text-primary-400 font-black text-[10px] uppercase tracking-widest pt-4 group-hover:translate-x-2 transition-transform">
                  View Dossier <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: The Donation Engine */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[4rem] p-10 md:p-16 shadow-[0_100px_100px_-50px_rgba(0,0,0,0.15)] border border-gray-100">
              <form onSubmit={handleDonateSubmit} className="space-y-16">
                {/* 1. Impact Selection */}
                <div className="space-y-10">
                  <div className="flex items-center gap-6">
                    <div className="h-10 w-10 bg-dark text-white rounded-2xl flex items-center justify-center font-black">
                      01
                    </div>
                    <h2 className="text-3xl font-black text-dark tracking-tight">
                      Select Impact Vector
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(DONATION_TYPES).map(([key, value]) => (
                      <label
                        key={key}
                        className={`relative p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-300 ${
                          intent.donationType === key
                            ? "border-primary-600 bg-primary-50/50 shadow-inner"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="donationType"
                          value={key}
                          className="hidden"
                          checked={intent.donationType === key}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_INTENT",
                              payload: { donationType: e.target.value },
                            })
                          }
                        />
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xl font-bold text-dark">
                            {value.label}
                          </span>
                          {intent.donationType === key && (
                            <CheckCircle2 className="w-6 h-6 text-primary-600" />
                          )}
                        </div>
                        <p className="mt-3 text-[10px] text-gray-500 font-black uppercase tracking-wider leading-relaxed">
                          {value.impact}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. Identity Verification */}
                <div className="space-y-10">
                  <div className="flex items-center gap-6">
                    <div className="h-10 w-10 bg-dark text-white rounded-2xl flex items-center justify-center font-black">
                      02
                    </div>
                    <h2 className="text-3xl font-black text-dark tracking-tight">
                      Identity Node
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                      placeholder="Secure Email Agent"
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
                      placeholder="Communication Node"
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

                {/* 3. Transaction Execution */}
                <div className="space-y-10">
                  <div className="flex items-center gap-6">
                    <div className="h-10 w-10 bg-dark text-white rounded-2xl flex items-center justify-center font-black">
                      03
                    </div>
                    <h2 className="text-3xl font-black text-dark tracking-tight">
                      Liquidity Allocation
                    </h2>
                  </div>
                  <div className="space-y-8">
                    <div className="flex flex-wrap gap-4">
                      {SUGGESTED_AMOUNTS.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_INTENT",
                              payload: { amount: amt.toString() },
                            })
                          }
                          className={`px-10 py-5 rounded-[2rem] font-black text-sm transition-all ${
                            intent.amount === amt.toString()
                              ? "bg-dark text-white shadow-xl scale-105"
                              : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          ₦{amt.toLocaleString()}
                        </button>
                      ))}
                    </div>
                    <InputField
                      icon={DollarSign}
                      name="amount"
                      placeholder="Custom Credit Amount"
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
                <div className="space-y-10">
                  <div className="flex items-center gap-6">
                    <div className="h-10 w-10 bg-dark text-white rounded-2xl flex items-center justify-center font-black">
                      04
                    </div>
                    <h2 className="text-3xl font-black text-dark tracking-tight">
                      Transmission Mode
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { id: "online", label: "Instant Card", icon: CreditCard },
                      { id: "bank", label: "Bank Wire", icon: Zap },
                    ].map((mode) => (
                      <label
                        key={mode.id}
                        className={`flex flex-col items-center gap-4 p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all ${
                          intent.paymentMethod === mode.id
                            ? "border-primary-600 bg-primary-50/50"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={mode.id}
                          className="hidden"
                          checked={intent.paymentMethod === mode.id}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_INTENT",
                              payload: { paymentMethod: e.target.value },
                            })
                          }
                        />
                        <mode.icon
                          className={
                            intent.paymentMethod === mode.id
                              ? "text-primary-600"
                              : "text-gray-400"
                          }
                        />
                        <span className="font-black text-sm uppercase tracking-widest">
                          {mode.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-6 h-6 rounded-lg text-primary-600 focus:ring-primary-100 cursor-pointer"
                      checked={intent.agreedToTerms}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_INTENT",
                          payload: { agreedToTerms: e.target.checked },
                        })
                      }
                    />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">
                      Accept Protocol Terms
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={ui.isSubmitting}
                    className="w-full md:w-auto px-16 py-7 bg-primary-600 text-white font-black rounded-[2.5rem] hover:bg-primary-700 hover-scale-subtle shadow-2xl shadow-primary-500/30 disabled:opacity-50 transition-all flex items-center justify-center gap-4"
                  >
                    {ui.isSubmitting ? (
                      <Zap className="animate-spin" />
                    ) : (
                      <CreditCard />
                    )}
                    Finalize Connection
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- POPUPS & MODALS --- */}
      {ui.showPopup && ui.popupStep === "thanks" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-3xl bg-dark/60">
          <div className="glass-card-dark-premium p-16 rounded-[4rem] text-center space-y-10 max-w-xl border-white/10 animate-fade-in-up">
            <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center text-white mx-auto shadow-[0_0_50px_rgba(16,185,129,0.5)]">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-4">
              <h3 className="text-5xl font-black text-white tracking-tight">
                Transmission Complete
              </h3>
              <p className="text-gray-400 font-medium">
                Your donation has been verified. You have successfully
                architecturalized a piece of the future.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-6 bg-white text-dark font-black rounded-[2rem] hover-scale-subtle"
            >
              Return to Command Center
            </button>
          </div>
        </div>
      )}

      {ui.showPopup && ui.popupStep === "bank" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-3xl bg-dark/60">
          <div className="bg-white p-12 rounded-[4rem] space-y-10 max-w-lg w-full relative animate-fade-in-up">
            <button
              onClick={() =>
                dispatch({ type: "SET_POPUP", payload: { show: false } })
              }
              className="absolute top-8 right-8 text-gray-400 hover:text-dark"
            >
              <X size={24} />
            </button>
            <div className="space-y-4 text-center">
              <div className="h-16 w-16 bg-secondary-100 text-secondary-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-4xl font-black text-dark tracking-tight">
                Wire Protocol
              </h3>
              <p className="text-gray-500 font-medium">
                Execute transfer to the official treasury node below.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { label: "Treasury Node", value: BANK_DETAILS.bankName },
                { label: "Account ID", value: BANK_DETAILS.accountName },
                {
                  label: "Liquidity Route",
                  value: BANK_DETAILS.accountNumber,
                  copy: true,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-5 border border-gray-100 rounded-2xl bg-gray-50/50"
                >
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    {item.label}
                  </span>
                  {item.copy ? (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.value);
                        toast.success("Copied!");
                      }}
                      className="flex items-center gap-2 font-black text-primary-700"
                    >
                      {item.value} <Clipboard size={14} />
                    </button>
                  ) : (
                    <span className="font-black text-dark">{item.value}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-primary-50 p-6 rounded-[2rem] flex items-start gap-4">
              <AlertCircle className="text-primary-600 shrink-0 mt-1" />
              <p className="text-xs font-bold text-primary-900 leading-relaxed uppercase tracking-wider">
                Important: After transmission, please send proof of funding to
                our official channel for verification.
              </p>
            </div>

            <button
              onClick={() =>
                dispatch({
                  type: "SET_POPUP",
                  payload: { show: true, step: "thanks" },
                })
              }
              className="w-full py-6 bg-dark text-white font-black rounded-[2rem] shadow-2xl"
            >
              I Have Transferred Liquidity
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donation;
