import React from "react";
import { X, AlertCircle } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { formatCurrency } from "../../../utils/formatters";

const RejectPaymentModal = ({
  isOpen,
  onClose,
  onConfirm,
  payment,
  rejectionReason,
  setRejectionReason,
  initiateRefund,
  setInitiateRefund,
}) => {
  const { darkMode } = useTheme();

  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`w-full max-w-md rounded-xl shadow-2xl transform transition-all scale-100 ${
          darkMode ? "bg-gray-900 border border-gray-800" : "bg-white"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4 text-red-500">
            <AlertCircle size={24} />
            <h3
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Reflect on this Gift
            </h3>
          </div>
          <p
            className={`text-sm mb-6 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            You are declining{" "}
            <span className="font-semibold text-red-500">
              {formatCurrency(payment.amount)}
            </span>{" "}
            from{" "}
            <span className="font-semibold">
              {payment.anonymous
                ? "Anonymous Heart"
                : payment.donor?.fullName || "Beloved Giver"}
            </span>
            . This pause ensures our integrity for the vulnerable.
          </p>

          <div className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Reason for Reflection <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Why must we pause this gift? (e.g., verification needed)"
                className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="refund"
                checked={initiateRefund}
                onChange={(e) => setInitiateRefund(e.target.checked)}
                className="rounded border-gray-500 text-red-600 focus:ring-red-500"
              />
              <label
                htmlFor="refund"
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Initiate return of funds (if applicable)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 shadow-lg shadow-red-500/20 transition-all"
            >
              <X size={16} />
              Confirm Reflection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectPaymentModal;
