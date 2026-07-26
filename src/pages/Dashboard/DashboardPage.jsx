import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../components/layout/Sidebar";
import PageWrapper from "../../components/layout/PageWrapper";
import GlassCard from "../../components/cards/GlassCard";
import StatusBadge from "../../components/common/StatusBadge";
import AnimatedNumber from "../../components/common/AnimatedNumber";
import { useAuth } from "../../context/AuthContext";
import { mockApi } from "../../services/mockApi";
import { DEFECT_CHART_DATA, TREND_7_DAYS } from "../../utils/mockData";
import {
  AreaChart, Area, ResponsiveContainer,
} from "recharts";
import {
  Play, Pause, Camera,
  AlertTriangle, CheckCircle, Clock, RefreshCw,
  Search, Bell, Upload, FileText, Download, Image,
  Target, ChevronDown, Settings, LogOut, User, X,
  Scan, Layers, GitBranch, Info,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const sparklineData = TREND_7_DAYS.map((d) => ({ value: d.passRate }));

const notifications = [
  { id: 1, text: "Inspection Failed — PCB-2026-2583", time: "2m ago", type: "fail" },
  { id: 2, text: "New Report Generated — Q3 Summary", time: "15m ago", type: "info" },
  { id: 3, text: "Camera #1 Back Online", time: "1h ago", type: "success" },
  { id: 4, text: "Model Updated to v8.0.3-xai", time: "2h ago", type: "info" },
];

const inspectionTimeline = [
  { step: "Capture", icon: Camera, done: true },
  { step: "YOLO", icon: Scan, done: true },
  { step: "Grad-CAM", icon: Layers, done: true },
  { step: "X-MCCV", icon: GitBranch, done: true },
  { step: "Result", icon: CheckCircle, done: null },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentRuns, setRecentRuns] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [isLiveRunning, setIsLiveRunning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showGradCam, setShowGradCam] = useState(false);
  const [showSummaryOverlay, setShowSummaryOverlay] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    mockApi.getStatistics().then((res) => setStats(res));
    mockApi.getLiveActivities().then((res) => setRecentRuns(res));
    setActiveBoard(mockApi.generateLiveInspection());
  }, []);

  useEffect(() => {
    if (!isLiveRunning) return;
    const interval = setInterval(() => {
      const nextBoard = mockApi.generateLiveInspection();
      setScanProgress(0);
      let curStep = 0;
      const steps = 25;
      const scanTimer = setInterval(() => {
        curStep += 1;
        setScanProgress((curStep / steps) * 100);
        if (curStep >= steps) {
          clearInterval(scanTimer);
          setActiveBoard(nextBoard);
          setStats((prev) => {
            if (!prev) return prev;
            const isPass = nextBoard.status === "PASS";
            const newInspected = prev.today.inspected + 1;
            const newPass = prev.today.pass + (isPass ? 1 : 0);
            const newFail = prev.today.fail + (isPass ? 0 : 1);
            return {
              ...prev,
              today: {
                ...prev.today,
                inspected: newInspected,
                pass: newPass,
                fail: newFail,
                passRate: (newPass / newInspected) * 100,
                avgCycleTime: prev.today.avgCycleTime * 0.9 + parseFloat(nextBoard.cycleTime) * 0.1,
              },
            };
          });
          setRecentRuns((prev) => [
            {
              id: nextBoard.id,
              time: "Just now",
              model: nextBoard.model,
              status: nextBoard.status,
              defect: nextBoard.defect,
              cycleTime: nextBoard.cycleTime,
              operator: nextBoard.operator,
            },
            ...prev.slice(0, 4),
          ]);
        }
      }, 70);
      return () => clearInterval(scanTimer);
    }, 3500);
    return () => clearInterval(interval);
  }, [isLiveRunning]);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const formatTime = (d) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const formatDate = (d) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  const defectTotal = DEFECT_CHART_DATA.reduce((s, d) => s + d.count, 0);
  const worstDefect = [...DEFECT_CHART_DATA].sort((a, b) => b.count - a.count)[0];
  const avgConfidence = 87.3;

  const aiMetrics = [
    { label: "YOLO", value: 94.2, color: "#32d583" },
    { label: "Grad-CAM", value: 91.8, color: "#7ce7ac" },
    { label: "X-MCCV", value: 96.5, color: "#06b6d4" },
  ];

  const trustScore = 92.7;

  const components = [
    { name: "U1 (Main IC)", status: "PASS", confidence: 99.8, reason: "All pins detected, orientation correct", presence: true, position: true, orientation: true, count: true },
    { name: "C12 (Filter Cap)", status: "PASS", confidence: 98.4, reason: "Capacitance within tolerance", presence: true, position: true, orientation: true, count: true },
    { name: "R8 (Pull-up)", status: "PASS", confidence: 97.9, reason: "Resistance value nominal", presence: true, position: true, orientation: true, count: true },
  ];

  const handleComponentClick = (comp) => {
    setSelectedComponent(comp === selectedComponent ? null : comp);
  };

  return (
    <PageWrapper className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 pl-56 h-screen overflow-y-auto overflow-x-hidden" data-lenis-prevent>
        {/* ========== TOP BAR ========== */}
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-accent/10 bg-primary-bg/90 px-6 backdrop-blur-xl">
          <div className={`relative flex items-center transition-all duration-300 ${searchFocused ? "w-[500px]" : "w-80"}`}>
            <Search className="absolute left-3 h-4 w-4 text-slate-500 transition-colors duration-300 group-focus-within:text-accent" />
            <input
              ref={searchRef}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search Boards, Reports, Components..."
              className="w-full rounded-lg border border-white/[0.06] bg-secondary-bg/60 py-2 pl-10 pr-16 text-xs text-white placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-accent/30 focus:ring-2 focus:ring-accent/15 backdrop-blur-sm"
            />
            <span className="absolute right-3 rounded border border-white/[0.06] px-1.5 py-0.5 text-[9px] text-slate-600 font-mono">Ctrl+K</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-danger text-[7px] font-bold text-white">{notifications.length}</span>
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-10 w-72 rounded-xl border border-accent/10 bg-card-bg p-3 shadow-2xl backdrop-blur-2xl"
                  >
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Notifications</p>
                    <div className="space-y-1">
                      {notifications.map((n) => (
                        <div key={n.id} className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-xs text-slate-300 transition-colors hover:bg-white/5">
                          <span className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${n.type === "fail" ? "bg-danger" : n.type === "success" ? "bg-success" : "bg-accent"}`} />
                          <div className="flex-1">
                            <p>{n.text}</p>
                            <p className="text-[10px] text-slate-600">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative" ref={userRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-lg border border-white/[0.06] px-3 py-1.5 transition-colors hover:border-accent/20 hover:bg-white/5"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-primary-bg">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
                <span className="text-xs font-medium text-white">{user?.name || "User"}</span>
                <ChevronDown className="h-3 w-3 text-slate-500" />
              </button>
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-48 rounded-xl border border-accent/10 bg-card-bg p-2 shadow-2xl backdrop-blur-2xl"
                  >
                    {[{ label: "Profile", icon: User }, { label: "Settings", icon: Settings }].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button key={item.label} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-300 transition-colors hover:bg-white/5 hover:text-white">
                          <Icon className="h-3.5 w-3.5" />{item.label}
                        </button>
                      );
                    })}
                    <div className="my-1 border-t border-accent/5" />
                    <button
                      onClick={() => { logout(); window.location.href = "/"; }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-400 transition-colors hover:bg-white/5 hover:text-danger"
                    >
                      <LogOut className="h-3.5 w-3.5" />Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ========== MAIN CONTENT ========== */}
        <motion.main variants={containerVariants} initial="hidden" animate="visible" className="space-y-5 p-6">

          {/* ---- HEADER ---- */}
          <motion.div variants={itemVariants} className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">InspectIQ</h1>
              <p className="text-xs text-slate-500">PCB Inspection Control Console</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-right">
              <div className="text-right">
                <p className="font-mono text-sm font-bold text-white">{formatTime(currentTime)}</p>
                <p className="font-mono text-[10px] text-slate-500">{formatDate(currentTime)}</p>
              </div>
              <div className="h-10 w-px bg-accent/10" />
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success led-fast" />
                  <span className="font-mono text-xs font-bold text-success uppercase tracking-wider">Live</span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  {[
                    { label: "FPS", value: stats?.today?.fps || "29.8", color: "text-accent" },
                    { label: "CPU", value: "24%", color: "text-accent" },
                    { label: "TEMP", value: "48°C", color: "text-warning" },
                  ].map((m) => (
                    <span key={m.label} className="font-mono text-[10px] text-slate-500">
                      <span className="text-slate-600">{m.label}</span>{" "}
                      <span className={`font-semibold ${m.color}`}>{m.value}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ---- QUICK ACTIONS ---- */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
            {[
              { label: "Start Inspection", icon: Play, primary: true },
              { label: "Upload PCB Image", icon: Upload },
              { label: "Generate Report", icon: FileText },
              { label: "Export CSV", icon: Download },
              { label: "Capture Snapshot", icon: Image },
            ].map((action) => {
              const Icon = action.icon;
              return action.primary ? (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-primary-bg shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(50,213,131,0.25)]"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {action.label}
                </motion.button>
              ) : (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-2 rounded-xl border border-accent/20 bg-white/[0.03] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-accent/40 hover:bg-accent/5 hover:text-white hover:shadow-[0_0_20px_rgba(50,213,131,0.1)]"
                >
                  <Icon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  {action.label}
                </motion.button>
              );
            })}
          </motion.div>

          {/* ---- KPI CARDS ---- */}
          {stats && (
            <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Boards Inspected Today", value: stats.today.inspected, icon: Camera, trend: "+1.8%", up: true, sparkColor: "#32d583" },
                { title: "Pass Rate", value: stats.today.passRate, decimals: 1, suffix: "%", icon: CheckCircle, trend: "+2.1%", up: true, sparkColor: "#32d583" },
                { title: "Failed Boards", value: stats.today.fail, icon: AlertTriangle, trend: "-4.2%", up: false, sparkColor: "#ff4d6d" },
                { title: "Avg Inspection Time", value: stats.today.avgCycleTime, decimals: 2, suffix: "s", icon: Clock, trend: "-1.5%", up: true, sparkColor: "#32d583" },
              ].map((card) => (
                <GlassCard key={card.title} className="group relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-400">{card.title}</span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono text-3xl font-extrabold text-white">
                          <AnimatedNumber end={card.value} decimals={card.decimals || 0} duration={1.8} />
                        </span>
                        {card.suffix && <span className="text-sm font-semibold text-accent">{card.suffix}</span>}
                      </div>
                    </div>
                    <div className="rounded-lg border border-accent/15 bg-accent/5 p-2.5 transition-colors duration-300 group-hover:border-accent/40 group-hover:bg-accent/10">
                      <card.icon className="h-5 w-5 text-accent transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-accent/5 pt-3">
                    <span className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold ${card.up ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                      {card.up ? "↑" : "↓"} {card.trend}
                    </span>
                    <div className="h-6 w-12">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sparklineData}>
                          <Area type="monotone" dataKey="value" stroke={card.sparkColor} fill={card.sparkColor} fillOpacity={0.15} strokeWidth={1.5} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          )}

          {/* ---- MAIN GRID ---- */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

            {/* ---- CAMERA PANEL (8 cols) ---- */}
            <motion.div variants={itemVariants} className="lg:col-span-8 space-y-4">
              <GlassCard className="flex flex-col" hoverLift={false}>
                {/* Camera header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-accent/5 pb-3">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-accent" />
                    <span className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-400">Inspection Viewport</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowGradCam(!showGradCam)}
                      className={`rounded-md px-2.5 py-1 text-[9px] font-mono font-semibold uppercase tracking-wider transition-all ${
                        showGradCam ? "bg-accent/15 text-accent border border-accent/30" : "text-slate-500 border border-transparent hover:text-slate-300"
                      }`}
                    >
                      Grad-CAM
                    </button>
                    <button
                      onClick={() => setShowSummaryOverlay(!showSummaryOverlay)}
                      className="flex items-center gap-1 rounded-md border border-accent/10 px-2.5 py-1 text-[9px] font-mono font-semibold uppercase tracking-wider text-slate-500 transition-all hover:text-slate-300"
                    >
                      <Info className="h-3 w-3" />
                      Summary
                    </button>
                    <button
                      onClick={() => setIsLiveRunning(!isLiveRunning)}
                      className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-[9px] font-display font-bold uppercase tracking-wider transition-all ${
                        isLiveRunning ? "border-accent/30 bg-accent/10 text-accent hover:bg-accent/20" : "border-amber-500/30 bg-amber-500/10 text-warning hover:bg-amber-500/25"
                      }`}
                    >
                      {isLiveRunning ? <Pause className="h-3 w-3 fill-current" /> : <Play className="h-3 w-3 fill-current" />}
                      {isLiveRunning ? "Live" : "Paused"}
                    </button>
                  </div>
                </div>

                {/* Viewport (taller) */}
                <div className="relative my-4 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-accent/5 bg-black/95">
                  {/* Grid */}
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(50,213,131,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(50,213,131,0.05) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

                  {/* Camera HUD - Top left */}
                  <div className="absolute left-3 top-3 z-20 flex items-center gap-3 rounded-lg bg-black/70 border border-accent/10 px-2.5 py-1.5 font-mono text-[9px] backdrop-blur-sm">
                    <span className="flex items-center gap-1.5 text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success led-fast" />
                      LIVE
                    </span>
                    <span className="text-slate-400">CAM 01</span>
                    <span className="text-accent">{stats?.today?.fps || "29.8"} FPS</span>
                  </div>

                  {/* PCB SVG */}
                  <svg className="h-full w-full opacity-70" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="30" y="20" width="540" height="360" rx="12" stroke="#32d583" strokeWidth="1.5" opacity="0.5" />
                    <circle cx="55" cy="45" r="6" stroke="#32d583" strokeWidth="1" opacity="0.4" />
                    <circle cx="545" cy="45" r="6" stroke="#32d583" strokeWidth="1" opacity="0.4" />
                    <circle cx="55" cy="355" r="6" stroke="#32d583" strokeWidth="1" opacity="0.4" />
                    <circle cx="545" cy="355" r="6" stroke="#32d583" strokeWidth="1" opacity="0.4" />
                    <rect x="220" y="120" width="160" height="160" rx="4" stroke="#32d583" strokeWidth="1.5" opacity="0.6" />
                    <circle cx="300" cy="200" r="35" stroke="#32d583" strokeWidth="1" opacity="0.4" />
                    <circle cx="220" cy="120" r="3" fill="#32d583" opacity="0.6" />
                    <path d="M380 200h80M140 200h-40M300 120V80M300 320v40" stroke="#32d583" strokeWidth="1" opacity="0.3" />
                    <path d="M220 160H140M460 240h40" stroke="#32d583" strokeWidth="1" opacity="0.3" />
                    <rect x="70" y="60" width="35" height="50" rx="3" stroke="#32d583" strokeWidth="1" opacity="0.5" />
                    <rect x="70" y="290" width="35" height="50" rx="3" stroke="#32d583" strokeWidth="1" opacity="0.5" />
                    <rect x="495" y="60" width="35" height="50" rx="3" stroke="#32d583" strokeWidth="1" opacity="0.5" />
                    <rect x="120" y="70" width="20" height="8" rx="1" stroke="#32d583" strokeWidth="1" opacity="0.4" />
                    <rect x="120" y="85" width="20" height="8" rx="1" stroke="#32d583" strokeWidth="1" opacity="0.4" />
                    <rect x="460" y="290" width="20" height="8" rx="1" stroke="#32d583" strokeWidth="1" opacity="0.4" />
                    <rect x="200" y="350" width="200" height="30" rx="3" stroke="#32d583" strokeWidth="1" opacity="0.5" />
                    <line x1="220" y1="365" x2="220" y2="380" stroke="#32d583" strokeWidth="1" opacity="0.3" />
                    <line x1="260" y1="365" x2="260" y2="380" stroke="#32d583" strokeWidth="1" opacity="0.3" />
                    <line x1="300" y1="365" x2="300" y2="380" stroke="#32d583" strokeWidth="1" opacity="0.3" />
                    <line x1="340" y1="365" x2="340" y2="380" stroke="#32d583" strokeWidth="1" opacity="0.3" />
                    <line x1="380" y1="365" x2="380" y2="380" stroke="#32d583" strokeWidth="1" opacity="0.3" />
                    <text x="222" y="115" fill="#32d583" fontSize="7" fontFamily="monospace" opacity="0.6">U1</text>
                    <text x="72" y="55" fill="#32d583" fontSize="6" fontFamily="monospace" opacity="0.5">C12</text>
                    <text x="72" y="285" fill="#32d583" fontSize="6" fontFamily="monospace" opacity="0.5">C13</text>
                    <text x="122" y="65" fill="#32d583" fontSize="5" fontFamily="monospace" opacity="0.4">R8</text>
                  </svg>

                  {/* YOLO detection boxes */}
                  <AnimatePresence>
                    {activeBoard && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="absolute border-2 border-success/50 bg-success/5 rounded cursor-pointer"
                          style={{ left: "35%", top: "28%", width: "28%", height: "42%" }}
                          onClick={() => handleComponentClick(components[0])}
                        >
                          <span className="absolute -top-3.5 left-0 font-mono text-[7px] text-success font-bold bg-black/80 px-1 rounded whitespace-nowrap">U1 99.8%</span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                          className="absolute border border-success/40 bg-success/5 rounded cursor-pointer"
                          style={{ left: "11%", top: "14%", width: "6%", height: "13%" }}
                          onClick={() => handleComponentClick(components[1])}
                        >
                          <span className="absolute -top-3.5 left-0 font-mono text-[7px] text-success font-bold bg-black/80 px-1 rounded whitespace-nowrap">C12 98.4%</span>
                        </motion.div>
                        {activeBoard.status === "FAIL" && activeBoard.defectCoordinates && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute border-2 border-danger bg-danger/10 flex flex-col justify-start rounded font-mono text-[9px] font-bold p-1 animate-pulse cursor-pointer"
                            style={{
                              left: `${(activeBoard.defectCoordinates.x / 600) * 100}%`,
                              top: `${(activeBoard.defectCoordinates.y / 400) * 100}%`,
                              width: `${(activeBoard.defectCoordinates.radius * 2 / 600) * 100}%`,
                              height: `${(activeBoard.defectCoordinates.radius * 2 / 400) * 100}%`,
                            }}
                          >
                            <span className="text-danger text-[7px]">{activeBoard.defect.toUpperCase()}</span>
                            <span className="text-danger/80 text-[7px]">CONF: {activeBoard.confidence}%</span>
                          </motion.div>
                        )}
                      </>
                    )}
                  </AnimatePresence>

                  {/* Grad-CAM overlay (toggle) */}
                  {showGradCam && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.25 }}
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      style={{ background: `radial-gradient(circle at ${activeBoard?.defectCoordinates?.x ? `${(activeBoard.defectCoordinates.x / 600) * 100}%` : "50%"} ${activeBoard?.defectCoordinates?.y ? `${(activeBoard.defectCoordinates.y / 400) * 100}%` : "50%"}, rgba(50,213,131,0.3) 0%, rgba(50,213,131,0.05) 40%, transparent 70%)` }}
                    />
                  )}

                  {/* Laser scan */}
                  {isLiveRunning && (
                    <motion.div className="absolute left-0 w-full"
                      style={{ height: "2px", top: `${scanProgress}%`, background: "linear-gradient(90deg, transparent, #32d583, #7ce7ac, #32d583, transparent)", boxShadow: "0 0 10px 3px rgba(50,213,131,0.5)" }}
                    />
                  )}

                  {/* Bottom HUD - simplified */}
                  {activeBoard && (
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 rounded-lg bg-black/80 border border-accent/15 px-3 py-1.5 font-mono text-[9px] backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">Board:</span>
                        <span className="font-bold text-white">{activeBoard.id}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={activeBoard.status} />
                        <span className="text-slate-500">
                          Conf: <span className="text-white">{activeBoard.confidence}%</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Compact Inspection Summary Overlay */}
                  <AnimatePresence>
                    {showSummaryOverlay && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-3 top-12 z-30 w-56 rounded-xl border border-accent/10 bg-black/90 p-3 backdrop-blur-xl"
                      >
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                          {[
                            { label: "Components", value: "42" },
                            { label: "Detected", value: "42", color: "text-success" },
                            { label: "Missing", value: "0", color: "text-success" },
                            { label: "Orient. Err.", value: "0", color: "text-success" },
                            { label: "X-MCCV", value: "100%", color: "text-accent" },
                            { label: "Confidence", value: `${activeBoard?.confidence || "98.5"}%`, color: "text-accent" },
                          ].map((s) => (
                            <div key={s.label} className="flex items-center justify-between border-b border-accent/[0.04] py-0.5">
                              <span className="text-[8px] font-mono text-slate-500">{s.label}</span>
                              <span className={`font-mono text-[9px] font-bold ${s.color || "text-white"}`}>{s.value}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 flex items-center justify-between border-t border-accent/10 pt-2">
                          {inspectionTimeline.map((step, i) => {
                            const Icon = step.icon;
                            return (
                              <div key={step.step} className="flex flex-col items-center gap-0.5">
                                <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${step.done === null ? "border-accent/30 bg-accent/10" : step.done ? "border-success/30 bg-success/10" : "border-slate-700 bg-slate-800"}`}>
                                  <Icon className={`h-2.5 w-2.5 ${step.done === null ? "text-accent" : step.done ? "text-success" : "text-slate-500"}`} />
                                </div>
                                <span className="font-mono text-[6px] text-slate-500">{step.step}</span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GlassCard>
            </motion.div>

            {/* ---- RIGHT COLUMN (4 cols) ---- */}
            <div className="flex flex-col gap-6 lg:col-span-4">

              {/* ---- DEFECT ANALYTICS (simplified) ---- */}
              <motion.div variants={itemVariants}>
                <GlassCard hoverLift={false}>
                  <div className="flex items-center gap-1.5 border-b border-accent/5 pb-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-400">Defect Analytics</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-lg border border-accent/10 bg-[#050816]/60 px-4 py-3">
                      <p className="text-[9px] font-mono text-slate-500">Top Defect Type</p>
                      <p className="font-mono text-sm font-bold text-white">{worstDefect.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-accent/10 bg-[#050816]/60 px-4 py-3 text-center">
                        <p className="text-[9px] font-mono text-slate-500">Defects</p>
                        <p className="font-mono text-lg font-bold text-danger">{defectTotal}</p>
                      </div>
                      <div className="rounded-lg border border-accent/10 bg-[#050816]/60 px-4 py-3 text-center">
                        <p className="text-[9px] font-mono text-slate-500">Avg Confidence</p>
                        <p className="font-mono text-lg font-bold text-accent">{avgConfidence}%</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* ---- EXPLAINABLE AI (4 metrics) ---- */}
              <motion.div variants={itemVariants}>
                <GlassCard hoverLift={false}>
                  <div className="flex items-center gap-1.5 border-b border-accent/5 pb-2">
                    <Target className="h-4 w-4 text-accent" />
                    <span className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-400">Explainable AI</span>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    {/* Trust score gauge */}
                    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                      <svg className="h-24 w-24" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                        <motion.circle cx="50" cy="50" r="42" fill="none" stroke="url(#trustGradient)" strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${(trustScore / 100) * 263.9} 263.9`} transform="rotate(-90 50 50)"
                          initial={{ strokeDasharray: "0 263.9" }} animate={{ strokeDasharray: `${(trustScore / 100) * 263.9} 263.9` }}
                          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                        />
                        <defs>
                          <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#32d583" />
                            <stop offset="100%" stopColor="#7ce7ac" />
                          </linearGradient>
                        </defs>
                        <text x="50" y="46" textAnchor="middle" fill="#32d583" fontSize="18" fontFamily="JetBrains Mono" fontWeight="bold">{trustScore}%</text>
                        <text x="50" y="60" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="Inter">Trust Score</text>
                      </svg>
                    </div>
                    {/* 3 small metrics */}
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      {aiMetrics.map((m) => (
                        <div key={m.label} className="flex flex-col items-center gap-1">
                          <div className="relative flex h-14 w-full items-center justify-center">
                            <svg className="h-14 w-full" viewBox="0 0 40 40">
                              <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                              <motion.circle cx="20" cy="20" r="16" fill="none" stroke={m.color} strokeWidth="3" strokeLinecap="round"
                                strokeDasharray={`${(m.value / 100) * 100.5} 100.5`} transform="rotate(-90 20 20)"
                                initial={{ strokeDasharray: "0 100.5" }} animate={{ strokeDasharray: `${(m.value / 100) * 100.5} 100.5` }}
                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                              />
                              <text x="20" y="23" textAnchor="middle" fill={m.color} fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">{m.value}%</text>
                            </svg>
                          </div>
                          <span className="text-[7px] font-mono text-slate-500 text-center leading-tight">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* ---- COMPONENT DETAIL DRAWER ---- */}
              <AnimatePresence>
                {selectedComponent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <GlassCard hoverLift={false}>
                      <div className="flex items-center justify-between border-b border-accent/5 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/15 text-[9px] font-bold text-success">{selectedComponent.name.charAt(0)}</span>
                          <span className="font-display text-[10px] font-bold uppercase tracking-widest text-white">{selectedComponent.name}</span>
                          <StatusBadge status={selectedComponent.status} />
                        </div>
                        <button onClick={() => setSelectedComponent(null)} className="text-slate-500 hover:text-white transition-colors">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <div className="flex justify-between font-mono text-[10px]">
                            <span className="text-slate-500">Confidence</span>
                            <span className="text-accent font-bold">{selectedComponent.confidence}%</span>
                          </div>
                          <div className="flex justify-between font-mono text-[10px]">
                            <span className="text-slate-500">Reason</span>
                            <span className="text-slate-300 text-right max-w-[140px]">{selectedComponent.reason}</span>
                          </div>
                        </div>
                        <div className="rounded-lg border border-accent/5 bg-[#050816]/40 p-2.5">
                          <p className="text-[8px] font-mono text-slate-500 mb-1.5">X-MCCV Verification</p>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                            {[
                              { label: "Presence", pass: selectedComponent.presence },
                              { label: "Position", pass: selectedComponent.position },
                              { label: "Orientation", pass: selectedComponent.orientation },
                              { label: "Count", pass: selectedComponent.count },
                            ].map((v) => (
                              <div key={v.label} className="flex items-center gap-1.5 font-mono text-[9px]">
                                <span className={`h-1.5 w-1.5 rounded-full ${v.pass ? "bg-success" : "bg-danger"}`} />
                                <span className="text-slate-400">{v.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ---- RECENT INSPECTIONS ---- */}
              <motion.div variants={itemVariants}>
                <GlassCard hoverLift={false} className="flex flex-col">
                  <div className="flex items-center justify-between border-b border-accent/5 pb-2">
                    <div className="flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5 text-success" />
                      <span className="font-display text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Inspection Feed</span>
                    </div>
                    <span className="font-mono text-[9px] text-slate-600 uppercase tracking-widest">Real-time</span>
                  </div>
                  <div className="mt-3 flex-1 space-y-1.5 overflow-y-auto pr-1" style={{ maxHeight: "192px" }}>
                    <AnimatePresence initial={false}>
                      {recentRuns.map((run, i) => (
                        <motion.div
                          key={run.id + i}
                          initial={{ opacity: 0, y: -12, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className={`flex items-center justify-between rounded-lg border p-2.5 transition-all hover:border-accent/20 ${
                            run.status === "FAIL" ? "border-danger/20 bg-danger/[0.03]" : run.status === "REVIEW" ? "border-warning/20 bg-warning/[0.03]" : "border-accent/5 bg-[#050816]/40"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`h-2 w-2 shrink-0 rounded-full ${run.status === "PASS" ? "bg-success led-slow" : run.status === "REVIEW" ? "bg-warning" : "bg-danger led-fast"}`} />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-white">{run.id}</span>
                                <span className="text-[9px] text-slate-600">{run.time}</span>
                              </div>
                              <p className="truncate text-[10px] text-slate-500">{run.model}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {run.defect && run.defect !== "None" && (
                              <span className="font-mono text-[8px] text-danger font-semibold uppercase">{run.defect}</span>
                            )}
                            <StatusBadge status={run.status} />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </GlassCard>
              </motion.div>

            </div>
          </div>
        </motion.main>
      </div>
    </PageWrapper>
  );
}
