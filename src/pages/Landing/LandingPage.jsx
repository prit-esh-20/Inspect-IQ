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
  Cpu as ChipIcon,
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
  Users,
  Building2,
} from "lucide-react";
import HeroPanel from "../../components/hero/HeroPanel";
import Navbar from "../../components/layout/Navbar";
import GlassCard from "../../components/cards/GlassCard";
import PageWrapper from "../../components/layout/PageWrapper";
import GlassMetricCards from "../../components/hero/GlassMetricCards";

const featureCards = [
  {
    title: "Real-Time Inspection",
    copy: "Live defect detection with low-latency inference on embedded hardware.",
    icon: ScanSearch,
  },
  {
    title: "Explainable AI",
    copy: "Every decision carries visible reasoning through Grad-CAM and confidence overlays.",
    icon: Sparkles,
  },
  {
    title: "Embedded Deployment",
    copy: "Optimized for Raspberry Pi and industrial edge compute environments.",
    icon: ChipIcon,
  },
  {
    title: "Industrial Accuracy",
    copy: "Validation rules aligned with quality engineering and assembly tolerances.",
    icon: ShieldCheck,
  },
  {
    title: "Fast Processing",
    copy: "Near-real-time inspection flow designed for manufacturing throughput.",
    icon: Gauge,
  },
  {
    title: "Affordable Solution",
    copy: "A scalable inspection platform for research, pilot, and production adoption.",
    icon: CircuitBoard,
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

const contactItems = [
  { label: "Guide", value: "Prof. Dr. Embedded Systems", icon: Users },
  { label: "Department", value: "Embedded Systems & Computer Vision", icon: Building2 },
  { label: "Project Team", value: "PI-AOI Research Group", icon: GitBranch },
  { label: "Email", value: "team@inspectiq.dev", icon: Mail },
  { label: "GitHub", value: "github.com/inspectiq", icon: ExternalLink },
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

export default function LandingPage() {
  return (
    <PageWrapper className="relative min-h-screen overflow-x-hidden pt-24">
      <Navbar />

      <HeroPanel />

      {/* KPI SECTION */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-8 lg:px-10">
        <GlassMetricCards />
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="mx-auto max-w-7xl px-4 py-28 md:px-8 lg:px-10"
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

      {/* FEATURES SECTION */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-28 md:px-8 lg:px-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <SectionLabel>Features</SectionLabel>
          <SectionTitle className="mt-2 max-w-3xl">
            Built for quality teams, engineers, and production environments.
          </SectionTitle>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            return (
              <GlassCard
                key={feature.title}
                className="group space-y-5 rounded-[1.5rem] border border-accent/10 p-8"
              >
                <motion.div
                  whileHover={{ rotate: 6, scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/15 bg-accent/5 text-accent"
                >
                  <Icon className="h-7 w-7" />
                </motion.div>
                <h3 className="font-display text-lg font-semibold uppercase tracking-[0.22em] text-white">
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed text-slate-400">
                  {feature.copy}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* TECHNOLOGY SECTION */}
      <section
        id="technology"
        className="mx-auto max-w-7xl px-4 py-28 md:px-8 lg:px-10"
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
        className="mx-auto max-w-7xl px-4 py-28 md:px-8 lg:px-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <SectionLabel>Workflow</SectionLabel>
          <SectionTitle className="mt-2">A disciplined path from capture to decision.</SectionTitle>
        </motion.div>
        <div className="relative px-4 py-8">
          {/* Animated connection line */}
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 hidden lg:block">
            <div className="relative h-full w-full overflow-hidden">
              <motion.div
                className="h-full w-full"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, #32d583 15%, #32d583 85%, transparent 100%)",
                }}
                initial={{ scaleX: 0, transformOrigin: "left" }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
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
                  className="flex flex-col items-center gap-4"
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
                    <div className="hidden lg:block absolute left-[calc(50%+2.5rem)] top-8 w-[calc(100%-5rem)] h-px">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent/60 to-transparent"
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
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section
        id="contact"
        className="mx-auto max-w-7xl px-4 py-28 md:px-8 lg:px-10"
      >
        <div className="rounded-2xl border border-accent/10 bg-[rgba(13,27,23,0.8)] p-10 shadow-[0_18px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <SectionLabel>Contact</SectionLabel>
              <SectionTitle className="mt-3 leading-tight">
                Partner with a platform designed for industrial trust.
              </SectionTitle>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-400">
                From research teams to production environments, the system is
                built to support transparent inspection workflows with long-term
                scalability in mind.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-4"
            >
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 rounded-xl border border-accent/10 bg-[rgba(7,17,15,0.65)] p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent/15 bg-accent/5 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                        {item.label}
                      </div>
                      <div className="mt-1 font-display text-sm uppercase tracking-[0.25em] text-white">
                        {item.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-accent/10 bg-[rgba(7,17,15,0.78)] px-4 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-accent" /> InspectIQ AOI Platform
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="#about" className="transition-colors hover:text-white">
              About
            </a>
            <a href="#contact" className="transition-colors hover:text-white">
              Contact
            </a>
            <a href="/login" className="transition-colors hover:text-white">
              Login
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </PageWrapper>
  );
}
