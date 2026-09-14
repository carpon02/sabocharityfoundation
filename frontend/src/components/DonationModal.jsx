import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Copy,
  CheckCircle,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Loader,
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


// ─── component ────────────────────────────────────────────────────────────────
const DonationModal = ({ isOpen, onClose, campaign, user }) => {
  const [donated, setDonated] = useState(null);   // { amount, method } on success
  const [verifying, setVerifying] = useState(false); // true while backend verify runs

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


  /* ── reset on open/close ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setDonated(null);
      setVerifying(false);
      setForm({
        fullName: user?.fullName || user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        amount: "",
        message: "",
      });
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, user]);


  /* ── stale-closure fix for Paystack popup ── */
  useEffect(() => {
    if (!pendingPayment) return;
    setPendingPayment(false);
    initializePayment({
      onSuccess: async (response) => {
        // Show processing screen immediately
        setVerifying(true);
        try {
          const ref = response?.reference || paystackConfig.reference;
          await apiClient.post(`/donations/verify/${ref}`);
        } catch (err) {
          // Non-fatal: webhook may handle it. Success screen still shows.
          console.warn('Client-side verify call failed (webhook may handle it):', err?.response?.data?.message || err.message);
        }
        setVerifying(false);
        setDonated({ amount: paystackConfig.amount / 100, method: 'card' });
      },
      onClose: () => toast('Payment cancelled.'),
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


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop — blocked while verifying so donor can't accidentally dismiss */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={!verifying && !donated ? onClose : undefined}
      />

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl">

        {/* ── PROCESSING / VERIFYING SCREEN ── */}
        {verifying && (
          <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
            {/* Animated ring */}
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck size={32} className="text-indigo-500" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
              Confirming your donation…
            </h2>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Please wait while we securely verify your payment with Paystack.
              This usually takes a few seconds.
            </p>
            <div className="mt-8 flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {/* ── SUCCESS SCREEN ── */}
        {donated && !verifying && (
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
            {/* Animated checkmark */}
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-25" />
              <div className="relative w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 size={52} className="text-emerald-500" strokeWidth={1.5} />
              </div>
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
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4 mb-8 max-w-xs text-left">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                Donation Confirmed
              </p>
              <p className="text-sm text-emerald-600">
                Your donation has been received and confirmed. Thank you!
                A receipt will be emailed to you shortly.
              </p>
            </div>
            <button
              onClick={() => { setDonated(null); onClose(); }}
              className="px-10 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg"
            >
              Done
            </button>
          </div>
        )}

        {/* ── FORM ── */}
        {!donated && !verifying && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Make a Donation
              </h2>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Paystack-powered note */}
              <p className="text-xs text-center text-gray-400">
                Payments are processed securely by{" "}
                <span className="font-semibold text-gray-600 dark:text-gray-300">Paystack</span>.
                Card, bank transfer, and USSD are all supported inside the checkout.
              </p>

              {/* ─── Card payment form ─────────────────────────────────── */}
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
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DonationModal;
