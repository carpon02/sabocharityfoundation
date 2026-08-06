import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { motion as Motion } from "framer-motion";

/**
 * WhatsAppButton — A sticky floating button that opens WhatsApp.
 * Configurable phone number and pre-filled message.
 */
const WHATSAPP_NUMBER = "2348100000000"; // replace with real number
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello! I'd like to learn more about the Sabo Ibadan Youth Charity Foundation and how I can support your work."
);
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const WhatsAppButton = () => {
  return (
    <Motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5 bg-[#25D366] text-white font-bold text-sm rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.5)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.6)] transition-all duration-300"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle size={20} className="fill-white" />
      <span className="hidden sm:inline">Chat with Us</span>

      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
    </Motion.a>
  );
};

export default WhatsAppButton;
