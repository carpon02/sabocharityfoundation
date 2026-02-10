import React from "react";
import { Check, X } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { formatCurrency } from "../../../utils/formatters";

const ApprovePaymentModal = ({
  isOpen,
  onClose,
  onConfirm,
  payment,
  adminNotes,
  setAdminNotes,
  impactMessage,
  setImpactMessage,
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
          <h3
            className={`text-xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Embrace this Gift
          </h3>
          <p
            className={`text-sm mb-6 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            You are accepting{" "}
            <span className="font-semibold text-emerald-500">
              {formatCurrency(payment.amount)}
            </span>{" "}
            from{" "}
            <span className="font-semibold">
              {payment.anonymous
                ? "Anonymous Heart"
                : payment.donor?.fullName || "Beloved Giver"}
            </span>
            . This act fuels our mission for the underprivileged.
          </p>

          <div className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Steward's Note (Internal)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Private reflection on this gift..."
                className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
                rows={3}
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Message of Impact (To Donor)
              </label>
              <textarea
                value={impactMessage}
                onChange={(e) => setImpactMessage(e.target.value)}
                placeholder="Share how their love lifts a life today..."
                className={`w-full px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
                rows={3}
              />
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
              Pause
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Check size={16} />
              Confirm Embrace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovePaymentModal;
