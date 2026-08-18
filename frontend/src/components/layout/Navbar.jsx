import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import { scrollToSection } from "../../hooks/useSmoothScroll";

const links = [
  { name: "Home", id: "home" },
  { name: "About", id: "about" },
  { name: "Features", id: "features" },
  { name: "Technology", id: "technology" },
  { name: "Workflow", id: "workflow" },
  { name: "Contact", id: "contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0.15, 0.35, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (event, targetId) => {
    event.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;
    window.history.replaceState(null, "", `#${targetId}`);
    setActiveSection(targetId);
    scrollToSection(target);
  };

  return (
    <motion.header
      initial={{ y: -44, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 z-50 w-full px-4 py-4 md:px-8"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-[rgba(50,213,131,0.16)] bg-[rgba(7,17,15,0.76)] px-5 py-3 backdrop-blur-xl shadow-[0_12px_45px_rgba(0,0,0,0.28)]">
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative rounded-full border border-[rgba(0,255,136,0.3)] bg-gradient-to-br from-[#00ff88] to-[#00e573] p-2.5">
            <Search className="h-5 w-5 text-[#07110F] transition-transform duration-300 group-hover:scale-110" />
            <motion.span
              className="absolute inset-0 rounded-full border border-[#00ff88]"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div className="flex flex-col justify-center">
              <span className="font-display text-base font-bold leading-none tracking-[0.1em] text-white">
                <span className="text-accent">PCB</span>Vision
              </span>
            <span className="mt-1 text-[10px] font-medium uppercase leading-none tracking-[0.14em] text-slate-400">
              Intelligent PCB Inspection
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={`#${link.id}`}
                onClick={(event) => handleNavClick(event, link.id)}
                className={`text-[11px] font-medium uppercase tracking-[0.24em] transition-all duration-300 ${
                  isActive ? "text-accent" : "text-slate-400 hover:text-white"
                }`}
              >
                <span className="relative">
                  {link.name}
                  {isActive && (
                    <span className="absolute inset-x-0 -bottom-1.5 h-px rounded-full bg-accent/80" />
                  )}
                </span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden items-center gap-2 rounded-full border border-[rgba(50,213,131,0.16)] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-300 transition-colors hover:border-[rgba(50,213,131,0.32)] hover:text-white sm:flex"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Login
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#07110F] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(50,213,131,0.28)]"
          >
            Launch Dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
