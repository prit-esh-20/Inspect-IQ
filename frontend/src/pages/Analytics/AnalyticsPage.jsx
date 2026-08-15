import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../components/layout/Sidebar";
import PageWrapper from "../../components/layout/PageWrapper";
import GlassCard from "../../components/cards/GlassCard";
import AnimatedNumber from "../../components/common/AnimatedNumber";
import { 
  DEFECT_CHART_DATA, 
  HOURLY_THROUGHPUT_DATA, 
  TREND_7_DAYS 
} from "../../utils/mockData";
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LabelList,
  ResponsiveContainer 
} from "recharts";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as LucidePie, 
  Clock, 
  Gauge, 
  ShieldCheck, 
  Timer, 
  AlertOctagon, 
  X 
} from "lucide-react";

// ── Semantic palette ─────────────────────────────────────────────────────
const C = {
  pass: "#00FF9C",
  warn: "#FFC857",
  crit: "#FF4D6D",
  info: "#00E5FF",
  xai: "#a855f7",
  glow: "rgba(31,227,138,0.25)",
  tooltipBg: "#08140F",
};

// Unique semantic color per defect category
const BAR_COLORS = {
  "Solder Bridge": "#FF4D6D",
  "Missing Component": "#FFC857",
  "Polarity Mismatch": "#67D5EB",
  "Misalignment": "#22D3EE",
  "Wrong Part": "#A855F7",
};

