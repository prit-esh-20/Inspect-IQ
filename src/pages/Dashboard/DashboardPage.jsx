import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import PageWrapper from "../../components/layout/PageWrapper";
import MetricCard from "../../components/cards/MetricCard";
import StatusBadge from "../../components/common/StatusBadge";
import GlassCard from "../../components/cards/GlassCard";
import Button from "../../components/common/Button";
import { mockApi } from "../../services/mockApi";
import { DEFECT_CHART_DATA } from "../../utils/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { 
  Play, 
  Pause, 
  Camera, 
  Cpu, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BarChart2, 
  RefreshCw 
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentRuns, setRecentRuns] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [isLiveRunning, setIsLiveRunning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);

  // Fetch initial stats
  useEffect(() => {
    mockApi.getStatistics().then((res) => setStats(res.today));
    mockApi.getLiveActivities().then((res) => setRecentRuns(res));
    // Initial live item
    setActiveBoard(mockApi.generateLiveInspection());
  }, []);

  // Live Inspection Feed Simulation Loop
  useEffect(() => {
    if (!isLiveRunning) return;

    // Laser scan animation timeline: 2.5 seconds per PCB
    const interval = setInterval(() => {
      // Create new board detection
      const nextBoard = mockApi.generateLiveInspection();
      
      // Animate laser scan
      setScanProgress(0);
      const steps = 25;
      let curStep = 0;
      
      const scanTimer = setInterval(() => {
        curStep += 1;
        setScanProgress((curStep / steps) * 100);
        if (curStep >= steps) {
          clearInterval(scanTimer);
          
          // Apply results to UI
          setActiveBoard(nextBoard);
          
          // Increment global counters
          setStats((prev) => {
            if (!prev) return prev;
            const isPass = nextBoard.status === "PASS";
            const newInspected = prev.inspected + 1;
            const newPass = prev.pass + (isPass ? 1 : 0);
            const newFail = prev.fail + (isPass ? 0 : 1);
            return {
              ...prev,
              inspected: newInspected,
              pass: newPass,
              fail: newFail,
              passRate: (newPass / newInspected) * 100,
              avgCycleTime: (prev.avgCycleTime * 0.9 + parseFloat(nextBoard.cycleTime) * 0.1)
            };
          });

          // Add to recent feed
          setRecentRuns((prev) => [
            {
              id: nextBoard.id,
              time: "Just now",
              model: nextBoard.model,
              status: nextBoard.status,
              defect: nextBoard.defect
            },
            ...prev.slice(0, 4)
          ]);
        }
      }, 70);

      return () => clearInterval(scanTimer);

    }, 3500);

    return () => clearInterval(interval);
  }, [isLiveRunning]);

  return (
    <PageWrapper className="flex min-h-screen pl-64">
      <Sidebar />

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-accent/10 pb-5">
          <div className="text-left space-y-1">
            <h1 className="font-display text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
              Control Console
            </h1>
            <p className="font-mono text-[10px] text-accent/70 tracking-widest uppercase">
              PCB Automated Optical Inspection Overview
            </p>
          </div>
          
          {/* Diagnostic telemetry tags */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary-bg border border-accent/10">
              <span className="w-1.5 h-1.5 rounded-full bg-accent led-slow" />
              <span className="font-mono text-[9px] text-[#9ca3af] uppercase tracking-wider font-semibold">RPi CPU Load: 24.5%</span>
            </div>
            
            <button 
              onClick={() => setIsLiveRunning(!isLiveRunning)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg border font-display text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                isLiveRunning 
                  ? "bg-accent/10 hover:bg-accent/20 border-accent/30 text-accent" 
                  : "bg-amber-500/10 hover:bg-amber-500/25 border-amber-500/30 text-warning"
              }`}
            >
              {isLiveRunning ? (
                <>
                  <Pause className="w-3 h-3 fill-current" />
                  Live Active
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  Stream Paused
                </>
              )}
            </button>
          </div>
        </div>

        {/* 1. Metrics Grid */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <MetricCard
              title="Today's Inspected"
              value={stats.inspected}
              icon={Camera}
              trend="1.8%"
              trendType="up"
              description="BOM COMPLIANT"
            />
            <MetricCard
              title="Passed Units"
              value={stats.pass}
              suffix={` (${stats.passRate.toFixed(1)}%)`}
              icon={CheckCircle}
              trend="2.1%"
              trendType="up"
              description="SOLDER COMPLIANT"
            />
            <MetricCard
              title="Failed Units"
              value={stats.fail}
              suffix={` (${(100 - stats.passRate).toFixed(1)}%)`}
              icon={AlertTriangle}
              trend="-4.2%"
              trendType="down"
              description="DEFECT DETECTED"
            />
            <MetricCard
              title="Average Cycle Time"
              value={stats.avgCycleTime}
              decimals={2}
              suffix="s"
              icon={Clock}
              trend="-1.5%"
              trendType="down"
              description="PROCESS SPEED"
            />
          </div>
        )}

        {/* 2. Visual Dash Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Camera Scan Simulation (Col: 7) */}
          <GlassCard className="lg:col-span-7 flex flex-col justify-between h-[450px]" hoverLift={false}>
            <div className="flex items-center justify-between border-b border-accent/5 pb-3">
              <span className="font-display text-[10px] tracking-widest text-[#9ca3af] uppercase font-bold flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-accent" />
                Raspberry Pi Camera Feed (YOLO Output)
              </span>
              <span className="font-mono text-[9px] text-[#9ca3af] uppercase tracking-wider font-semibold">
                FPS: {stats?.fps || "29.8"} &bull; 1080p
              </span>
            </div>

            {/* Simulated Live Viewport */}
            <div className="relative flex-1 bg-black/90 rounded-lg overflow-hidden border border-accent/5 my-4 flex items-center justify-center">
              {/* Electronics Background blueprint grid inside Camera */}
              <div className="absolute inset-0 cyber-grid opacity-30" />
              
              {/* Circuit board vector graphic mockup */}
              <svg className="w-3/4 h-3/4 opacity-40 text-accent/80" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="20" width="360" height="260" rx="10" stroke="currentColor" strokeWidth="2" />
                {/* Chip CPU */}
                <rect x="150" y="100" width="100" height="100" rx="4" stroke="currentColor" strokeWidth="2" />
                <circle cx="200" cy="150" r="25" stroke="currentColor" strokeWidth="1.5" />
                {/* Capacitor blocks */}
                <rect x="50" y="50" width="40" height="60" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <rect x="50" y="180" width="40" height="60" rx="2" stroke="currentColor" strokeWidth="1.5" />
                {/* Gold Lines */}
                <path d="M90 80h60M90 210h60M250 150h100M150 110H90" stroke="currentColor" strokeWidth="1.5" />
              </svg>

              {/* Laser Scan line bar overlay */}
              {isLiveRunning && (
                <div 
                  className="absolute left-0 w-full h-[2px] bg-accent/90 shadow-[0_0_10px_4px_#00E5FF]" 
                  style={{ top: `${scanProgress}%` }}
                />
              )}

              {/* Bounding box overlay (if FAIL, draw bounding box on error) */}
              {activeBoard && activeBoard.status === "FAIL" && activeBoard.defectCoordinates && (
                <div 
                  className="absolute border-2 border-danger bg-danger/10 flex flex-col justify-start rounded text-danger font-mono text-[9px] p-1 font-bold animate-pulse"
                  style={{
                    left: `${(activeBoard.defectCoordinates.x / 400) * 100}%`,
                    top: `${(activeBoard.defectCoordinates.y / 300) * 100}%`,
                    width: `${(activeBoard.defectCoordinates.radius * 2 / 400) * 100}%`,
                    height: `${(activeBoard.defectCoordinates.radius * 2 / 300) * 100}%`,
                  }}
                >
                  <span>{activeBoard.defect.toUpperCase()}</span>
                  <span>CONF: {activeBoard.confidence}%</span>
                </div>
              )}

              {/* Bounding box overlays (generic OK chips) */}
              {activeBoard && (
                <>
                  {/* CPU block */}
                  <div className="absolute border border-success/40 bg-success/5 rounded font-mono text-[8px] text-success/80 p-0.5" style={{ left: "42%", top: "37%", width: "23%", height: "30%" }}>
                    <span>MAIN_IC: 99.8%</span>
                  </div>
                  {/* Cap blocks */}
                  <div className="absolute border border-success/40 bg-success/5 rounded font-mono text-[8px] text-success/80 p-0.5" style={{ left: "15%", top: "18%", width: "11%", height: "20%" }}>
                    <span>CAP_C12: 98%</span>
                  </div>
                </>
              )}

              {/* Frame Diagnostics Banner */}
              {activeBoard && (
                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-[#050816]/90 border border-accent/15 px-3 py-1.5 rounded font-mono text-[9px]">
                  <span className="text-[#9ca3af]">ACTIVE BOARD:</span>
                  <span className="text-white font-bold">{activeBoard.id}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <StatusBadge status={activeBoard.status} />
                </div>
              )}
            </div>

            {/* Quick Inspection Summary */}
            {activeBoard && (
              <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] text-slate-400">
                <div className="flex items-center gap-4">
                  <span>Cycle: <strong className="text-white">{activeBoard.cycleTime}s</strong></span>
                  <span>Confidence: <strong className="text-white">{activeBoard.confidence}%</strong></span>
                  <span>Model: <strong className="text-white">{activeBoard.model}</strong></span>
                </div>
                {activeBoard.status === "FAIL" && (
                  <span className="text-danger font-bold uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Defect: {activeBoard.defect}
                  </span>
                )}
              </div>
            )}
          </GlassCard>

          {/* Right column chart & activity feed (Col: 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Defect Chart Card */}
            <GlassCard className="flex-1 flex flex-col justify-between" hoverLift={false}>
              <div className="flex items-center justify-between border-b border-accent/5 pb-2">
                <span className="font-display text-[10px] tracking-widest text-[#9ca3af] uppercase font-bold flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-warning" />
                  Defect Distributions
                </span>
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Today</span>
              </div>

              {/* Custom Recharts bar */}
              <div className="h-40 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DEFECT_CHART_DATA} layout="vertical" margin={{ left: -10, right: 10, top: 5, bottom: 5 }}>
                    <XAxis type="number" stroke="#475569" fontSize={8} fontFamily="JetBrains Mono" tickLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#475569" fontSize={8} fontFamily="Inter" width={95} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: "#0B1120", borderColor: "rgba(0,229,255,0.2)", borderRadius: "8px" }}
                      labelStyle={{ color: "#E2E8F0", fontFamily: "Orbitron", fontSize: "10px" }}
                      itemStyle={{ color: "#00E5FF", fontFamily: "JetBrains Mono", fontSize: "10px" }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {DEFECT_CHART_DATA.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Recent Live activity list */}
            <GlassCard className="flex-1 flex flex-col justify-between" hoverLift={false}>
              <div className="flex items-center justify-between border-b border-accent/5 pb-2">
                <span className="font-display text-[10px] tracking-widest text-[#9ca3af] uppercase font-bold flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-success" />
                  Recent Inspection Logs
                </span>
                <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">Real-time</span>
              </div>

              <div className="space-y-3 mt-4 flex-1 overflow-y-auto max-h-[200px] pr-2 custom-scrollbar">
                {recentRuns.map((run, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded bg-[#050816]/60 border border-accent/5 hover:border-accent/15 transition-all">
                    <div className="text-left space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-white font-bold">{run.id}</span>
                        <span className="font-sans text-[9px] text-slate-500 font-medium">({run.time})</span>
                      </div>
                      <p className="font-sans text-[10px] text-slate-400 truncate max-w-[160px]">{run.model}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {run.status === "FAIL" && (
                        <span className="font-mono text-[9px] text-danger font-semibold uppercase">{run.defect}</span>
                      )}
                      <StatusBadge status={run.status} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

          </div>
        </div>

      </main>
    </PageWrapper>
  );
}
