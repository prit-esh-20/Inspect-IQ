import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  ExternalLink,
  FileText,
  Tag,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { scrollToSection } from "../../hooks/useSmoothScroll";

/* ───────────────────────── DATA ──────────────────────── */

const navLinks = [
  { name: "Home", id: "home" },
  { name: "About", id: "about" },
  { name: "Features", id: "features" },
  { name: "Technology", id: "technology" },
  { name: "Workflow", id: "workflow" },
  { name: "Contact", id: "contact" },
];

const techBadges = [
  "React",
  "FastAPI",
  "YOLOv8",
  "OpenCV",
  "PyTorch",
  "Raspberry Pi",
];

const projectLinks = [
  {
    label: "GitHub Repository",
    href: "https://github.com/prit-esh-20/Inspect-IQ",
    icon: ExternalLink,
    external: true,
  },
  {
    label: "Research Paper",
    href: null,
    icon: FileText,
    badge: "Coming Soon",
  },
  {
    label: "Version 1.0",
    href: null,
    icon: Tag,
  },
  {
    label: "Built at SIES Graduate School of Technology",
    href: null,
    icon: GraduationCap,
  },
];

/* ───────────────── ANIMATED CIRCUIT LINE ─────────────── */

function CircuitLine() {
  return (
    <div className="relative w-full h-px overflow-visible" aria-hidden="true">
      {/* Base glow line */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      {/* Moving pulse */}
      <motion.div
        className="absolute top-[-1px] h-[3px] w-24 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, #32d583, #7ce7ac, #32d583, transparent)",
          boxShadow:
            "0 0 12px 3px rgba(50,213,131,0.4), 0 0 30px 6px rgba(50,213,131,0.15)",
        }}
        animate={{ left: ["-10%", "110%"] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Circuit nodes — small dots along the line */}
      {[15, 35, 55, 75, 90].map((pos) => (
        <motion.div
          key={pos}
          className="absolute top-[-2.5px] h-[6px] w-[6px] rounded-full border border-accent/40 bg-accent/20"
          style={{ left: `${pos}%` }}
          animate={{
            boxShadow: [
              "0 0 4px rgba(50,213,131,0.2)",
              "0 0 10px rgba(50,213,131,0.5)",
              "0 0 4px rgba(50,213,131,0.2)",
            ],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: pos * 0.03,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────── GLOWING BADGE ──────────────────── */

function TechBadge({ name, index }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{
        boxShadow: "0 0 18px rgba(50,213,131,0.35), 0 0 40px rgba(50,213,131,0.12)",
        borderColor: "rgba(50,213,131,0.5)",
        scale: 1.05,
      }}
      className="inline-block rounded-full border border-accent/15 bg-accent/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent/90 transition-all duration-300 cursor-default"
    >
      {name}
    </motion.span>
  );
}

/* ────────────────── CTA SECTION ─────────────────────── */

function CTASection() {
  return (
    <section className="relative overflow-hidden">
      {/* Radial background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(50,213,131,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <div className="mb-6 flex items-center gap-2 rounded-full border border-accent/15 bg-accent/5 px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
              Get Started
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            Ready to experience{" "}
            <span className="bg-gradient-to-r from-accent via-[#7ce7ac] to-accent bg-clip-text text-transparent">
              Explainable
            </span>
            <br className="hidden sm:block" />
            {" "}PCB Inspection?
          </h2>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg">
            Deploy intelligent, transparent quality inspection across your
            production line with a single platform.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="group flex items-center gap-2.5 rounded-full bg-accent px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#07110F] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(50,213,131,0.3)]"
            >
              Launch Dashboard
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>

            <a
              href="#technology"
              onClick={(e) => {
                e.preventDefault();
                window.history.replaceState(null, "", "#technology");
                scrollToSection("#technology");
              }}
              className="group flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/5 px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200 transition-all duration-300 hover:border-accent/40 hover:bg-accent/10 hover:text-white"
            >
              Explore Technology
              <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════ FOOTER ═══════════════════════ */

export default function Footer() {
  const handleAnchor = (e, id) => {
    e.preventDefault();
    window.history.replaceState(null, "", `#${id}`);
    scrollToSection(`#${id}`);
  };

  return (
    <footer className="relative border-t border-accent/[0.08] bg-[rgba(5,12,10,0.92)] backdrop-blur-xl mt-8">
      {/* Animated circuit divider */}
      <div className="absolute top-0 left-0 right-0">
        <CircuitLine />
      </div>

      {/* ── Main Grid ──────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-10 md:px-8 lg:px-10">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* ── Column 1 · Brand ────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              {/* Logo */}
              <Link to="/" className="group inline-flex items-center gap-3">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(50,213,131,0.2)",
                      "0 0 16px rgba(50,213,131,0.4)",
                      "0 0 0px rgba(50,213,131,0.2)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(0,255,136,0.3)] bg-gradient-to-br from-[#00ff88] to-[#00e573]"
                >
                  <Search className="h-5 w-5 text-[#07110F]" />
                </motion.div>
                <div className="flex flex-col">
                  <span className="font-display text-base font-bold tracking-[0.1em] text-white">
                    Inspect<span className="text-accent">IQ</span>
                  </span>
                  <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-slate-500">
                    Intelligent PCB Inspection Platform
                  </span>
                </div>
              </Link>

              {/* Brand description */}
              <p className="max-w-[260px] text-[13px] leading-[1.75] text-slate-400">
                An end-to-end inspection platform that detects, explains, and
                verifies PCB defects — deployed on edge hardware for real-time
                quality assurance.
              </p>

              {/* Powered by */}
              <p className="text-[11px] leading-[1.65] text-slate-500">
                Powered by{" "}
                <span className="text-accent/70">
                  Embedded AI, YOLOv8, X-MCCV
                </span>{" "}
                and{" "}
                <span className="text-accent/70">Explainable AI</span>.
              </p>
            </motion.div>

            {/* ── Column 2 · Navigation ───────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              <h4 className="mb-5 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-white">
                Navigation
              </h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => handleAnchor(e, link.id)}
                      className="group relative inline-block text-[13px] text-slate-400 transition-colors duration-300 hover:text-white"
                    >
                      {link.name}
                      {/* Animated underline */}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent/60 transition-all duration-300 group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ── Column 3 · Technology Stack ─────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.16 }}
            >
              <h4 className="mb-5 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-white">
                Technology Stack
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {techBadges.map((name, i) => (
                  <TechBadge key={name} name={name} index={i} />
                ))}
              </div>
            </motion.div>

            {/* ── Column 4 · Project ──────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.24 }}
            >
              <h4 className="mb-5 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-white">
                Project
              </h4>
              <ul className="space-y-3.5">
                {projectLinks.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <span className="group relative inline-flex items-center gap-2 text-[13px] text-slate-400 transition-colors duration-300 hover:text-white">
                      <Icon className="h-3.5 w-3.5 shrink-0 text-accent/50" />
                      {item.label}
                      {item.badge && (
                        <span className="rounded-full border border-accent/15 bg-accent/5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-accent/70">
                          {item.badge}
                        </span>
                      )}
                      {/* Underline for links */}
                      {item.href && (
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent/60 transition-all duration-300 group-hover:w-full" />
                      )}
                    </span>
                  );

                  return (
                    <li key={item.label}>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noreferrer" : undefined}
                        >
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* ── Copyright Strip ────────────────────── */}
        <div className="border-t border-accent/[0.06]">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-center md:flex-row md:items-center md:justify-between md:px-8 md:text-left lg:px-10">
            <p className="text-[11px] tracking-wide text-slate-500">
              © 2026 InspectIQ — Intelligent PCB Inspection Platform.
            </p>
            <p className="text-[11px] tracking-wide text-slate-600">
              Built with React, FastAPI, YOLOv8, OpenCV, PyTorch and Raspberry
              Pi.
            </p>
          </div>
        </div>
      </footer>
  );
}
