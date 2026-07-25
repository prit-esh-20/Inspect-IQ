import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Cpu,
  ShieldCheck,
  ScanSearch,
  CircuitBoard,
  Sparkles,
  Gauge,
  Code2,
  Camera,
  Database,
  Layers,
  GitBranch,
  Box,
  Lightbulb,
  Microchip,
  CheckCircle2,
  Image,
  Zap,
  MessageSquare,
  ExternalLink,
  Mail,
  ArrowRight,
} from "lucide-react";
import HeroPanel from "../../components/hero/HeroPanel";
import Navbar from "../../components/layout/Navbar";
import PageWrapper from "../../components/layout/PageWrapper";
import Footer from "../../components/layout/Footer";
import GlassMetricCards from "../../components/hero/GlassMetricCards";

const showcaseCards = [
  {
    title: "Real-Time PCB Inspection",
    copy: "Boards are captured and analyzed the moment they enter the station — live video in, defect verdicts out, right on the production line.",
    icon: ScanSearch,
    points: [
      { label: "Live Camera Feed", icon: Camera },
      { label: "YOLO Detection", icon: ScanSearch },
      { label: "Fast Inference", icon: Zap },
    ],
  },
  {
    title: "Explainable AI",
    copy: "Every verdict ships with visual evidence and confidence, so engineers can trust — and audit — each decision.",
    icon: Sparkles,
    points: [
      { label: "Grad-CAM", icon: Lightbulb },
      { label: "Confidence Scores", icon: Gauge },
      { label: "Decision Transparency", icon: ShieldCheck },
    ],
  },
  {
    title: "Embedded Deployment",
    copy: "The full pipeline runs on low-cost edge hardware — on the line, next to the camera, even without a network.",
    icon: Microchip,
    points: [
      { label: "Raspberry Pi", icon: Cpu },
      { label: "Edge AI", icon: CircuitBoard },
      { label: "Offline Processing", icon: Database },
    ],
  },
];

const techStack = [
  { name: "Python", icon: Code2, desc: "Core inference engine" },
  { name: "YOLO", icon: Camera, desc: "Object detection" },
  { name: "OpenCV", icon: ScanSearch, desc: "Image processing" },
  { name: "PyTorch", icon: Layers, desc: "Deep learning framework" },
  { name: "FastAPI", icon: Zap, desc: "REST API layer" },
  { name: "React", icon: Box, desc: "Dashboard UI" },
  { name: "SQLite", icon: Database, desc: "Inspection logs" },
  { name: "Raspberry Pi", icon: Microchip, desc: "Edge hardware" },
];

const workflowSteps = [
  { step: "PCB Image", icon: Image },
  { step: "Camera Capture", icon: Camera },
  { step: "YOLO Detection", icon: ScanSearch },
  { step: "X-MCCV Verification", icon: CheckCircle2 },
  { step: "Grad-CAM", icon: Lightbulb },
  { step: "Inspection Report", icon: MessageSquare },
  { step: "PASS / FAIL", icon: Cpu },
];



function SectionLabel({ children }) {
  return (
    <div className="text-[10px] uppercase tracking-[0.28em] text-accent font-medium">
      {children}
    </div>
  );
}

function SectionTitle({ children, className = "" }) {
  return (
    <h2 className={`font-display text-4xl font-semibold text-white sm:text-5xl ${className}`}>
      {children}
    </h2>
  );
}

