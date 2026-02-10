import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  DollarSign,
  Copy,
  AlertCircle,
  CheckCircle,
  Upload,
  CreditCard,
  Building2,
  Loader,
} from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import toast from "react-hot-toast";
import apiClient from "../config/apiConfig";

const DonationModal = ({
  isOpen,
  onClose,
  campaign,
  user,
  onSubmitDonation,
  isSubmitting,
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
      toast.error("Minimum donation amount is ₦100");
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
        
        setPaystackConfig({
          reference: paymentData.reference,
          email: donationData.email,
          amount: amount * 100, // Paystack expects amount in kobo
          publicKey: paystackPublicKey,
        });

        // Trigger Paystack popup
        initializePayment(
          (reference) => {
            // Payment successful
            toast.success("Payment successful! Verifying...");
            // Verify payment
            apiClient
              .post(`/donations/verify/${reference.reference}`)
              .then((verifyResponse) => {
                if (verifyResponse.data.success) {
                  toast.success("Donation completed successfully!");
                  onClose();
                  // Reset form
                  setDonationData({
                    fullName: user?.name || user?.fullName || "",
                    email: user?.email || "",
                    phone: user?.phone || "",
                    amount: "",
                    message: "",
                    receipt: null,
                  });
                  setPaymentMethod(null);
                }
              })
              .catch((error) => {
                console.error("Verification error:", error);
                toast.error("Payment verification failed. Please contact support.");
              });
          },
          () => {
            // Payment cancelled
            toast("Payment cancelled");
          }
        );
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error(
        error.response?.data?.message || "Failed to initialize payment"
      );
    } finally {
      setInitializingPayment(false);
    }
  }, [donationData, campaign, paystackPublicKey, initializePayment, user, onClose]);

  // Handle bank transfer submission
  const handleTransferSubmit = useCallback(
    (e) => {
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

      onSubmitDonation({
        userId: user?.id || user?._id || "guest",
        campaignId: campaign._id || campaign.id,
        ...donationData,
        paymentMethod: "bank-transfer",
      });

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
      onClose();
    },
    [donationData, user, campaign, onSubmitDonation, onClose]
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
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
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
            <div className="space-y-6">
              <button
                onClick={() => setPaymentMethod(null)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium mb-4"
              >
                <X size={16} />
                Back to payment methods
              </button>

              <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
                <h3 className="font-bold text-primary-900 dark:text-primary-100 mb-2 flex items-center gap-2">
                  <CreditCard size={20} />
                  Card Payment
                </h3>
                <p className="text-sm text-primary-800 dark:text-primary-200 mb-4">
                  Fill in your details and proceed to Paystack secure payment
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCardPayment();
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={donationData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={donationData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={donationData.phone}
                      onChange={handleInputChange}
                      placeholder="+234 xxx xxx xxxx"
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Amount (₦) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-500 dark:text-gray-400">
                        ₦
                      </span>
                      <input
                        type="number"
                        name="amount"
                        value={donationData.amount}
                        onChange={handleInputChange}
                        required
                        min="100"
                        placeholder="10000"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Message of Support (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={donationData.message}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Leave an inspiring message..."
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={initializingPayment || isSubmitting}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  {initializingPayment ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Initializing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Proceed to Paystack
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Bank Transfer Details */}
          {paymentMethod === "transfer" && (
            <div className="space-y-6">
              <button
                onClick={() => setPaymentMethod(null)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium mb-4"
              >
                <X size={16} />
                Back to payment methods
              </button>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-2 flex items-center gap-2">
                  <DollarSign size={20} />
                  Bank Account Information
                </h3>
                <p className="text-sm text-emerald-800 dark:text-emerald-200 mb-4">
                  Transfer your donation to the account below, then upload your
                  receipt for verification.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                        Bank Name
                      </span>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {bankDetails.bankName}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(bankDetails.bankName, "bank-name")
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all"
                    >
                      <Copy size={16} />
                      {copied["bank-name"] ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                        Account Name
                      </span>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {bankDetails.accountName}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          bankDetails.accountName,
                          "account-name"
                        )
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all"
                    >
                      <Copy size={16} />
                      {copied["account-name"] ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                        Account Number
                      </span>
                      <p className="font-bold text-gray-900 dark:text-white font-mono text-lg">
                        {bankDetails.accountNumber}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          bankDetails.accountNumber,
                          "account-number"
                        )
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-all"
                    >
                      <Copy size={16} />
                      {copied["account-number"] ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                      Important Instructions
                    </h4>
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      After making the transfer, fill in the form below and
                      upload your receipt to complete the donation process.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleTransferSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={donationData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={donationData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={donationData.phone}
                      onChange={handleInputChange}
                      placeholder="+234 xxx xxx xxxx"
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Amount Transferred <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-500 dark:text-gray-400">
                        ₦
                      </span>
                      <input
                        type="number"
                        name="amount"
                        value={donationData.amount}
                        onChange={handleInputChange}
                        required
                        min="100"
                        placeholder="10000"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Message of Support (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={donationData.message}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Leave an inspiring message..."
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:text-white transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Upload Payment Receipt <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-emerald-500 dark:hover:border-emerald-500 transition-all">
                    {receiptPreview ? (
                      <div className="space-y-4">
                        <img
                          src={receiptPreview}
                          alt="Receipt preview"
                          className="mx-auto max-h-40 rounded-lg border-2 border-gray-200 dark:border-gray-700"
                        />
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {donationData.receipt?.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setDonationData((prev) => ({
                              ...prev,
                              receipt: null,
                            }));
                            setReceiptPreview(null);
                          }}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 text-sm font-semibold flex items-center gap-2 mx-auto"
                        >
                          <X size={16} />
                          Remove File
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                        <div className="mb-3">
                          <label
                            htmlFor="receipt-upload"
                            className="cursor-pointer"
                          >
                            <span className="block text-base font-semibold text-gray-900 dark:text-white mb-1">
                              Click to upload receipt
                            </span>
                            <span className="block text-sm text-gray-500 dark:text-gray-400">
                              PNG, JPG, or PDF up to 10MB
                            </span>
                          </label>
                          <input
                            id="receipt-upload"
                            name="receipt"
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleInputChange}
                            className="hidden"
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Submit Donation
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
