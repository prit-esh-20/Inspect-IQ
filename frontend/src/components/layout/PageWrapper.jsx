import { motion } from "framer-motion";

export default function PageWrapper({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -15, filter: "blur(6px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full min-h-screen ${className}`}
    >
      {children}
    </motion.div>
  );
}
