import React, { useState } from "react";

const ActionButton = ({ text, onClick }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return; // prevent double click
    setLoading(true);

    try {
      if (onClick) {
        await onClick(); // handle async actions if provided
      } else {
        // Simulate a donation action
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    } catch (error) {
      // Error handling - could add toast notification here
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="mt-10 w-full bg-indigo-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-indigo-700 transition flex items-center justify-center"
      disabled={loading}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5 mr-2 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      ) : null}
      {loading ? "Processing..." : text}
    </button>
  );
};

export default ActionButton;
