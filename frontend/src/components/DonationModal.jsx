import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  Copy,
  CheckCircle,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Building2,
  Loader,
  Clock,
  AlertCircle,
  Clipboard,
} from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import toast from "react-hot-toast";
import apiClient from "../config/apiConfig";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(n);

const formatTimer = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// ─── component ────────────────────────────────────────────────────────────────
const DonationModal = ({ isOpen, onClose, campaign, user }) => {
  /* ── step: null | "card" | "transfer" ── */
  const [step, setStep] = useState(null);
  const [donated, setDonated] = useState(null); // { amount } when success

  /* ── shared form fields ── */
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    amount: "",
    message: "",
  });

  /* ── card payment ── */
  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";
  const [paystackConfig, setPaystackConfig] = useState({
    reference: "",
    email: "",
    amount: 0,
    publicKey: paystackPublicKey,
  });
  const initializePayment = usePaystackPayment(paystackConfig);
  const [pendingPayment, setPendingPayment] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);

  /* ── bank transfer ── */
  const [transferRef, setTransferRef] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [transferExpiry, setTransferExpiry] = useState(null);
  const [bankTimer, setBankTimer] = useState(0);
  const [transferLoading, setTransferLoading] = useState(false);  // init loading
  const [checkingTransfer, setCheckingTransfer] = useState(false); // "I've transferred" loading
  const [transferNotFound, setTransferNotFound] = useState(false);
  const bankTimerRef = useRef(null);

  // ── Fallback bank details (overridden by server response) ──
  const BANK_DETAILS = {
    bankName: campaign?.bankDetails?.bankName || "First Bank of Nigeria",
    accountName:
      campaign?.bankDetails?.accountName ||
      "Sabo Ibadan Youth Charity Foundation",
    accountNumber: campaign?.bankDetails?.accountNumber || "1234567890",
  };

  /* ── reset on open/close ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStep(null);
      setDonated(null);
      setTransferRef(null);
      setAccountDetails(null);
      setTransferExpiry(null);
      setBankTimer(0);
      setTransferNotFound(false);
      setForm({
        fullName: user?.fullName || user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        amount: "",
        message: "",
      });
    } else {
      document.body.style.overflow = "unset";
      clearInterval(bankTimerRef.current);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, user]);

  /* ── auto-close success after 5s ── */
  useEffect(() => {
    if (!donated) return;
    const t = setTimeout(() => { setDonated(null); onClose(); }, 5000);
    return () => clearTimeout(t);
  }, [donated, onClose]);

  /* ── 30-min countdown tick ── */
  useEffect(() => {
    if (!transferExpiry) return;
    const tick = () =>
      setBankTimer(Math.max(0, Math.ceil((transferExpiry - Date.now()) / 1000)));
    tick();
    bankTimerRef.current = setInterval(tick, 1000);
    return () => clearInterval(bankTimerRef.current);
  }, [transferExpiry]);

  /* ── stale-closure fix for Paystack popup ── */
  useEffect(() => {
    if (!pendingPayment) return;
    setPendingPayment(false);
    initializePayment({
      onSuccess: () => {
        setDonated({ amount: paystackConfig.amount / 100, method: "card" });
        setStep(null);
      },
      onClose: () => toast("Payment cancelled."),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPayment]);

  /* ── input handler ── */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }, []);

  /* ── copy helper ── */
  const copy = useCallback((text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  }, []);

  /* ── Card: initialize Paystack ── */
  const handleCardSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!form.fullName || !form.email || !form.amount) {
        toast.error("Please fill all required fields");
        return;
      }
      const amount = parseFloat(form.amount);
      if (isNaN(amount) || amount < 100) {
        toast.error("Minimum donation amount is ₦100");
        return;
      }
      setCardLoading(true);
      try {
        const { data } = await apiClient.post("/donations/initialize", {
          campaignId: campaign._id || campaign.id,
          amount,
          email: form.email,
          donorInfo: {
            firstName: form.fullName.split(" ")[0],
            lastName: form.fullName.split(" ").slice(1).join(" "),
            phone: form.phone,
          },
          paymentMethod: "card",
          message: form.message,
        });
        const paymentData = data.data?.payment || data.data;
        setPaystackConfig({
          reference: paymentData.reference,
          email: form.email,
          amount: amount * 100,
          publicKey: paystackPublicKey,
        });
        setPendingPayment(true);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to initialize payment");
      } finally {
        setCardLoading(false);
      }
    },
    [form, campaign, paystackPublicKey]
  );

  /* ── Bank Transfer: initialize session ── */
  const handleStartTransfer = useCallback(async () => {
    if (!form.fullName || !form.email || !form.amount) {
      toast.error("Please fill your name, email and amount first");
      return;
    }
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount < 100) {
      toast.error("Minimum donation amount is ₦100");
      return;
    }
    setTransferLoading(true);
    setTransferNotFound(false);
    try {
      const { data } = await apiClient.post("/donations/initialize-transfer", {
        campaignId: campaign._id || campaign.id,
        amount,
        email: form.email,
        donorInfo: {
          firstName: form.fullName.split(" ")[0],
          lastName: form.fullName.split(" ").slice(1).join(" "),
          phone: form.phone,
        },
      });
      const payment = data.data?.payment;
      setTransferRef(payment?.reference || `SCF-${Date.now().toString(36).toUpperCase()}`);
      if (payment?.accountDetails) setAccountDetails(payment.accountDetails);
    } catch {
      setTransferRef(`SCF-${Date.now().toString(36).toUpperCase()}`);
    } finally {
      setTransferExpiry(Date.now() + 30 * 60 * 1000);
      setTransferLoading(false);
    }
  }, [form, campaign]);

  /* ── Bank Transfer: "I've Transferred the Money" ── */
  const handleIveTransferred = useCallback(async () => {
    if (bankTimer === 0 || !transferRef) return;
    setCheckingTransfer(true);
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
            data.data?.status === "completed" ||
            data.data?.approvalStatus === "approved"
          ) {
            verified = true;
            break;
          }
        } catch {
          /* continue */
        }
      }
      if (verified) {
        toast.success("Transfer confirmed! Thank you! 🎉");
        setDonated({ amount: parseFloat(form.amount), method: "bank_transfer" });
        setStep(null);
      } else {
        setTransferNotFound(true);
      }
    } finally {
      setCheckingTransfer(false);
    }
  }, [bankTimer, transferRef, form.amount]);

  if (!isOpen) return null;

  const bank = {
    bankName: accountDetails?.bankName || BANK_DETAILS.bankName,
    accountName: accountDetails?.accountName || BANK_DETAILS.accountName,
    accountNumber: accountDetails?.accountNumber || BANK_DETAILS.accountNumber,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl">

        {/* ── SUCCESS SCREEN ── */}
        {donated && (
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
              <CheckCircle2 size={52} className="text-emerald-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
              Thank you! 🌟
            </h2>
            <p className="text-lg font-semibold text-emerald-600 mb-1">{fmt(donated.amount)}</p>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              Your generous donation to{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {campaign?.title}
              </span>{" "}
              has been received.
            </p>
            {donated.method === "bank_transfer" ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-8 max-w-xs text-left">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                  Pending Review
                </p>
                <p className="text-sm text-amber-600">
                  Our team will verify your bank transfer within 24–48 hours and send a confirmation email.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 mb-8 max-w-xs text-left">
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                  Payment Confirmed
                </p>
                <p className="text-sm text-emerald-600">
                  Your payment was successful! A receipt will be emailed to you shortly.
                </p>
              </div>
            )}
            <button
              onClick={() => { setDonated(null); onClose(); }}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all"
            >
              Done
            </button>
            <p className="text-xs text-gray-400 mt-3">
              This window closes automatically in a few seconds.
            </p>
          </div>
        )}

        {/* ── NORMAL CONTENT ── */}
        {!donated && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <div className="flex items-center gap-3">
                {step && (
                  <button
                    onClick={() => {
                      setStep(null);
                      setTransferRef(null);
                      setTransferExpiry(null);
                      setBankTimer(0);
                      setTransferNotFound(false);
                      clearInterval(bankTimerRef.current);
                    }}
                    className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    <span className="text-lg leading-none">←</span> Back
                  </button>
                )}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {step === "card"
                    ? "Pay with Card"
                    : step === "transfer"
                    ? "Bank Transfer"
                    : "Make a Donation"}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* ─── STEP 1: Choose method ─────────────────────────────── */}
              {!step && (
                <>
                  <p className="text-sm text-gray-500 text-center">
                    How would you like to donate?
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Card */}
                    <button
                      onClick={() => setStep("card")}
                      className="group p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-lg transition-all bg-white dark:bg-gray-800 flex flex-col items-center gap-3"
                    >
                      <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                        <CreditCard className="w-7 h-7 text-indigo-600" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-gray-900 dark:text-white">Pay with Card</p>
                        <p className="text-xs text-gray-400 mt-0.5">Instant · Secure · Paystack</p>
                      </div>
                    </button>

                    {/* Transfer */}
                    <button
                      onClick={() => setStep("transfer")}
                      className="group p-6 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:shadow-lg transition-all bg-white dark:bg-gray-800 flex flex-col items-center gap-3"
                    >
                      <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                        <Building2 className="w-7 h-7 text-emerald-600" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-gray-900 dark:text-white">Transfer to Us</p>
                        <p className="text-xs text-gray-400 mt-0.5">Bank Transfer</p>
                      </div>
                    </button>
                  </div>
                </>
              )}

              {/* ─── STEP 2a: Card payment ─────────────────────────────── */}
              {step === "card" && (
                <form onSubmit={handleCardSubmit} className="space-y-4">
                  {/* Paystack card widget */}
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-800 to-purple-900 p-6 shadow-xl">
                    <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/5 rounded-full" />
                    <div className="absolute -bottom-10 -left-6 w-48 h-48 bg-white/5 rounded-full" />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <p className="text-purple-300/70 text-xs font-medium uppercase tracking-widest mb-1">
                            Secure Card Payment
                          </p>
                          <p className="text-white font-bold">Powered by Paystack</p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-1.5">
                          <ShieldCheck size={14} className="text-green-400" />
                          <span className="text-white text-xs font-bold">SSL Secured</span>
                        </div>
                      </div>
                      <p className="text-purple-300/70 text-xs uppercase tracking-widest mb-1">
                        Donation Amount
                      </p>
                      <p className="text-white font-mono text-3xl font-bold">
                        {form.amount ? fmt(form.amount) : "₦ —"}
                      </p>
                    </div>
                  </div>

                  {/* Fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Abubakar Mukhtar"
                        className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      />
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {[1000, 5000, 10000, 50000].map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, amount: a }))}
                          className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                            Number(form.amount) === a
                              ? "border-purple-600 bg-purple-600 text-white"
                              : "border-gray-200 text-gray-600 hover:border-purple-300"
                          }`}
                        >
                          ₦{(a / 1000).toFixed(0)}k
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-purple-600">₦</span>
                      <input
                        name="amount"
                        type="number"
                        min="100"
                        value={form.amount}
                        onChange={handleChange}
                        required
                        placeholder="Custom amount"
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-sm font-semibold dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={cardLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {cardLoading ? (
                      <><Loader className="animate-spin" size={18} /> Connecting to Paystack...</>
                    ) : (
                      <><ShieldCheck size={18} /> Pay Securely{form.amount ? ` — ${fmt(form.amount)}` : ""}</>
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    Your card details are never stored.
                  </p>
                </form>
              )}

              {/* ─── STEP 2b: Bank Transfer ────────────────────────────── */}
              {step === "transfer" && (
                <div className="space-y-5">

                  {/* === PRE-INIT: collect amount + contact info === */}
                  {!transferRef && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500 text-center">
                        Enter your details and amount, then we'll show you the account to transfer to.
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                            placeholder="Abubakar Mukhtar"
                            className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-sm dark:bg-gray-800 dark:text-white dark:border-gray-700"
                          />
                        </div>
                      </div>

                      {/* Amount */}
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                          Amount to Transfer <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-4 gap-2 mb-2">
                          {[1000, 5000, 10000, 50000].map((a) => (
                            <button
                              key={a}
                              type="button"
                              onClick={() => setForm((p) => ({ ...p, amount: a }))}
                              className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                                Number(form.amount) === a
                                  ? "border-emerald-600 bg-emerald-600 text-white"
                                  : "border-gray-200 text-gray-600 hover:border-emerald-400"
                              }`}
                            >
                              ₦{(a / 1000).toFixed(0)}k
                            </button>
                          ))}
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-emerald-600">₦</span>
                          <input
                            name="amount"
                            type="number"
                            min="100"
                            value={form.amount}
                            onChange={handleChange}
                            placeholder="Enter custom amount"
                            className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 text-sm font-semibold dark:bg-gray-800 dark:text-white dark:border-gray-700"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleStartTransfer}
                        disabled={transferLoading}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                      >
                        {transferLoading ? (
                          <><Loader className="animate-spin" size={18} /> Getting account details...</>
                        ) : (
                          <><Building2 size={18} /> Get Foundation Account Details</>
                        )}
                      </button>
                    </div>
                  )}

                  {/* === POST-INIT: show timer + account details + CTA === */}
                  {transferRef && (
                    <div className="space-y-4">

                      {/* Timer bar */}
                      <div className="h-1.5 bg-gray-100 rounded-full w-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            bankTimer < 300 ? "bg-red-500" : bankTimer < 600 ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${(bankTimer / (30 * 60)) * 100}%` }}
                        />
                      </div>

                      {/* Session expired */}
                      {bankTimer === 0 ? (
                        <div className="text-center py-8 space-y-4">
                          <div className="w-16 h-16 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center mx-auto">
                            <AlertCircle size={32} className="text-red-500" />
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-gray-900 mb-1">Session Expired</h4>
                            <p className="text-gray-500 text-sm">
                              The 30-minute window has closed. Please start a new transfer.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setTransferRef(null);
                              setTransferExpiry(null);
                              setBankTimer(0);
                              setTransferNotFound(false);
                              clearInterval(bankTimerRef.current);
                            }}
                            className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-700 transition-all"
                          >
                            Try Again
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* Countdown row */}
                          <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
                            bankTimer < 300
                              ? "bg-red-50 border-red-200"
                              : bankTimer < 600
                              ? "bg-amber-50 border-amber-200"
                              : "bg-gray-50 border-gray-200"
                          }`}>
                            <div className="flex items-center gap-2">
                              <Clock size={15} className={bankTimer < 300 ? "text-red-500" : bankTimer < 600 ? "text-amber-600" : "text-gray-400"} />
                              <span className={`text-xs font-bold uppercase tracking-wider ${bankTimer < 300 ? "text-red-500" : bankTimer < 600 ? "text-amber-600" : "text-gray-500"}`}>
                                Session expires in
                              </span>
                            </div>
                            <span className={`text-2xl font-black tabular-nums ${bankTimer < 300 ? "text-red-600" : bankTimer < 600 ? "text-amber-700" : "text-gray-800"}`}>
                              {formatTimer(bankTimer)}
                            </span>
                          </div>

                          {/* Amount highlight */}
                          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-5 text-center">
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">
                              Transfer Exactly This Amount
                            </p>
                            <p className="text-4xl font-black text-emerald-700">
                              {fmt(form.amount || 0)}
                            </p>
                          </div>

                          {/* Account card */}
                          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 p-6 shadow-xl">
                            <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/5 rounded-full" />
                            <div className="absolute -bottom-8 -left-4 w-36 h-36 bg-white/5 rounded-full" />
                            <div className="relative z-10 space-y-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-emerald-300/70 text-[10px] font-bold uppercase tracking-widest mb-0.5">
                                    Foundation Account
                                  </p>
                                  <p className="text-white font-bold">{bank.bankName}</p>
                                </div>
                                <span className="bg-white/15 text-white text-xs font-bold px-3 py-1.5 rounded-lg">NGN</span>
                              </div>

                              {/* Account number */}
                              <div>
                                <p className="text-emerald-300/70 text-[10px] font-bold uppercase tracking-widest mb-1">
                                  Account Number
                                </p>
                                <div className="flex items-center justify-between">
                                  <p className="text-white font-mono text-2xl font-bold tracking-widest">
                                    {bank.accountNumber.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")}
                                  </p>
                                  <button
                                    onClick={() => copy(bank.accountNumber, "Account Number")}
                                    className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                                  >
                                    <Copy size={12} /> Copy
                                  </button>
                                </div>
                              </div>

                              {/* Account name */}
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-emerald-300/70 text-[10px] font-bold uppercase tracking-widest mb-0.5">
                                    Account Name
                                  </p>
                                  <p className="text-white font-semibold text-sm">{bank.accountName}</p>
                                </div>
                                <button
                                  onClick={() => copy(bank.accountName, "Account Name")}
                                  className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
                                >
                                  <Copy size={12} /> Copy
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Reference row */}
                          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl">
                            <div>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                Narration / Reference
                              </p>
                              <p className="text-sm font-bold text-gray-800 mt-0.5">{transferRef}</p>
                            </div>
                            <button
                              onClick={() => copy(transferRef, "Reference")}
                              className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
                            >
                              <Clipboard size={14} /> Copy
                            </button>
                          </div>

                          {/* "Not received" alert */}
                          {transferNotFound && (
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
                              <AlertCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-black text-orange-800 mb-0.5">
                                  Transfer Not Received Yet
                                </p>
                                <p className="text-xs text-orange-700 leading-relaxed">
                                  We are still waiting for your transfer to this account. If you've already transferred, please wait a few minutes and try again.
                                </p>
                              </div>
                            </div>
                          )}

                          {/* "I've Transferred" CTA */}
                          <button
                            onClick={handleIveTransferred}
                            disabled={checkingTransfer}
                            className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-60 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
                          >
                            {checkingTransfer ? (
                              <><Loader size={18} className="animate-spin" /> Checking your transfer…</>
                            ) : (
                              <><CheckCircle2 size={18} /> I've Transferred the Money</>
                            )}
                          </button>

                          <p className="text-center text-xs text-gray-400">
                            Include the reference in your transfer narration for faster confirmation.
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DonationModal;
