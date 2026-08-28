import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Copy,
  CheckCircle,
  ShieldCheck,
  Upload,
  CreditCard,
  Building2,
  Loader,
  Check,
} from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import toast from "react-hot-toast";
import apiClient from "../config/apiConfig";

const DonationModal = ({
  isOpen,
  onClose,
  campaign,
  user,
}) => {
  const [paymentMethod, setPaymentMethod] = useState(null); // null, 'card', or 'transfer'
  const [copied, setCopied] = useState({});
  const [donationData, setDonationData] = useState({
    fullName: user?.name || user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    amount: "",
    message: "",
    receipt: null,
  });
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [initializingPayment, setInitializingPayment] = useState(false);
  const [isTransferSubmitting, setIsTransferSubmitting] = useState(false);
  const [donated, setDonated] = useState(null); // { amount, method } when success
  // pendingPayment drives the stale-closure fix:
  // we set config first, flip this flag, then useEffect fires
  // initializePayment *after* React re-renders with the new config.
  const [pendingPayment, setPendingPayment] = useState(false);

  // Paystack configuration
  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";
  const [paystackConfig, setPaystackConfig] = useState({
    reference: "",
    email: donationData.email,
    amount: 0,
    publicKey: paystackPublicKey,
  });

  const initializePayment = usePaystackPayment(paystackConfig);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset state when modal opens
      setPaymentMethod(null);
      setDonationData({
        fullName: user?.name || user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        amount: "",
        message: "",
        receipt: null,
      });
      setReceiptPreview(null);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, user]);

  // Auto-close the success screen after 5 seconds
  useEffect(() => {
    if (!donated) return;
    const timer = setTimeout(() => {
      setDonated(null);
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [donated, onClose]);

  // ── Stale-closure fix ─────────────────────────────────────────────────────
  // React re-renders between the two effects, so by the time this fires,
  // usePaystackPayment already holds the updated config (reference + amount).
  useEffect(() => {
    if (!pendingPayment) return;

    setPendingPayment(false);

    // react-paystack v6: initializePayment takes ONE options object, not two positional args
    initializePayment({
      onSuccess: (_reference) => {
        // ✅ Payment completed — show success screen then close.
        // ❌ Do NOT call /verify here. The webhook is the trusted source.
        const paidAmount = paystackConfig.amount / 100; // convert back from kobo
        setDonated({ amount: paidAmount, method: 'card' });
        setDonationData({
          fullName: user?.name || user?.fullName || "",
          email: user?.email || "",
          phone: user?.phone || "",
          amount: "",
          message: "",
          receipt: null,
        });
        setPaymentMethod(null);
      },
      onClose: () => {
        // Payment popup closed / cancelled by user
        toast("Payment cancelled.");
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPayment]);
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const copyToClipboard = useCallback((text, key) => {
    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [key]: true }));
    toast.success(`${key.replace("-", " ")} copied!`);
    setTimeout(() => setCopied((prev) => ({ ...prev, [key]: false })), 2000);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, files } = e.target;
    if (name === "receipt" && files?.[0]) {
      setDonationData((prev) => ({ ...prev, receipt: files[0] }));
      setReceiptPreview(URL.createObjectURL(files[0]));
    } else {
      setDonationData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Handle card payment with Paystack
  const handleCardPayment = useCallback(async () => {
    if (!donationData.amount || !donationData.email || !donationData.fullName) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(donationData.amount);
    if (isNaN(amount) || amount < 100) {
      toast.error("Minimum donation amount is \u20a6100");
      return;
    }

    setInitializingPayment(true);
    try {
      const payload = {
        campaignId: campaign._id || campaign.id,
        amount: amount,
        email: donationData.email,
        donorInfo: {
          firstName: donationData.fullName.split(" ")[0] || donationData.fullName,
          lastName: donationData.fullName.split(" ").slice(1).join(" ") || "",
          phone: donationData.phone || "",
        },
        paymentMethod: "card",
        message: donationData.message || "",
      };

      const response = await apiClient.post("/donations/initialize", payload);

      if (response.data.success && response.data.data) {
        const paymentData = response.data.data.payment || response.data.data;

        // Update config FIRST, then flip pendingPayment.
        // The useEffect that watches pendingPayment runs AFTER React
        // re-renders with the new config, so usePaystackPayment will
        // hold the correct reference + amount when the popup fires.
        setPaystackConfig({
          reference: paymentData.reference,
          email: donationData.email,
          amount: amount * 100, // Paystack expects amount in kobo
          publicKey: paystackPublicKey,
        });
        setPendingPayment(true); // â† triggers the useEffect after re-render
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error(
        error.response?.data?.message || "Failed to initialize payment"
      );
    } finally {
      setInitializingPayment(false);
    }
  }, [donationData, campaign, paystackPublicKey, user]);


  // Handle bank transfer submission
  // Posts directly to /donations/submit-manual as multipart FormData
  // so the receipt file is correctly uploaded to Cloudinary by the backend.
  const handleTransferSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (
        !donationData.amount ||
        !donationData.receipt ||
        !donationData.fullName ||
        !donationData.email
      ) {
        toast.error("Please fill all required fields and upload receipt");
        return;
      }

      const formData = new FormData();
      formData.append("campaignId", campaign._id || campaign.id);
      formData.append("amount", donationData.amount);
      formData.append("email", donationData.email);
      formData.append("donorInfo[firstName]", donationData.fullName.split(" ")[0] || donationData.fullName);
      formData.append("donorInfo[lastName]", donationData.fullName.split(" ").slice(1).join(" ") || "");
      formData.append("donorInfo[phone]", donationData.phone || "");
      formData.append("message", donationData.message || "");
      formData.append("receipt", donationData.receipt); // File â†’ Cloudinary via backend

      setIsTransferSubmitting(true);
      try {
        await apiClient.post("/donations/submit-manual", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Donation submitted! We'll verify your transfer shortly.");
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to submit donation"
        );
        return; // Don't close/reset on error
      } finally {
        setIsTransferSubmitting(false);
      }

      setDonationData({
        fullName: user?.name || user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        amount: "",
        message: "",
        receipt: null,
      });
      setReceiptPreview(null);
      setPaymentMethod(null);
      // Show the thank-you screen instead of closing immediately
      setDonated({ amount: parseFloat(donationData.amount), method: 'bank_transfer' });
    },
    [donationData, user, campaign, onClose]
  );


  // Bank details (you can make this dynamic from backend)
  const bankDetails = {
    bankName: campaign.bankDetails?.bankName || "First Bank of Nigeria",
    accountName: campaign.bankDetails?.accountName || "Sabo Ibadan Youth Charity Foundation",
    accountNumber: campaign.bankDetails?.accountNumber || "2034567890",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={donated ? undefined : onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* â”€â”€ Success screen â”€â”€ */}
        {donated && (
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
            {/* Animated checkmark */}
            <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-6 animate-bounce-once">
              <CheckCircle size={52} className="text-emerald-500" strokeWidth={1.5} />
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
              Thank you! 🌟
            </h2>

            <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
              {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(donated.amount)}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
              Your generous donation to{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">{campaign?.title}</span>{" "}
              has been received.
            </p>

            {donated.method === 'bank_transfer' ? (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-5 py-4 mb-8 max-w-xs text-left">
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
                  Pending Review
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-300">
                  Our team will verify your bank transfer and confirm your donation within 24â€“48 hours. You'll receive an email once it's approved.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-5 py-4 mb-8 max-w-xs text-left">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
                  Payment Confirmed
                </p>
                <p className="text-sm text-emerald-600 dark:text-emerald-300">
                  Your payment was successful! A receipt will be emailed to you shortly once the transaction is fully verified.
                </p>
              </div>
            )}

            <button
              onClick={() => { setDonated(null); onClose(); }}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              Done
            </button>
            <p className="text-xs text-gray-400 mt-3">This window closes automatically in a few seconds.</p>
          </div>
        )}


        {/* â”€â”€ Normal modal content (hidden while success screen is shown) â”€â”€ */}
        {!donated && (
          <>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Make a Donation
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Step 1: Choose Payment Method */}
          {!paymentMethod && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Choose Payment Method
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select how you'd like to make your donation
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card Payment Option */}
                <button
                  onClick={() => setPaymentMethod("card")}
                  className="group relative p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-lg bg-white dark:bg-gray-800"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                      <CreditCard className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                        Pay with Card
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Secure payment via Paystack
                      </p>
                    </div>
                  </div>
                </button>

                {/* Bank Transfer Option */}
                <button
                  onClick={() => setPaymentMethod("transfer")}
                  className="group relative p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:shadow-lg bg-white dark:bg-gray-800"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                      <Building2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                        Bank Transfer
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Transfer to our bank account
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Card Payment Form */}
          {paymentMethod === "card" && (
            <div className="space-y-5">
              {/* Back */}
              <button
                onClick={() => setPaymentMethod(null)}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <X size={14} />
                Back to payment methods
              </button>

              {/* ── Paystack Payment Card Widget ── */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-800 to-purple-900 p-6 shadow-xl shadow-purple-900/30">
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/5 rounded-full" />
                <div className="absolute -bottom-10 -left-6 w-48 h-48 bg-white/5 rounded-full" />

                <div className="relative z-10">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <p className="text-purple-300/70 text-xs font-medium uppercase tracking-widest mb-1">Secure Card Payment</p>
                      <p className="text-white font-bold text-base">Powered by Paystack</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5">
                      <ShieldCheck size={14} className="text-green-400" />
                      <span className="text-white text-xs font-bold tracking-wider">SSL Secured</span>
                    </div>
                  </div>

                  {/* Amount display */}
                  <div className="mb-5">
                    <p className="text-purple-300/70 text-xs font-medium uppercase tracking-widest mb-2">Donation Amount</p>
                    <p className="text-white font-mono text-3xl font-bold">
                      {donationData.amount
                        ? new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(donationData.amount)
                        : "₦ —"}
                    </p>
                  </div>

                  {/* Accepted cards row */}
                  <div className="flex items-center gap-2">
                    <p className="text-purple-300/70 text-xs font-medium uppercase tracking-widest">Accepted:</p>
                    {["Visa", "Mastercard", "Verve"].map((card) => (
                      <span key={card} className="bg-white/15 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                        {card}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Trust badges ── */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: ShieldCheck, label: "Paystack Secured", color: "text-emerald-500" },
                  { icon: CreditCard, label: "Card not stored", color: "text-blue-500" },
                  { icon: CheckCircle, label: "Instant receipt", color: "text-purple-500" },
                ].map(({ icon: Icon, label, color }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center text-center gap-1.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3 border border-gray-200 dark:border-gray-700"
                  >
                    <Icon size={18} className={color} />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              {/* ── Form ── */}
              <form
                onSubmit={(e) => { e.preventDefault(); handleCardPayment(); }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="card-fullName" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="card-fullName"
                      type="text"
                      name="fullName"
                      value={donationData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Abubakar Mukhtar"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white transition-all text-sm placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="card-email" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="card-email"
                      type="email"
                      name="email"
                      value={donationData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white transition-all text-sm placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="card-phone" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 select-none pointer-events-none">
                      🇳🇬 +234
                    </span>
                    <input
                      id="card-phone"
                      type="tel"
                      name="phone"
                      value={donationData.phone}
                      onChange={handleInputChange}
                      placeholder="80x xxx xxxx"
                      className="w-full pl-24 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white transition-all text-sm placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Donation Amount <span className="text-red-500">*</span>
                  </label>
                  {/* Quick amounts */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[1000, 5000, 10000, 50000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleInputChange({ target: { name: "amount", value: amt } })}
                        className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                          Number(donationData.amount) === amt
                            ? "border-purple-600 bg-purple-600 text-white shadow-md shadow-purple-500/20"
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-400 dark:hover:border-purple-600 bg-white dark:bg-gray-800"
                        }`}
                      >
                        ₦{(amt / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                  {/* Custom amount */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-purple-600 dark:text-purple-400 pointer-events-none select-none">₦</span>
                    <input
                      id="card-amount"
                      type="number"
                      name="amount"
                      value={donationData.amount}
                      onChange={handleInputChange}
                      required
                      min="100"
                      placeholder="Enter custom amount"
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white transition-all text-sm font-semibold placeholder-gray-400"
                    />
                    {donationData.amount && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-purple-600 dark:text-purple-400 pointer-events-none">
                        {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(donationData.amount)}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="card-message" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Message of Support <span className="text-gray-400 font-normal normal-case">(Optional)</span>
                  </label>
                  <textarea
                    id="card-message"
                    name="message"
                    value={donationData.message}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Share why you're supporting this cause..."
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white transition-all text-sm resize-none placeholder-gray-400"
                  />
                </div>

                {/* ── Submit ── */}
                <button
                  type="submit"
                  disabled={initializingPayment}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  {initializingPayment ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Connecting to Paystack...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      Pay Securely
                      {donationData.amount ? ` — ${new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(donationData.amount)}` : ""}
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  Your card details are never stored. Secured by Paystack.
                </p>
              </form>
            </div>
          )}

          {/* Step 2: Bank Transfer Details */}
          {paymentMethod === "transfer" && (
            <div className="space-y-5">
              {/* Back */}
              <button
                onClick={() => setPaymentMethod(null)}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <X size={14} />
                Back to payment methods
              </button>

              {/* â”€â”€ Bank Card Widget â”€â”€ */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 p-6 shadow-xl shadow-emerald-900/30">
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-36 h-36 bg-white/5 rounded-full" />
                <div className="absolute -bottom-10 -left-6 w-48 h-48 bg-white/5 rounded-full" />

                <div className="relative z-10">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <p className="text-emerald-300/70 text-xs font-medium uppercase tracking-widest mb-1">Foundation Account</p>
                      <p className="text-white font-bold text-base">{bankDetails.bankName}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5">
                      <span className="text-white text-xs font-bold tracking-wider">NGN</span>
                    </div>
                  </div>

                  {/* Account number â€” styled like a card number */}
                  <div className="mb-5">
                    <p className="text-emerald-300/70 text-xs font-medium uppercase tracking-widest mb-2">Account Number</p>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-mono text-2xl font-bold tracking-[0.25em]">
                        {bankDetails.accountNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
                      </p>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(bankDetails.accountNumber, "account-number")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          copied["account-number"]
                            ? "bg-emerald-400/30 text-emerald-200"
                            : "bg-white/15 text-white hover:bg-white/25"
                        }`}
                      >
                        {copied["account-number"] ? <><CheckCircle size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                      </button>
                    </div>
                  </div>

                  {/* Account name */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-300/70 text-xs font-medium uppercase tracking-widest mb-1">Account Name</p>
                      <p className="text-white font-semibold text-sm">{bankDetails.accountName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(bankDetails.accountName, "account-name")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        copied["account-name"]
                          ? "bg-emerald-400/30 text-emerald-200"
                          : "bg-white/15 text-white hover:bg-white/25"
                      }`}
                    >
                      {copied["account-name"] ? <><CheckCircle size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                    </button>
                  </div>
                </div>
              </div>

              {/* â”€â”€ Step strip â”€â”€ */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { n: "1", label: "Copy account details above" },
                  { n: "2", label: "Make transfer in your banking app" },
                  { n: "3", label: "Upload receipt below" },
                ].map(({ n, label }) => (
                  <div
                    key={n}
                    className="flex flex-col items-center text-center gap-2 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3 border border-gray-200 dark:border-gray-700"
                  >
                    <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0">
                      {n}
                    </span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              {/* â”€â”€ Form â”€â”€ */}
              <form onSubmit={handleTransferSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="transfer-fullName" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="transfer-fullName"
                      type="text"
                      name="fullName"
                      value={donationData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. Abubakar Mukhtar"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-all text-sm placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="transfer-email" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="transfer-email"
                      type="email"
                      name="email"
                      value={donationData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-all text-sm placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="transfer-phone" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 select-none pointer-events-none">
                      🇳🇬 +234
                    </span>
                    <input
                      id="transfer-phone"
                      type="tel"
                      name="phone"
                      value={donationData.phone}
                      onChange={handleInputChange}
                      placeholder="80x xxx xxxx"
                      className="w-full pl-24 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-all text-sm placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Amount Transferred <span className="text-red-500">*</span>
                  </label>
                  {/* Quick amounts */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[1000, 5000, 10000, 50000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleInputChange({ target: { name: "amount", value: amt } })}
                        className={`py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                          Number(donationData.amount) === amt
                            ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                            : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-emerald-400 dark:hover:border-emerald-600 bg-white dark:bg-gray-800"
                        }`}
                      >
                        ₦{(amt / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                  {/* Custom amount */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-emerald-600 dark:text-emerald-400 pointer-events-none select-none">₦</span>
                    <input
                      id="transfer-amount"
                      type="number"
                      name="amount"
                      value={donationData.amount}
                      onChange={handleInputChange}
                      required
                      min="100"
                      placeholder="Enter custom amount"
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-all text-sm font-semibold placeholder-gray-400"
                    />
                    {donationData.amount && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 pointer-events-none">
                        {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(donationData.amount)}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="transfer-message" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Message of Support <span className="text-gray-400 font-normal normal-case">(Optional)</span>
                  </label>
                  <textarea
                    id="transfer-message"
                    name="message"
                    value={donationData.message}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Share why you're supporting this cause..."
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-all text-sm resize-none placeholder-gray-400"
                  />
                </div>

                {/* â”€â”€ Receipt Upload â”€â”€ */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    Payment Receipt <span className="text-red-500">*</span>
                  </label>

                  {receiptPreview ? (
                    /* â”€â”€ Preview â”€â”€ */
                    <div className="border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-emerald-200 dark:border-emerald-700 flex-shrink-0 bg-white">
                        <img src={receiptPreview} alt="Receipt" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{donationData.receipt?.name}</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                          <CheckCircle size={12} /> Receipt ready for upload
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDonationData((prev) => ({ ...prev, receipt: null }));
                          setReceiptPreview(null);
                        }}
                        className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    /* â”€â”€ Drop Zone â”€â”€ */
                    <label
                      htmlFor="receipt-upload"
                      className="cursor-pointer block border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-xl p-6 text-center transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3 transition-colors">
                        <Upload size={22} className="text-gray-400 group-hover:text-emerald-500 transition-colors" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1">
                        Click to upload your receipt
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Screenshot or photo â€” PNG, JPG, PDF · Max 10MB
                      </p>
                      <input
                        id="receipt-upload"
                        name="receipt"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleInputChange}
                        className="hidden"
                        required
                      />
                    </label>
                  )}
                </div>

                {/* â”€â”€ Submit â”€â”€ */}
                <button
                  type="submit"
                  disabled={isTransferSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] flex items-center justify-center gap-2"
                >
                  {isTransferSubmitting ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Submitting your donation...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Submit Donation
                      {donationData.amount ? ` â€” ${new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(donationData.amount)}` : ""}
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>{/* end p-6 */}
          </>
        )}{/* end !donated */}
      </div>{/* end modal card */}
    </div>
  );
};

export default DonationModal;

