import React from "react";
import {
  Check,
  X,
  RefreshCw,
  FileText,
  Loader,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { formatCurrency } from "../../../utils/formatters";

const PaymentTable = ({
  payments,
  selectedPaymentIds,
  onSelectAll,
  onSelectOne,
  onApprove,
  onReject,
  onRefresh,
  loading,
  actionLoading,
}) => {
  const { darkMode } = useTheme();

  const getStatusBadge = (payment) => {
    const status = payment.approvalStatus || "pending";
    const colors = {
      pending: darkMode
        ? "bg-amber-900/30 text-amber-400 border-amber-800/50"
        : "bg-amber-50 text-amber-700 border-amber-200/50",
      approved: darkMode
        ? "bg-emerald-900/30 text-emerald-400 border-emerald-800/50"
        : "bg-emerald-50 text-emerald-700 border-emerald-200/50",
      rejected: darkMode
        ? "bg-red-900/30 text-red-400 border-red-800/50"
        : "bg-red-50 text-red-700 border-red-200/50",
    };
    const colorClass = colors[status] || colors.pending;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClass}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
      } border rounded-xl p-6 overflow-hidden`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-xl font-bold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Gifts in Motion—Lifelines for the Vulnerable
        </h3>
        <button
          onClick={onRefresh}
          disabled={loading}
          className={`p-2 rounded-lg transition-all ${
            darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
          } disabled:opacity-50 ${loading ? "animate-spin" : ""}`}
          aria-label="Renew our view of generosity's flow"
        >
          <RefreshCw
            size={20}
            className={`${darkMode ? "text-white" : "text-gray-900"}`}
          />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12" role="status">
          <Loader
            className={`animate-spin ${
              darkMode ? "text-purple-500" : "text-accent-600"
            }`}
            size={32}
          />
          <span className="sr-only">Weaving the tapestry of support...</span>
        </div>
      ) : payments.length === 0 ? (
        <div
          className={`text-center py-12 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">
            No gifts visible in this gentle view
          </p>
          <p className="mt-2">
            Refine your filters to reveal stories—or trust that silence means
            space for more compassion to come.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table
            className="w-full min-w-full"
            role="table"
            aria-label="Table of gifts stewarded for underprivileged upliftment"
          >
            <thead>
              <tr
                className={`text-left text-sm font-medium ${
                  darkMode
                    ? "text-gray-400 border-gray-800"
                    : "text-gray-600 border-gray-200"
                } border-b`}
              >
                <th className="pb-3" scope="col">
                  <input
                    type="checkbox"
                    checked={
                      selectedPaymentIds.length ===
                        payments.filter(
                          (p) =>
                            p.approvalStatus === "pending" && p.paymentVerified,
                        ).length && payments.length > 0
                    }
                    indeterminate={
                      selectedPaymentIds.length > 0 &&
                      selectedPaymentIds.length <
                        payments.filter(
                          (p) =>
                            p.approvalStatus === "pending" && p.paymentVerified,
                        ).length
                    }
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="rounded border-gray-500"
                    aria-label="Select all eligible gifts for bulk stewardship"
                  />
                </th>
                <th className="pb-3" scope="col">
                  Gift Reference
                </th>
                <th className="pb-3" scope="col">
                  Heart Behind It
                </th>
                <th className="pb-3" scope="col">
                  Cause Embraced
                </th>
                <th className="pb-3" scope="col">
                  Amount
                </th>
                <th className="pb-3" scope="col">
                  Channel
                </th>
                <th className="pb-3" scope="col">
                  Journey Stage
                </th>
                <th className="pb-3" scope="col">
                  Arrived
                </th>
                <th className="pb-3" scope="col">
                  Tend With Care
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className={`border-b transition-all ${
                    darkMode
                      ? "border-gray-800 hover:bg-gray-900/50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  role="row"
                >
                  <td className="py-4">
                    <input
                      type="checkbox"
                      checked={selectedPaymentIds.includes(payment._id)}
                      onChange={() => onSelectOne(payment._id)}
                      disabled={
                        payment.approvalStatus !== "pending" ||
                        !payment.paymentVerified ||
                        actionLoading
                      }
                      className={`rounded border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                        selectedPaymentIds.includes(payment._id)
                          ? "accent-emerald-600"
                          : ""
                      }`}
                      aria-label={`Select ${
                        payment.donationId || payment._id
                      } for collective embrace`}
                    />
                  </td>
                  <th scope="row" className="py-4">
                    <span
                      className={`text-sm font-mono ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {payment.donationId || payment._id?.slice(-8)}
                    </span>
                  </th>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          payment.anonymous
                            ? "https://i.pravatar.cc/150?img=0"
                            : payment.donor?.avatar ||
                              "https://i.pravatar.cc/150"
                        }
                        alt={
                          payment.anonymous
                            ? "Anonymous heart of giving"
                            : `${
                                payment.donor?.fullName || "Compassionate Giver"
                              } portrait`
                        }
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-300 dark:ring-gray-600"
                        loading="lazy"
                      />
                      <div>
                        <span
                          className={`font-medium block ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {payment.anonymous
                            ? "Anonymous Heart"
                            : payment.donor?.fullName ||
                              (payment.guestInfo
                                ? `${payment.guestInfo.firstName} ${payment.guestInfo.lastName}`
                                : "Beloved Giver")}
                        </span>
                        {!payment.anonymous &&
                          (payment.donor?.email ||
                            payment.guestInfo?.email) && (
                            <span
                              className={`text-xs ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {payment.donor?.email || payment.guestInfo?.email}
                            </span>
                          )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {payment.campaign?.title ||
                        "General Lifeline for the Underprivileged"}
                    </span>
                  </td>
                  <td className="py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="py-4 text-sm text-gray-400 capitalize">
                    {payment.paymentMethod?.replace("_", " ") ||
                      "Direct Channel of Care"}
                  </td>
                  <td className="py-4">{getStatusBadge(payment)}</td>
                  <td className="py-4 text-sm text-gray-400">
                    <time dateTime={payment.createdAt}>
                      {new Date(payment.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {payment.approvalStatus === "pending" &&
                        payment.paymentVerified &&
                        !actionLoading && (
                          <>
                            <button
                              onClick={() => onApprove(payment)}
                              className={`p-2 rounded-lg transition-all ${
                                darkMode
                                  ? "bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-400 border border-emerald-800/50"
                                  : "bg-emerald-50/50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/50"
                              }`}
                              title="Embrace this gift for immediate impact"
                              aria-label={`Embrace ${
                                payment.donationId || payment._id
                              } to uplift a family in need`}
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => onReject(payment)}
                              className={`p-2 rounded-lg transition-all ${
                                darkMode
                                  ? "bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/50"
                                  : "bg-red-50/50 hover:bg-red-100 text-red-700 border border-red-200/50"
                              }`}
                              title="Reflect thoughtfully on this gift"
                              aria-label={`Reflect on ${
                                payment.donationId || payment._id
                              } to refine our service`}
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentTable;
