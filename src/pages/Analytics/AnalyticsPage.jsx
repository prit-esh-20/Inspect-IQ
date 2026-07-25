import Sidebar from "../../components/layout/Sidebar";
import PageWrapper from "../../components/layout/PageWrapper";
import GlassCard from "../../components/cards/GlassCard";
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
  ResponsiveContainer 
} from "recharts";
import { 
  LineChart as LucideChart, 
  BarChart3, 
  TrendingUp, 
  PieChart as LucidePie, 
  Clock, 
  AlertOctagon 
} from "lucide-react";

export default function AnalyticsPage() {
  
  // Data for Pass/Fail Pie
  const qualitySummaryData = [
    { name: "PASS RATE", value: 93.9, color: "#00FF9C" },
    { name: "DEFECT RATE", value: 6.1, color: "#FF4D6D" }
  ];

  return (
    <PageWrapper className="flex min-h-screen pl-64 pb-8">
      <Sidebar />

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-accent/10 pb-4">
          <div className="text-left space-y-0.5">
            <h1 className="font-display text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
              System Quality Analytics
            </h1>
            <p className="font-mono text-[10px] text-accent/70 tracking-widest uppercase">
              Statistical Yield and Performance Metrics
            </p>
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Pie Chart: Overall Yield (Col: 4) */}
          <GlassCard className="lg:col-span-4 flex flex-col justify-between h-[340px]" hoverLift={false}>
            <div className="flex items-center gap-2 border-b border-accent/5 pb-2 text-left">
              <LucidePie className="w-4 h-4 text-success" />
              <span className="font-display text-[10px] tracking-widest text-[#9ca3af] uppercase font-bold">
                Quality Yield Summary
              </span>
            </div>

            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={qualitySummaryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {qualitySummaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#0B1120", borderColor: "rgba(0,229,255,0.2)", borderRadius: "8px" }}
                    itemStyle={{ fontFamily: "JetBrains Mono", fontSize: "10px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Inner core value */}
              <div className="absolute flex flex-col items-center">
                <span className="font-mono text-xl font-extrabold text-white">93.9%</span>
                <span className="font-display text-[8px] text-slate-500 uppercase tracking-widest">Yield Rate</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="flex justify-around font-mono text-[9px]">
              {qualitySummaryData.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
                  <span className="text-slate-400">{entry.name}: <strong className="text-white">{entry.value}%</strong></span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Bar Chart: Defects Count (Col: 8) */}
          <GlassCard className="lg:col-span-8 flex flex-col justify-between h-[340px]" hoverLift={false}>
            <div className="flex items-center gap-2 border-b border-accent/5 pb-2 text-left">
              <BarChart3 className="w-4 h-4 text-warning" />
              <span className="font-display text-[10px] tracking-widest text-[#9ca3af] uppercase font-bold">
                Anomalies Categories
              </span>
            </div>

            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEFECT_CHART_DATA} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,0.02)" />
                  <XAxis dataKey="name" stroke="#475569" fontSize={8} fontFamily="Orbitron" tickLine={false} />
                  <YAxis stroke="#475569" fontSize={8} fontFamily="JetBrains Mono" tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: "#0B1120", borderColor: "rgba(0,229,255,0.2)", borderRadius: "8px" }}
                    labelStyle={{ color: "#E2E8F0", fontFamily: "Orbitron", fontSize: "10px" }}
                    itemStyle={{ color: "#00E5FF", fontFamily: "JetBrains Mono", fontSize: "10px" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {DEFECT_CHART_DATA.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Area Chart: Hourly Throughput (Col: 12) */}
          <GlassCard className="lg:col-span-12 flex flex-col justify-between h-[350px]" hoverLift={false}>
            <div className="flex items-center justify-between border-b border-accent/5 pb-2 text-left">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span className="font-display text-[10px] tracking-widest text-[#9ca3af] uppercase font-bold">
                  Shift Throughput Activity
                </span>
              </div>
              <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Scans / Hour</span>
            </div>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={HOURLY_THROUGHPUT_DATA} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorInspected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00FF9C" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#00FF9C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,0.02)" />
                  <XAxis dataKey="hour" stroke="#475569" fontSize={8} fontFamily="JetBrains Mono" />
                  <YAxis stroke="#475569" fontSize={8} fontFamily="JetBrains Mono" />
                  <Tooltip 
                    contentStyle={{ background: "#0B1120", borderColor: "rgba(0,229,255,0.2)", borderRadius: "8px" }}
                    labelStyle={{ color: "#E2E8F0", fontFamily: "Orbitron", fontSize: "10px" }}
                    itemStyle={{ fontFamily: "JetBrains Mono", fontSize: "10px" }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "10px", fontFamily: "Orbitron", color: "#94A3B8" }} />
                  <Area name="TOTAL INSPECTED" type="monotone" dataKey="inspected" stroke="#00E5FF" fillOpacity={1} fill="url(#colorInspected)" strokeWidth={2} />
                  <Area name="PASSED UNITS" type="monotone" dataKey="pass" stroke="#00FF9C" fillOpacity={1} fill="url(#colorPass)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Line Chart: 7 Days Trend (Col: 6) */}
          <GlassCard className="lg:col-span-6 flex flex-col justify-between h-[320px]" hoverLift={false}>
            <div className="flex items-center gap-2 border-b border-accent/5 pb-2 text-left">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="font-display text-[10px] tracking-widest text-[#9ca3af] uppercase font-bold">
                Weekly Pass Yield Trend
              </span>
            </div>

            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND_7_DAYS} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,0.02)" />
                  <XAxis dataKey="day" stroke="#475569" fontSize={8} fontFamily="Orbitron" />
                  <YAxis stroke="#475569" fontSize={8} fontFamily="JetBrains Mono" domain={[90, 100]} />
                  <Tooltip 
                    contentStyle={{ background: "#0B1120", borderColor: "rgba(0,229,255,0.2)", borderRadius: "8px" }}
                    labelStyle={{ color: "#E2E8F0", fontFamily: "Orbitron", fontSize: "10px" }}
                    itemStyle={{ color: "#00FF9C", fontFamily: "JetBrains Mono", fontSize: "10px" }}
                  />
                  <Line name="Pass Rate (%)" type="monotone" dataKey="passRate" stroke="#00FF9C" strokeWidth={2} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Line Chart: Cycle Time (Col: 6) */}
          <GlassCard className="lg:col-span-6 flex flex-col justify-between h-[320px]" hoverLift={false}>
            <div className="flex items-center gap-2 border-b border-accent/5 pb-2 text-left">
              <Clock className="w-4 h-4 text-accent" />
              <span className="font-display text-[10px] tracking-widest text-[#9ca3af] uppercase font-bold">
                Cycle Time Process Limit (7 Days)
              </span>
            </div>

            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND_7_DAYS} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,255,0.02)" />
                  <XAxis dataKey="day" stroke="#475569" fontSize={8} fontFamily="Orbitron" />
                  <YAxis stroke="#475569" fontSize={8} fontFamily="JetBrains Mono" />
                  <Tooltip 
                    contentStyle={{ background: "#0B1120", borderColor: "rgba(0,229,255,0.2)", borderRadius: "8px" }}
                    labelStyle={{ color: "#E2E8F0", fontFamily: "Orbitron", fontSize: "10px" }}
                    itemStyle={{ color: "#00E5FF", fontFamily: "JetBrains Mono", fontSize: "10px" }}
                  />
                  <Line name="Avg Cycle Time (s)" type="monotone" dataKey="avgTime" stroke="#00E5FF" strokeWidth={2} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

        </div>

      </main>
    </PageWrapper>
  );
}
