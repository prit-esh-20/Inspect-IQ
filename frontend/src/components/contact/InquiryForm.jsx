"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Clock, Sparkles, ChevronDown, Check } from "lucide-react";

const subjects = [
  { value: "project", label: "Project Inquiry" },
  { value: "collaboration", label: "Research Collaboration" },
  { value: "technical", label: "Technical Discussion" },
  { value: "demo", label: "Demo Request" },
  { value: "feature", label: "Feature Suggestion" },
  { value: "general", label: "General Question" },
];

function validate(fields) {
  const errors = {};
  if (!fields.name.trim()) errors.name = "Full name is required";
  if (!fields.company.trim()) errors.company = "Company / College is required";
  if (!fields.email.trim()) {
    errors.email = "Email address is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Please enter a valid email address";
  }
  if (!fields.subject) errors.subject = "Please select an inquiry type";
  if (!fields.message.trim()) {
    errors.message = "Message is required";
  } else if (fields.message.trim().length < 20) {
    errors.message = "Message must be at least 20 characters";
  }
  return errors;
}

function SelectField({ value, onChange, error, label }) {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = useRef(null);
  const listRef = useRef(null);

  const selected = subjects.find((s) => s.value === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open]);

  useEffect(() => {
    if (open && listRef.current && focusedIndex >= 0) {
      const el = listRef.current.children[focusedIndex];
      if (el) el.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex, open]);

  useEffect(() => {
    const list = listRef.current;
    if (!open || !list) return;
    const scrollable = list.querySelector(".dropdown-scroll");
    if (!scrollable) return;
    const handler = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = scrollable;
      const atTop = scrollTop === 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight;
      if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    scrollable.addEventListener("wheel", handler, { passive: false });
    return () => scrollable.removeEventListener("wheel", handler);
  }, [open]);

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        setFocusedIndex(0);
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev < subjects.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : subjects.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0) {
          onChange(subjects[focusedIndex].value);
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  const triggerBorder = error
    ? "border-red-500/50"
    : open
      ? "border-accent/50"
      : "border-accent/10 hover:border-accent/25";

  return (
    <div ref={ref} className="relative">
      <label className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500 mb-1.5 block">Subject</label>
      <motion.div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Subject"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => setOpen((prev) => !prev)}
        animate={error ? { x: [0, -4, 4, -4, 4, -2, 2, 0] } : {}}
        transition={{ duration: 0.35 }}
        className={`flex cursor-pointer items-center justify-between rounded-xl border bg-[rgba(7,17,15,0.6)] px-4 py-3 backdrop-blur-md transition-all duration-250 outline-none ${triggerBorder} ${
          open ? "shadow-[0_0_20px_rgba(50,213,131,0.08)]" : ""
        }`}
      >
        <span className={`text-sm ${selected ? "text-white" : "text-slate-500"}`}>
          {selected ? selected.label : "Select inquiry type"}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={listRef}
            role="listbox"
            initial={{ opacity: 0, y: -6, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "top" }}
            className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-accent/15 bg-[rgba(13,27,23,0.95)] backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
          >
            <div className="dropdown-scroll max-h-48 overflow-y-auto py-1 scrollbar-thin">
              {subjects.map((s, i) => {
                const isSelected = s.value === value;
                const isFocused = i === focusedIndex;
                return (
                  <div
                    key={s.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(s.value)}
                    onMouseEnter={() => setFocusedIndex(i)}
                    className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? "text-accent bg-accent/8"
                        : isFocused
                          ? "text-white bg-accent/5"
                          : "text-slate-300 hover:bg-accent/5 hover:text-white"
                    }`}
                  >
                    <span>{s.label}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-accent" style={{ filter: "drop-shadow(0 0 6px rgba(50,213,131,0.5))" }} />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-1 text-[10px] text-red-400">{error}</p>}

      <AnimatePresence>
        {value && !error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 flex items-center gap-1 text-[9px] text-accent/70"
          >
            <Check className="h-3 w-3" />
            {subjects.find((s) => s.value === value)?.label} selected
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function InquiryForm() {
  const [form, setForm] = useState({ name: "", company: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubjectChange = (value) => {
    setForm((prev) => ({ ...prev, subject: value }));
    if (errors.subject) setErrors((prev) => ({ ...prev, subject: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  const fieldClasses = (name) =>
    `w-full rounded-xl border bg-[rgba(7,17,15,0.6)] px-4 py-3 text-sm text-white placeholder-slate-500 backdrop-blur-md transition-all duration-250 outline-none focus:border-accent/50 focus:shadow-[0_0_20px_rgba(50,213,131,0.08)] ${
      errors[name] ? "border-red-500/50" : "border-accent/10 hover:border-accent/25"
    }`;

  const labelClasses = "text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500 mb-1.5 block";

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center justify-center rounded-2xl border border-accent/15 bg-[rgba(13,27,23,0.75)] p-10 backdrop-blur-xl text-center min-h-[400px]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/20 bg-accent/10 mb-5"
        >
          <CheckCircle2 className="h-8 w-8 text-accent" />
        </motion.div>
        <h3 className="font-display text-xl font-semibold text-white">Inquiry Submitted</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
          Thank you for contacting PCBVision. Our research team will get back to you shortly.
        </p>
        <div className="mt-6 flex items-center gap-2 rounded-full border border-accent/10 bg-accent/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-accent">
          <Clock className="h-3.5 w-3.5" />
          Expected response within 24 hours
        </div>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border border-accent/10 bg-[rgba(13,27,23,0.75)] p-6 backdrop-blur-xl md:p-8">
      {/* Sidebar info row — desktop only */}
      <div className="hidden lg:flex items-center gap-4 mb-6 pb-5 border-b border-accent/8">
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <Clock className="h-3.5 w-3.5 text-accent" />
          Response Time: <span className="text-accent font-medium">Within 24 Hours</span>
        </div>
        <div className="w-px h-4 bg-accent/10" />
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Research Focus: <span className="text-accent font-medium">Explainable AI &middot; PCB Inspection &middot; CV</span>
        </div>
        <div className="w-px h-4 bg-accent/10" />
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_6px_rgba(50,213,131,0.6)]" />
          Open for Collaboration
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Name + Company row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className={fieldClasses("name")} />
            {errors.name && <p className="mt-1 text-[10px] text-red-400">{errors.name}</p>}
          </div>
          <div>
            <label className={labelClasses}>Company / College</label>
            <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Company or institution" className={fieldClasses("company")} />
            {errors.company && <p className="mt-1 text-[10px] text-red-400">{errors.company}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelClasses}>Email Address</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={fieldClasses("email")} />
          {errors.email && <p className="mt-1 text-[10px] text-red-400">{errors.email}</p>}
        </div>

        {/* Subject — Custom Enterprise Dropdown */}
        <SelectField
          value={form.subject}
          onChange={handleSubjectChange}
          error={errors.subject}
          label="Subject"
        />

        {/* Message */}
        <div>
          <label className={labelClasses}>Message</label>
          <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Tell us about your inquiry..." className={`${fieldClasses("message")} resize-none`} />
          {errors.message && <p className="mt-1 text-[10px] text-red-400">{errors.message}</p>}
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={!isSubmitting ? { scale: 1.01, boxShadow: "0 0 30px rgba(50,213,131,0.35)" } : {}}
          whileTap={!isSubmitting ? { scale: 0.99 } : {}}
          className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-accent to-[#7ce7ac] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.22em] text-[#07110F] transition-all duration-250 disabled:opacity-70"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2.5">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending Inquiry...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2.5">
              Send Inquiry
              <Send className="h-4 w-4" />
            </span>
          )}
        </motion.button>
      </form>
    </div>
  );
}
