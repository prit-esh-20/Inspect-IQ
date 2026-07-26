"use client";

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, ArrowRight, ChevronDown } from "lucide-react";
import { scrollToSection } from "../../hooks/useSmoothScroll";
import { useAuth } from "../../context/AuthContext";

const techPills = [
  "Raspberry Pi",
  "YOLOv8",
  "Grad-CAM",
  "X-MCCV",
  "OpenCV",
  "FastAPI",
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function HeroPanel() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cueDimmed, setCueDimmed] = useState(false);
  const cueIntroDelay = useRef(1.4);

  const handleDashboardClick = () => {
    navigate(isAuthenticated ? "/dashboard" : "/login");
  };

  const handleAnchor = (event, selector) => {
    event.preventDefault();
    window.history.replaceState(null, "", selector);
    scrollToSection(selector);
  };

  const handleScrollCue = (event) => {
    event.preventDefault();
    window.history.replaceState(null, "", "#about");
    // fade the indicator while the page glides, restore on arrival
    setCueDimmed(true);
    scrollToSection("#about", { onComplete: () => setCueDimmed(false) });
  };

  return (
    <section
      id="home"
      className="relative mx-auto flex min-h-[calc(85vh-6rem)] w-full max-w-[60rem] flex-col items-center justify-center px-4 pb-28 pt-12 text-center md:px-8"
    >
      {/* Soft radial spotlight — darkens the center for readability while the
          animated board stays visible in the peripheral space */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[135%] w-[165%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse 52% 54% at center, rgba(7,17,15,0.75) 0%, rgba(7,17,15,0.4) 46%, rgba(7,17,15,0) 72%), radial-gradient(ellipse 28% 30% at center, rgba(50,213,131,0.05) 0%, rgba(50,213,131,0) 70%)",
        }}
      />

      {/* Badge */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-accent"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_#32d583]" />
        Explainable AI · Automated Optical Inspection
      </motion.div>

      {/* Title */}
      <motion.h1
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.1}
        className="font-display font-bold leading-none tracking-tight text-white text-[clamp(3.5rem,9vw,5.5rem)]"
      >
        InspectIQ
      </motion.h1>

      {/* Two-line subtitle */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.2}
        className="mt-6 space-y-1.5"
      >
        <div className="font-display text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
          <span className="bg-gradient-to-r from-accent via-[#7ce7ac] to-accent bg-clip-text text-transparent">
            Intelligent PCB Inspection
          </span>
        </div>
        <div className="text-base font-medium uppercase tracking-[0.3em] text-slate-400 sm:text-lg">
          Powered by Explainable AI
        </div>
      </motion.div>

      {/* Description */}
      <motion.p
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0.3}
        className="mx-auto mt-8 max-w-[650px] text-base leading-[1.6] text-slate-400 sm:text-lg"
      >
        A next-generation Automated Optical Inspection platform that combines
        Computer Vision, YOLO, Explainable AI, and X-MCCV verification to
        deliver fast, accurate, and transparent PCB quality inspection.
      </motion.p>

      {/* CTAs — slide in from opposite sides */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
        <motion.button
          onClick={handleDashboardClick}
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-accent px-10 py-[1.15rem] text-xs font-semibold uppercase tracking-[0.24em] text-primary-bg transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(50,213,131,0.35)] cursor-pointer"
        >
          <Play className="h-4 w-4 fill-current" />
          Launch Dashboard
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </motion.button>
        <motion.a
          href="#technology"
          onClick={(event) => handleAnchor(event, "#technology")}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2.5 rounded-xl border border-white/15 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors duration-300 hover:border-white/30 hover:bg-white/5"
        >
          Explore Technology
          <ArrowRight className="h-4 w-4" />
        </motion.a>
      </div>

      {/* Technology pills — sequential fade, directly under the CTAs */}
      <div className="mt-8 flex max-w-[650px] flex-wrap items-center justify-center gap-3">
        {techPills.map((pill, i) => (
          <motion.span
            key={pill}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.7 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md"
          >
            {pill}
          </motion.span>
        ))}
      </div>

      {/* Scroll indicator — gentle floating cue at the bottom of the hero */}
      <motion.a
        href="#about"
        onClick={handleScrollCue}
        initial={{ opacity: 0 }}
        animate={{ opacity: cueDimmed ? 0 : 1 }}
        transition={{
          duration: cueDimmed ? 0.35 : 0.8,
          delay: cueDimmed ? 0 : cueIntroDelay.current,
          ease: "easeOut",
        }}
        onAnimationComplete={() => {
          cueIntroDelay.current = 0;
        }}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-slate-500 transition-colors duration-300 hover:text-accent"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.3em]">
          Scroll to Explore
        </span>
        <motion.span
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}
