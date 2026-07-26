"use client";

import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle,
} from "lucide-react";
import PageWrapper from "../../components/layout/PageWrapper";
import { mockApi } from "../../services/mockApi";
import { useAuth } from "../../context/AuthContext";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function LoginPage() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [phase, setPhase] = useState("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [ripple, setRipple] = useState(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const isSubmitting = phase !== "idle";

  const clearError = () => setError("");

  const handleMouseMove = useCallback(
    (e) => {
      if (!cardRef.current || isSubmitting) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setParallax({ x: x * 4, y: y * 4 });
    },
    [isSubmitting],
  );

  const handleMouseLeave = () => setParallax({ x: 0, y: 0 });

  const handleRipple = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipple({ x, y, id });
    setTimeout(() => setRipple((prev) => (prev?.id === id ? null : prev)), 600);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setError("");
    setPhase("authenticating");

    let result;
    try {
      result = await mockApi.login(email.trim(), password);
    } catch (err) {
      setError(err.message);
      setPhase("idle");
      return;
    }

    authLogin(result.user, result.token);
    setPhase("success");
    await delay(600);

    setPhase("scaling");
    await delay(800);

    setPhase("preparing");
    const startTime = Date.now();
    const duration = 1000;
    await new Promise((resolve) => {
      const tick = () => {
        const elapsed = Date.now() - startTime;
        const p = Math.min(elapsed / duration, 1);
        setProgress(p);
        if (p < 1) requestAnimationFrame(tick);
        else resolve();
      };
      requestAnimationFrame(tick);
    });

    navigate("/dashboard", { replace: true });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
    scaling: {
      opacity: 0.92,
      scale: 0.96,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
    preparing: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <PageWrapper>
      <style>{`
        @keyframes ripple {
          to { transform: scale(25); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
      `}</style>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        {/* Dark overlay to soften the PCBBackground */}
        <div className="fixed inset-0 bg-primary-bg/40 backdrop-blur-[1px]" />

        {/* Card */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          variants={cardVariants}
          initial="hidden"
          animate={
            phase === "scaling"
              ? "scaling"
              : phase === "preparing"
                ? "preparing"
                : "visible"
          }
          style={{
            transform:
              phase === "idle" && (parallax.x !== 0 || parallax.y !== 0)
                ? `translate(${parallax.x}px, ${parallax.y}px)`
                : undefined,
          }}
          className="relative w-full max-w-[440px] overflow-hidden rounded-3xl border border-white/[0.06] bg-card-bg/70 p-8 shadow-2xl backdrop-blur-2xl sm:p-10"
        >
          {/* Success glow ring */}
          {phase === "success" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_80px_rgba(50,213,131,0.08)]"
            />
          )}

          {/* Scanning line */}
          {phase === "scaling" && (
            <motion.div
              initial={{ top: "-5%" }}
              animate={{ top: "105%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute left-4 right-4 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent shadow-[0_0_12px_rgba(50,213,131,0.25)]"
            />
          )}

          <div className="relative z-10">
            {/* Logo */}
            <motion.div
              animate={
                phase === "preparing" ? { scale: 1.06 } : { scale: 1 }
              }
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center"
            >
              <div
                className="flex items-center gap-3"
                style={{ animation: phase === "idle" ? "float 3s ease-in-out infinite" : "none" }}
              >
                <div className="relative rounded-full border border-accent/25 bg-gradient-to-br from-accent to-secondary-accent p-2.5 shadow-[0_0_20px_rgba(50,213,131,0.15)]">
                  <Search className="h-5 w-5 text-primary-bg" />
                </div>
                <span className="font-display text-2xl font-bold tracking-tight text-white">
                  Inspect<span className="text-accent">IQ</span>
                </span>
              </div>
            </motion.div>

            {/* Welcome */}
            <div className="mt-8 text-center">
              <h1 className="text-[22px] font-semibold tracking-tight text-white">
                Welcome Back
              </h1>
              <p className="mt-1.5 text-sm text-slate-400">
                Sign in to continue to the InspectIQ Dashboard.
              </p>
            </div>

            {/* Form / States */}
            <AnimatePresence mode="wait">
              {phase === "idle" && (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mt-8 space-y-4"
                >
                  {/* Error banner */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-danger/20 bg-danger/[0.06] px-4 py-2.5 text-xs text-danger"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Email */}
                  <div className="group relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-accent/20 bg-primary-bg/70 shadow-[0_0_8px_rgba(50,213,131,0.12)] transition-all duration-300 group-focus-within:border-accent/40 group-focus-within:shadow-[0_0_12px_rgba(50,213,131,0.25)]">
                        <Mail className="h-3.5 w-3.5 text-accent" />
                      </span>
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); clearError(); }}
                      placeholder="Email address"
                      className="w-full rounded-2xl border border-white/[0.07] bg-secondary-bg/70 py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-accent/30 focus:ring-2 focus:ring-accent/15 backdrop-blur-sm"
                    />
                  </div>

                  {/* Password */}
                  <div className="group relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-accent/20 bg-primary-bg/70 shadow-[0_0_8px_rgba(50,213,131,0.12)] transition-all duration-300 group-focus-within:border-accent/40 group-focus-within:shadow-[0_0_12px_rgba(50,213,131,0.25)]">
                        <Lock className="h-3.5 w-3.5 text-accent" />
                      </span>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); clearError(); }}
                      placeholder="Password"
                      className="w-full rounded-2xl border border-white/[0.07] bg-secondary-bg/70 py-3.5 pl-12 pr-11 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-accent/30 focus:ring-2 focus:ring-accent/15 backdrop-blur-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors hover:text-slate-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Remember + Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-white/20 bg-secondary-bg text-accent accent-accent"
                      />
                      <span className="text-xs text-slate-400">
                        Remember me
                      </span>
                    </label>
                    <button
                      type="button"
                      className="text-xs text-slate-500 transition-colors hover:text-accent"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Sign In */}
                  <div className="relative overflow-hidden rounded-2xl">
                    <button
                      type="submit"
                      onClick={handleRipple}
                      className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-accent to-secondary-accent py-3.5 text-sm font-semibold text-primary-bg transition-all duration-300 hover:shadow-[0_0_30px_rgba(50,213,131,0.2)] active:scale-[0.98]"
                    >
                      {ripple && (
                        <span
                          key={ripple.id}
                          className="absolute rounded-full bg-white/20"
                          style={{
                            left: ripple.x - 4,
                            top: ripple.y - 4,
                            width: 8,
                            height: 8,
                            animation: "ripple 0.6s ease-out forwards",
                          }}
                        />
                      )}
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.form>
              )}

              {phase === "authenticating" && (
                <motion.div
                  key="authenticating"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8"
                >
                  <div className="flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-accent to-secondary-accent py-3.5 text-sm font-semibold text-primary-bg opacity-80">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authenticating...
                  </div>
                </motion.div>
              )}

              {phase === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8"
                >
                  <div className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-accent/20 bg-accent/[0.04] py-3.5 text-sm font-semibold text-accent">
                    <CheckCircle className="h-4 w-4" />
                    Authentication Successful
                  </div>
                </motion.div>
              )}

              {phase === "preparing" && (
                <motion.div
                  key="preparing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8 space-y-4"
                >
                  <p className="text-center text-xs text-slate-500">
                    Preparing Inspection Workspace...
                  </p>
                  <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-secondary-accent"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  <p className="text-center text-[11px] text-slate-600">
                    {Math.round(progress * 100)}%
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Contact link */}
            {phase === "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 text-center"
              >
                <p className="text-xs text-slate-500">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="text-accent/70 transition-colors hover:text-accent"
                  >
                    Contact Administrator
                  </button>
                </p>
              </motion.div>
            )}

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 text-center"
            >
              <p className="text-[10px] leading-relaxed tracking-wide text-slate-600">
                InspectIQ AOI Platform
              </p>
              <p className="text-[10px] leading-relaxed text-slate-600/50">
                Embedded Explainable AI for PCB Inspection
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
