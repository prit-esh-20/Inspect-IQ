import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children }) {
  
  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Lock page scrolling
    }
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050816]/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden glass-panel-glow border border-accent/20 rounded-2xl flex flex-col z-10 shadow-[0_0_50px_rgba(0,229,255,0.15)] bg-secondary-bg/95"
          >
            
            {/* Modal Header */}
            <div className="p-5 border-b border-accent/10 flex items-center justify-between">
              {title && (
                <h3 className="font-display font-bold text-sm tracking-wider text-white uppercase flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-accent rounded-sm inline-block" />
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg border border-accent/10 hover:border-accent/40 bg-accent/5 hover:bg-accent/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {children}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
