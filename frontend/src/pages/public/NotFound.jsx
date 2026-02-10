import { Link } from "react-router-dom";
import { ChevronLeft, Home, MessageSquare, Sparkles } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-50 rounded-full blur-[140px] opacity-40 hover:opacity-100 transition-opacity duration-1000" />
      </div>

      <div className="relative z-10 space-y-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 font-black text-[10px] uppercase tracking-widest">
          <Sparkles size={14} />
          Signal Interrupted
        </div>

        <h1 className="text-[12rem] md:text-[16rem] font-black text-dark leading-none tracking-tighter opacity-10">
          404
        </h1>

        <div className="space-y-4 -mt-20 md:-mt-32">
          <h2 className="text-4xl md:text-6xl font-black text-dark tracking-tighter">
            Lost in the Haven.
          </h2>
          <p className="text-xl text-gray-400 font-medium max-w-lg mx-auto leading-relaxed">
            The page you are seeking has either been moved to another quadrant
            or has ceased to exist in our records.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
          <Link
            to="/"
            className="px-10 py-5 bg-primary-900 text-white font-black rounded-2xl hover:bg-dark shadow-2xl transition-all flex items-center gap-3 scale-110 active:scale-95"
          >
            <Home size={20} />
            Return Home
          </Link>
          <Link
            to="/contact"
            className="px-10 py-5 border-4 border-primary-50 text-gray-500 font-black rounded-2xl hover:border-primary-100 transition-all flex items-center gap-3 active:scale-95"
          >
            <MessageSquare size={20} />
            Seek Assistance
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