function CardCircuit({ className = "" }) {
  // Subtle PCB traces + AI nodes decorating the showcase cards.
  return (
    <svg
      viewBox="0 0 220 140"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none absolute text-accent ${className}`}
    >
      <path d="M6 96h44l18-18h52V48h38" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" />
      <path d="M0 118h72l14 14h60" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />
      <path d="M160 132V96l22-22h32" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />
      <circle cx="50" cy="96" r="2.4" fill="currentColor" fillOpacity="0.22" />
      <circle cx="120" cy="48" r="2.4" fill="currentColor" fillOpacity="0.18" />
      <circle cx="182" cy="74" r="2.2" fill="currentColor" fillOpacity="0.2" />
      <circle cx="146" cy="132" r="1.8" fill="currentColor" fillOpacity="0.25" />
      <rect x="152" y="42" width="12" height="12" rx="2" stroke="currentColor" strokeOpacity="0.16" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <PageWrapper className="relative min-h-screen overflow-x-hidden pt-24">
      <Navbar />

      <HeroPanel />

      {/* KPI SECTION */}
      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-8 lg:px-10">
        <GlassMetricCards />
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="mx-auto max-w-7xl px-4 py-14 md:px-8 lg:px-10"
      >
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <SectionLabel>About</SectionLabel>
            <SectionTitle>
              Bridging industrial inspection with explainable AI.
            </SectionTitle>
            <p className="max-w-xl text-lg leading-relaxed text-slate-400">
              The platform turns electromechanical quality inspection into a
              transparent, scalable process for modern PCB manufacturing. By
              combining vision models, deterministic verification, and embedded
              deployment, teams can identify defects quickly and understand why
              each decision was made.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-2xl border border-accent/10 bg-[rgba(13,27,23,0.72)] p-8 shadow-[0_18px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl space-y-6">
              <div>
                <h3 className="font-display text-sm uppercase tracking-[0.25em] text-white mb-2">
                  What it solves
                </h3>
                <p className="text-base leading-relaxed text-slate-400">
                  High-volume PCB validation with fewer false passes and faster review cycles.
                </p>
              </div>
              <div className="w-full h-px bg-gradient-to-r from-accent/20 via-accent/40 to-transparent" />
              <div>
                <h3 className="font-display text-sm uppercase tracking-[0.25em] text-white mb-2">
                  Why it matters
                </h3>
                <p className="text-base leading-relaxed text-slate-400">
                  Explainable outputs build trust for engineering, operations, and quality teams.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION — premium product showcase */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-14 md:px-8 lg:px-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-12 max-w-6xl text-center"
        >
          <SectionLabel>Why InspectIQ?</SectionLabel>
          <h2 className="mt-4 font-display text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-[1.75rem] xl:text-4xl">
            Intelligent Inspection.{" "}
            <span className="bg-gradient-to-r from-accent via-[#7ce7ac] to-accent bg-clip-text text-transparent">
              Explainable Decisions.
            </span>{" "}
            Industrial Reliability.
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-base leading-[1.6] text-slate-400 sm:text-lg">
            One platform that captures, detects, explains, and verifies every
            board on the line.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {showcaseCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, delay: 0.1 * index, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-accent/10 bg-gradient-to-br from-[rgba(13,27,23,0.88)] via-[rgba(13,27,23,0.75)] to-[rgba(50,213,131,0.06)] p-7 backdrop-blur-xl transition-[border-color,box-shadow] duration-500 hover:border-accent/35 hover:shadow-[0_20px_60px_rgba(50,213,131,0.12)] lg:p-8"
              >
                <CardCircuit className="-bottom-2 -right-6 w-52" />

                <div className="relative flex h-full flex-col items-start">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent shadow-[0_0_30px_rgba(50,213,131,0.1)] transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-white">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.6] text-slate-400">
                    {card.copy}
                  </p>
                  <ul className="mt-auto w-full space-y-2.5 border-t border-accent/10 pt-5">
                    {card.points.map((point) => {
                      const PointIcon = point.icon;
                      return (
                        <li
                          key={point.label}
                          className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.14em] text-slate-300"
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-accent/10 bg-accent/5">
                            <PointIcon className="h-3.5 w-3.5 text-accent" />
                          </span>
                          {point.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* TECHNOLOGY SECTION */}
      <section
        id="technology"
        className="mx-auto max-w-7xl px-4 py-14 md:px-8 lg:px-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <SectionLabel>Technology</SectionLabel>
          <SectionTitle className="mt-2">Modern stack, engineering-grade execution.</SectionTitle>
        </motion.div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {techStack.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group rounded-[1.5rem] border border-accent/10 bg-[rgba(13,27,23,0.72)] p-7 transition-all duration-500 hover:border-accent/30 hover:shadow-[0_0_40px_rgba(50,213,131,0.1)]"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/15 bg-accent/5 text-accent transition-all duration-300 group-hover:bg-accent/10 group-hover:shadow-[0_0_25px_rgba(50,213,131,0.15)]">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="font-display text-base font-semibold uppercase tracking-[0.22em] text-white mb-1.5">
                  {tech.name}
                </div>
                <div className="text-sm text-slate-500">{tech.desc}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* WORKFLOW SECTION */}
      <section
        id="workflow"
        className="mx-auto max-w-7xl px-4 py-14 md:px-8 lg:px-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[1.75rem] border border-accent/10 bg-[rgba(13,27,23,0.8)] px-6 py-12 shadow-[0_18px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl md:px-10 lg:py-14"
        >
          <div className="mb-12 text-center">
            <SectionLabel>Workflow</SectionLabel>
            <SectionTitle className="mt-2">A disciplined path from capture to decision.</SectionTitle>
          </div>
          <div className="relative z-10 grid gap-6 lg:grid-cols-7">
            {workflowSteps.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex flex-col items-center gap-4"
                >
                  {/* Step icon circle */}
                  <motion.div
                    whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(50,213,131,0.25)" }}
                    className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/20 bg-[rgba(13,27,23,0.85)] shadow-[0_0_25px_rgba(50,213,131,0.08)]"
                  >
                    <Icon className="h-7 w-7 text-accent" />
                  </motion.div>

                  {/* Connector line between circles */}
                  {index < workflowSteps.length - 1 && (
                    <div className="hidden lg:block absolute left-[calc(50%+2.5rem)] top-8 w-[calc(100%-3.5rem)] h-px">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent/50 via-accent/25 to-transparent"
                        initial={{ scaleX: 0, transformOrigin: "left" }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 + index * 0.08 }}
                      />
                    </div>
                  )}

                  {/* Step number badge */}
                  <div className="rounded-full border border-accent/10 bg-accent/5 px-2.5 py-0.5">
                    <span className="text-[10px] font-mono font-medium text-accent">0{index + 1}</span>
                  </div>

                  {/* Step name */}
                  <span className="text-sm font-medium uppercase tracking-[0.2em] text-white text-center leading-relaxed">
                    {item.step}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* PROJECT INFORMATION SECTION */}
      <section
        id="contact"
        className="mx-auto max-w-7xl px-4 pt-14 pb-8 md:px-8 lg:px-10"
      >
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          {/* LEFT COLUMN */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-between space-y-6"
          >
            <div>
              <SectionLabel>Project Information</SectionLabel>
              <SectionTitle className="mt-3 leading-tight">
                Ready to Explore InspectIQ?
              </SectionTitle>
              <div className="mt-5 space-y-4 max-w-xl text-base leading-relaxed text-slate-400">
                <p>
                  InspectIQ is an Embedded Explainable AI platform for Automated
                  Optical Inspection of Printed Circuit Boards.
                </p>
                <p>
                  Built using YOLOv8, X-MCCV, Grad-CAM and Raspberry Pi for
                  intelligent, transparent, and reliable PCB quality inspection.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#07110F] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(50,213,131,0.3)]"
              >
                Launch Dashboard
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="https://github.com/prit-esh-20/Inspect-IQ"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full border border-accent/20 bg-accent/5 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition-all duration-300 hover:border-accent/40 hover:bg-accent/10 hover:text-white"
              >
                View GitHub Repository
                <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.div>

          {/* RIGHT COLUMN - 2x2 GLASS GRID */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Card 1: Project */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              whileHover={{ y: -4, borderColor: "rgba(50, 213, 131, 0.35)" }}
              className="group flex flex-col justify-between rounded-2xl border border-accent/15 bg-[rgba(13,27,23,0.72)] p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(50,213,131,0.12)] min-h-[170px]"
            >
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Box className="h-5 w-5" />
                </div>
                <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-slate-500 mb-1">
                  Project
                </div>
                <div className="font-display text-lg font-bold tracking-wide text-white">
                  InspectIQ
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                Embedded XAI-Based Automated Optical Inspection System
              </p>
            </motion.div>

            {/* Card 2: Technology Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -4, borderColor: "rgba(50, 213, 131, 0.35)" }}
              className="group flex flex-col justify-between rounded-2xl border border-accent/15 bg-[rgba(13,27,23,0.72)] p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(50,213,131,0.12)] min-h-[170px]"
            >
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-slate-500 mb-1">
                  Technology Stack
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {[
                  "YOLOv8",
                  "OpenCV",
                  "PyTorch",
                  "FastAPI",
                  "React",
                  "Raspberry Pi",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="inline-block rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-accent cyber-glow-green transition-all duration-300 hover:border-accent/40 hover:bg-accent/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Card 3: Repository */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ y: -4, borderColor: "rgba(50, 213, 131, 0.35)" }}
              className="group flex flex-col justify-between rounded-2xl border border-accent/15 bg-[rgba(13,27,23,0.72)] p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(50,213,131,0.12)] min-h-[170px]"
            >
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <GitBranch className="h-5 w-5" />
                </div>
                <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-slate-500 mb-1">
                  Repository
                </div>
                <div className="font-display text-lg font-bold tracking-wide text-white">
                  GitHub
                </div>
              </div>
              <a
                href="https://github.com/prit-esh-20/Inspect-IQ"
                target="_blank"
                rel="noreferrer"
                className="group/link inline-flex items-center gap-1.5 mt-3 text-xs text-accent transition-colors hover:text-white"
              >
                <span className="truncate font-mono">
                  github.com/prit-esh-20/Inspect-IQ
                </span>
                <ExternalLink className="h-3 w-3 shrink-0 transition-transform group-hover/link:translate-x-0.5" />
              </a>
            </motion.div>

            {/* Card 4: Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -4, borderColor: "rgba(50, 213, 131, 0.35)" }}
              className="group flex flex-col justify-between rounded-2xl border border-accent/15 bg-[rgba(13,27,23,0.72)] p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(50,213,131,0.12)] min-h-[170px]"
            >
              <div>
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-slate-500 mb-1">
                  Contact
                </div>
                <div className="font-display text-lg font-bold tracking-wide text-white">
                  Email
                </div>
              </div>
              <a
                href="mailto:team.inspectiq@gmail.com"
                className="group/link inline-flex items-center gap-1.5 mt-3 text-xs text-accent transition-colors hover:text-white"
              >
                <span className="font-mono">team.inspectiq@gmail.com</span>
                <ArrowRight className="h-3 w-3 shrink-0 transition-transform group-hover/link:translate-x-0.5" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PREMIUM FOOTER */}
      <Footer />
    </PageWrapper>
  );
}
