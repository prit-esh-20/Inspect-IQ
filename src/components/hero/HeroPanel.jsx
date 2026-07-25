"use client";

import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";

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
  return (
    <section
      id="home"
      className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-5xl flex-col items-center justify-center px-4 py-20 text-center md:px-8 lg:py-28"
    >
      {/* Badge */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="mb-10 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-accent"
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
        className="mt-8 max-w-[600px] text-base leading-relaxed text-slate-400 sm:text-lg sm:leading-relaxed"
      >
        A next-generation Automated Optical Inspection platform that combines
        Computer Vision, YOLO, Explainable AI, and X-MCCV verification to
        deliver fast, accurate, and transparent PCB quality inspection.
      </motion.p>

      {/* CTAs — slide in from opposite sides */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
        <motion.a
          href="/dashboard"
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-accent px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary-bg transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(50,213,131,0.35)]"
        >
          <Play className="h-4 w-4 fill-current" />
          Launch Dashboard
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </motion.a>
        <motion.a
          href="#technology"
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

      {/* Technology pills — sequential fade */}
      <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
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
    </section>
  );
}