// ── Floating dark tooltip (white labels, green values) ───────────────────
function ChartTooltip({ active, payload, label, suffix = "" }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="tooltip-pop pointer-events-none rounded-xl border px-4 py-2.5 font-mono"
      style={{
        background: C.tooltipBg,
        border: `1px solid ${C.glow}`,
        borderRadius: 12,
        boxShadow: "0 0 24px rgba(31,227,138,0.12), 0 12px 32px rgba(0,0,0,0.5)",
      }}
    >
      <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "#7ce7ac" }}>
        {label}
      </p>
      <div className="space-y-1">
        {payload.map((entry, i) => {
          if (entry.value == null) return null;
          const color = entry.color || entry.payload?.color || "#32d583";
          return (
            <div key={i} className="flex items-center gap-2 text-[10px]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
              <span className="text-slate-200">{entry.name}</span>
              <span className="ml-3 pl-1 font-bold text-success">{entry.value}{suffix}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Hourly tooltip: Time / Inspected / Passed / Failed / Confidence ──────
function HourlyTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const failed = d.inspected - d.pass;
  const confidence = ((d.pass / d.inspected) * 100).toFixed(1);
  const rows = [
    { label: "Inspected", value: d.inspected, color: C.info },
    { label: "Passed", value: d.pass, color: C.pass },
    { label: "Failed", value: failed, color: C.crit },
    { label: "Confidence", value: `${confidence}%`, color: C.xai },
  ];
  return (
    <div
      className="tooltip-pop pointer-events-none rounded-xl border px-4 py-2.5 font-mono"
      style={{
        background: C.tooltipBg,
        border: `1px solid ${C.glow}`,
        borderRadius: 12,
        boxShadow: "0 0 24px rgba(31,227,138,0.12), 0 12px 32px rgba(0,0,0,0.5)",
      }}
    >
      <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "#7ce7ac" }}>
        {label} Shift
      </p>
      <div className="space-y-1">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-6 text-[10px]">
            <span className="text-slate-200">{r.label}</span>
            <span className="font-bold" style={{ color: r.color }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Glowing vertical crosshair ───────────────────────────────────────────
const GlowCursor = ({ points }) => {
  if (!points || !points.length) return null;
  const x = points[0].x;
  return (
    <g>
      <line x1={x} y1={0} x2={x} y2={2000} stroke="rgba(31,227,138,0.1)" strokeWidth={8} />
      <line x1={x} y1={0} x2={x} y2={2000} stroke="rgba(31,227,138,0.45)" strokeWidth={1} strokeDasharray="4 4" />
    </g>
  );
};

// ── Hovered bar: brighten ~15% + scale 1.02x ────────────────────────────
const ActiveBar = (props) => {
  const { x, y, width, height, fill } = props;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={4}
      fill={fill}
      style={{
        filter: "brightness(1.15)",
        transform: "scaleY(1.02)",
        transformOrigin: "50% 100%",
        transition: "transform 180ms ease-out, filter 180ms ease-out",
      }}
    />
  );
};

// ── Donut sub-stat block ─────────────────────────────────────────────────
function DonutStat({ label, value, decimals = 1, suffix = "%", prefix = "", color, up }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-accent/[0.06] bg-[#0d1b17]/50 px-2 py-2.5">
      <span className="font-mono text-[8px] uppercase tracking-widest text-slate-500">{label}</span>
      <span className={`mt-0.5 flex items-baseline font-mono text-sm font-bold ${color}`}>
        {up && <span className="mr-0.5 text-[9px]">▲</span>}
        {prefix}
        <AnimatedNumber end={value} decimals={decimals} duration={1.4} delay={0.3} />
        {suffix}
      </span>
    </div>
  );
}

// ── Live status pill (top-right of header) ───────────────────────────────
function LiveStatus() {
  const [seconds, setSeconds] = useState(1.5);
  useEffect(() => {
    const start = Date.now();
    const t = setInterval(() => setSeconds((Date.now() - start) / 1000), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success shadow-[0_0_8px_#32d583]" />
        </span>
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-success">LIVE</span>
      </div>
      <span className="font-mono text-[9px] text-slate-500">
        Updated {seconds.toFixed(1)} seconds ago
      </span>
    </div>
  );
}

// ── Compact KPI card ─────────────────────────────────────────────────────
function MiniKpi({ label, value, suffix, decimals, icon: Icon, valueClass, accent, trend, up, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-xl border border-accent/10 bg-[rgba(13,27,23,0.66)] px-4 py-3 backdrop-blur-xl transition-[border-color,box-shadow] duration-250 hover:border-accent/25 hover:shadow-[0_10px_28px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-[9px] font-bold uppercase tracking-widest text-slate-500">
          {label}
        </span>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] transition-all duration-250 group-hover:border-accent/30 group-hover:bg-accent/10 ${accent}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className={`font-mono text-2xl font-extrabold ${valueClass}`}>
          <AnimatedNumber end={value} decimals={decimals || 0} duration={1.4} />
        </span>
        {suffix && <span className="text-xs font-bold text-slate-400">{suffix}</span>}
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        <span className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-mono text-[9px] font-bold ${up ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
          {up ? "▲" : "▼"} {trend}
        </span>
        <span className="font-mono text-[9px] text-slate-600">vs yesterday</span>
      </div>
    </motion.div>
  );
}

// ── Defect detail floating panel (bar click) ─────────────────────────────
const defectDetails = {
  "Solder Bridge": { weekly: 128, boards: ["PCB-1203", "PCB-3102", "PCB-4421"], severity: "Critical", action: "Review soldering profile & stencil alignment. Re-run AOI on affected batch." },
  "Missing Component": { weekly: 96, boards: ["PCB-1188", "PCB-3001", "PCB-4007"], severity: "High", action: "Check pick-and-place feeder calibration and component reel stock." },
  "Polarity Mismatch": { weekly: 64, boards: ["PCB-2051", "PCB-2774", "PCB-3312"], severity: "High", action: "Verify component orientation rules in the placement program." },
  "Misalignment": { weekly: 48, boards: ["PCB-1203", "PCB-3102", "PCB-4421"], severity: "Medium", action: "Re-calibrate fiducial alignment sensors before next shift." },
  "Wrong Part": { weekly: 24, boards: ["PCB-1990", "PCB-2122"], severity: "Critical", action: "Audit component kitting and reel traceability immediately." },
};

const severityStyles = {
  Critical: "border-danger/30 bg-danger/10 text-danger",
  High: "border-warning/30 bg-warning/10 text-warning",
  Medium: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
};

// ── Skeleton loading cards ───────────────────────────────────────────────
function SkeletonCard({ className = "h-[340px]" }) {
  return (
    <div className={`rounded-2xl border border-accent/5 bg-[rgba(13,27,23,0.5)] p-5 ${className}`}>
      <div className="skeleton-shimmer h-3 w-40 rounded-md" />
      <div className="skeleton-shimmer mt-6 h-[70%] rounded-lg" />
    </div>
  );
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedDefect, setSelectedDefect] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const qualitySummaryData = [
    { name: "PASS RATE", value: 93.9, color: C.pass },
    { name: "DEFECT RATE", value: 6.1, color: C.crit },
  ];

  const kpis = [
    { label: "Yield Rate", value: 93.9, suffix: "%", decimals: 1, icon: Gauge, valueClass: "text-success", accent: "text-success", trend: "+1.7%", up: true },
    { label: "Today's Defects", value: 56, icon: AlertOctagon, valueClass: "text-danger", accent: "text-danger", trend: "-4.2%", up: true },
    { label: "Avg Confidence", value: 97.2, suffix: "%", decimals: 1, icon: ShieldCheck, valueClass: "text-accent", accent: "text-accent", trend: "+0.3%", up: true },
    { label: "Inspection Time", value: 0.94, suffix: "s", decimals: 2, icon: Timer, valueClass: "text-cyan-400", accent: "text-cyan-400", trend: "-0.06s", up: true },
  ];

  const selected = selectedDefect ? { ...selectedDefect, ...defectDetails[selectedDefect.name] } : null;

  return (
    <PageWrapper className="flex min-h-screen pl-64 pb-8">
      <Sidebar />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-6 md:p-8">
        {/* Header Title + Live Status */}
        <div className="flex flex-col gap-4 border-b border-accent/10 pb-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-0.5 text-left">
            <h1 className="font-display text-xl font-bold uppercase tracking-wider text-white md:text-2xl">
              System Quality Analytics
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-widest text-accent/70">
              Statistical Yield and Performance Metrics
            </p>
          </div>
          <LiveStatus />
        </div>

        {loading ? (
          /* ── Loading skeletons ── */
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="skeleton-shimmer h-[92px] rounded-xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
              <div className="md:col-span-1 lg:col-span-4"><SkeletonCard /></div>
              <div className="md:col-span-1 lg:col-span-8"><SkeletonCard /></div>
              <div className="lg:col-span-12"><SkeletonCard className="h-[350px]" /></div>
              <div className="lg:col-span-6"><SkeletonCard className="h-[320px]" /></div>
              <div className="lg:col-span-6"><SkeletonCard className="h-[320px]" /></div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* ── KPI Summary Row ── */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {kpis.map((kpi, i) => (
                <MiniKpi key={kpi.label} {...kpi} delay={0.05 + i * 0.07} />
              ))}
            </div>

            {/* ── Charts Grid ── */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">

              {/* Donut Chart: Overall Yield */}
              <GlassCard className="flex h-[340px] flex-col justify-between md:col-span-1 lg:col-span-4" hoverLift={false}>
                <div className="flex items-center gap-2 border-b border-accent/5 pb-3 text-left">
                  <LucidePie className="h-4 w-4 text-success" />
                  <span className="font-display text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
                    Quality Yield Summary
                  </span>
                </div>

                <div className="relative flex h-44 w-full items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={qualitySummaryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={72}
                        paddingAngle={3}
                        dataKey="value"
                        isAnimationActive
                        animationBegin={150}
                        animationDuration={850}
                        animationEasing="ease-out"
                      >
                        {qualitySummaryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip suffix="%" />} cursor={false} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-mono text-xl font-extrabold text-white">
                      <AnimatedNumber end={93.9} decimals={1} duration={1.6} delay={0.2} />
                      <span className="text-success">%</span>
                    </span>
                    <span className="font-display text-[8px] uppercase tracking-widest text-slate-500">Yield Rate</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="grid grid-cols-3 gap-2">
                    <DonutStat label="Today's Target" value={95.0} color="text-accent" />
                    <DonutStat label="Yesterday's Yield" value={92.2} color="text-slate-300" />
                    <DonutStat label="Daily Improvement" value={1.7} color="text-success" up />
                  </div>
                  <div className="flex justify-around gap-4 font-mono text-[9px]">
                    {qualitySummaryData.map((entry, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
                        <span className="text-slate-400">
                          {entry.name}: <strong className="text-white">{entry.value}%</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* Bar Chart: Defects Count */}
              <GlassCard className="flex h-[340px] flex-col justify-between md:col-span-1 lg:col-span-8" hoverLift={false}>
                <div className="flex items-center justify-between border-b border-accent/5 pb-3 text-left">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-warning" />
                    <span className="font-display text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
                      Anomalies Categories
                    </span>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-600">Click a bar for details</span>
                </div>

                <div className="mt-4 h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={DEFECT_CHART_DATA}
                      margin={{ left: -14, right: 6, top: 20, bottom: 0 }}
                      barCategoryGap="30%"
                    >
                      <CartesianGrid horizontal vertical={false} strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={9} fontFamily="Orbitron" tickLine={false} axisLine={{ stroke: "rgba(148,163,184,0.12)" }} interval={0} />
                      <YAxis stroke="#64748b" fontSize={9} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} domain={[0, (dataMax) => Math.ceil(dataMax * 1.2)]} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip />} cursor={false} />
                      <Bar
                        dataKey="count"
                        radius={[4, 4, 0, 0]}
                        barSize={30}
                        maxBarSize={34}
                        isAnimationActive
                        animationBegin={150}
                        animationDuration={750}
                        animationEasing="ease-out"
                        activeBar={<ActiveBar />}
                        onClick={(data) => setSelectedDefect(data)}
                      >
                        {DEFECT_CHART_DATA.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={BAR_COLORS[entry.name] || entry.color} />
                        ))}
                        <LabelList
                          dataKey="count"
                          position="top"
                          formatter={(v) => v}
                          style={{ fontSize: 9, fontFamily: "JetBrains Mono", fontWeight: 700, fill: "#94A3B8" }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Area Chart: Hourly Throughput */}
              <GlassCard className="flex h-[350px] flex-col justify-between md:col-span-2 lg:col-span-12" hoverLift={false}>
                <div className="flex items-center justify-between border-b border-accent/5 pb-3 text-left">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-accent" />
                    <span className="font-display text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
                      Shift Throughput Activity
                    </span>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">Scans / Hour</span>
                </div>

                <div className="mt-5 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={HOURLY_THROUGHPUT_DATA} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorInspected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.info} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={C.info} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.pass} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={C.pass} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,0.02)" />
                      <XAxis dataKey="hour" stroke="#64748b" fontSize={9} fontFamily="JetBrains Mono" tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={9} fontFamily="JetBrains Mono" tickLine={false} />
                      <Tooltip content={<HourlyTooltip />} cursor={<GlowCursor />} />
                      <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="plainline"
                        wrapperStyle={{ fontSize: "10px", fontFamily: "Orbitron", color: "#94A3B8" }}
                      />
                      <Area
                        name="Total Inspected"
                        type="monotone"
                        dataKey="inspected"
                        stroke={C.info}
                        fillOpacity={1}
                        fill="url(#colorInspected)"
                        strokeWidth={2}
                        isAnimationActive
                        animationBegin={200}
                        animationDuration={900}
                        animationEasing="ease-out"
                        activeDot={{ r: 4, fill: C.info, stroke: "#08140F", strokeWidth: 2 }}
                      />
                      <Area
                        name="Passed Units"
                        type="monotone"
                        dataKey="pass"
                        stroke={C.pass}
                        fillOpacity={1}
                        fill="url(#colorPass)"
                        strokeWidth={1.5}
                        isAnimationActive
                        animationBegin={350}
                        animationDuration={900}
                        animationEasing="ease-out"
                        activeDot={{ r: 4, fill: C.pass, stroke: "#08140F", strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Line Chart: 7 Days Trend */}
              <GlassCard className="flex h-[320px] flex-col justify-between md:col-span-1 lg:col-span-6" hoverLift={false}>
                <div className="flex items-center gap-2 border-b border-accent/5 pb-3 text-left">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <span className="font-display text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
                    Weekly Pass Yield Trend
                  </span>
                </div>

                <div className="mt-5 h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={TREND_7_DAYS} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,0.02)" />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={9} fontFamily="Orbitron" tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={9} fontFamily="JetBrains Mono" tickLine={false} domain={[90, 100]} />
                      <Tooltip content={<ChartTooltip suffix="%" />} cursor={<GlowCursor />} />
                      <Line
                        name="Pass Rate"
                        type="monotone"
                        dataKey="passRate"
                        stroke={C.pass}
                        strokeWidth={2}
                        isAnimationActive
                        animationBegin={200}
                        animationDuration={850}
                        animationEasing="ease-out"
                        activeDot={{ r: 4, fill: C.pass, stroke: "#08140F", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Line Chart: Cycle Time */}
              <GlassCard className="flex h-[320px] flex-col justify-between md:col-span-1 lg:col-span-6" hoverLift={false}>
                <div className="flex items-center gap-2 border-b border-accent/5 pb-3 text-left">
                  <Clock className="h-4 w-4 text-accent" />
                  <span className="font-display text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
                    Cycle Time Process Limit (7 Days)
                  </span>
                </div>

                <div className="mt-5 h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={TREND_7_DAYS} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,0.02)" />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={9} fontFamily="Orbitron" tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={9} fontFamily="JetBrains Mono" tickLine={false} />
                      <Tooltip content={<ChartTooltip suffix="s" />} cursor={<GlowCursor />} />
                      <Line
                        name="Avg Cycle Time"
                        type="monotone"
                        dataKey="avgTime"
                        stroke={C.info}
                        strokeWidth={2}
                        isAnimationActive
                        animationBegin={200}
                        animationDuration={850}
                        animationEasing="ease-out"
                        activeDot={{ r: 4, fill: C.info, stroke: "#08140F", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

            </div>
          </motion.div>
        )}
      </main>

      {/* ── Defect Detail Floating Panel ── */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedDefect(null)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            />
            <motion.aside
              initial={{ opacity: 0, x: 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 48 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-5 top-20 z-50 w-[320px] rounded-2xl border border-accent/15 bg-[#08140F]/95 p-5 shadow-[0_0_40px_rgba(31,227,138,0.1)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-accent/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${severityStyles[selected.severity].split(" ")[0]}`} style={{ background: selected.severity === "Critical" ? C.crit : selected.severity === "High" ? C.warn : C.info }} />
                  <span className="font-display text-xs font-bold uppercase tracking-widest text-white">
                    {selected.name}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedDefect(null)}
                  className="text-slate-500 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-accent/10 bg-[#0d1b17]/60 px-3 py-2.5 text-center">
                  <p className="font-mono text-[8px] uppercase tracking-widest text-slate-500">Today's Count</p>
                  <p className="font-mono text-lg font-bold text-warning">{selected.count}</p>
                </div>
                <div className="rounded-lg border border-accent/10 bg-[#0d1b17]/60 px-3 py-2.5 text-center">
                  <p className="font-mono text-[8px] uppercase tracking-widest text-slate-500">Weekly Count</p>
                  <p className="font-mono text-lg font-bold text-white">{selected.weekly}</p>
                </div>
              </div>

              <div className="mt-3">
                <p className="mb-1.5 font-mono text-[8px] uppercase tracking-widest text-slate-500">Affected Boards</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.boards.map((b) => (
                    <span key={b} className="rounded-md border border-accent/15 bg-accent/5 px-2 py-1 font-mono text-[9px] font-semibold text-accent">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <p className="font-mono text-[8px] uppercase tracking-widest text-slate-500">Severity</p>
                <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] font-bold ${severityStyles[selected.severity]}`}>
                  {selected.severity}
                </span>
              </div>

              <div className="mt-3 rounded-lg border border-accent/10 bg-[#0d1b17]/60 px-3 py-2.5">
                <p className="mb-1 font-mono text-[8px] uppercase tracking-widest text-slate-500">Suggested Action</p>
                <p className="text-[10px] leading-relaxed text-slate-300">{selected.action}</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
