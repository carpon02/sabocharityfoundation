import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * Reusable Modal component with consistent styling
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to call when closing
 * @param {string} props.title - Modal title
 * @param {string} props.subtitle - Optional subtitle/description
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.actions - Action buttons (footer)
 * @param {string} props.maxWidth - Max width class (default: 'max-w-md')
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  actions,
  maxWidth = "max-w-md",
}) => {
  const { darkMode } = useTheme();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className={`${
          darkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"
        } border rounded-xl p-6 ${maxWidth} w-full mx-4 max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3
              id="modal-title"
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                className={`text-sm mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${
              darkMode
                ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex gap-3 justify-end mt-6">{actions}</div>
        )}
      </div>
    </div>
  );
};

export default Modal;
