import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import PageWrapper from "../../components/layout/PageWrapper";
import GlassCard from "../../components/cards/GlassCard";
import StatusBadge from "../../components/common/StatusBadge";
import Button from "../../components/common/Button";
import { mockApi } from "../../services/mockApi";
import { toast, Toaster } from "react-hot-toast";
import {
  Camera,
  Activity,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Target,
  AlertTriangle
} from "lucide-react";

export default function LiveInspectionPage() {
  const [activeBoard, setActiveBoard] = useState(null);
  const [isCapturing, setIsCapturing] = useState(true);
  const [visualMode, setVisualMode] = useState("yolo"); // "yolo" | "gradcam" | "split"

  const fetchNewBoard = () => {
    const next = mockApi.generateLiveInspection();
    setActiveBoard(next);
    if (next.status === "FAIL") {
      toast.error(`Defect detected on unit: ${next.id} - ${next.defect}`, {
        duration: 3000,
        style: {
          background: "#111827",
          color: "#fff",
          border: "1px solid rgba(255, 77, 109, 0.3)"
        }
      });
    } else {
      toast.success(`Unit ${next.id}: inspection passed successfully`, {
        duration: 2500,
        style: {
          background: "#111827",
          color: "#fff",
          border: "1px solid rgba(0, 255, 156, 0.3)"
        }
      });
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchNewBoard();
  }, []);

  // Capture stream trigger
  useEffect(() => {
    if (!isCapturing) return;
    const streamTimer = setInterval(() => {
      fetchNewBoard();
    }, 4500);
    return () => clearInterval(streamTimer);
  }, [isCapturing]);

  const handleManualRerun = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: "Running model layers...",
        success: <b>Inference complete</b>,
        error: <b>Error compiling frames</b>
      },
      {
        style: {
          background: "#111827",
          color: "#fff",
          border: "1px solid rgba(0, 229, 255, 0.3)"
        }
      }
    );
    fetchNewBoard();
  };

  const modes = [
    { id: "yolo", label: "YOLO Detect" },
    { id: "gradcam", label: "Grad-CAM Overlay" },
    { id: "split", label: "Side-by-Side" }
  ];

  return (
    <PageWrapper className="flex min-h-screen pl-64 pb-8">
      <Sidebar />
      <Toaster position="top-right" />

      {/* Main Console Workspace */}
      <main className="flex-1 p-4 md:p-6 space-y-4 max-w-[1440px] w-full">

        {/* Page title */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-accent/10 pb-3">
          <div className="text-left">
            <h1 className="font-display text-lg md:text-xl font-bold text-white uppercase tracking-wider">
              Live Inspection Panel
            </h1>
            <p className="font-mono text-[9px] text-accent/70 tracking-widest uppercase">
              Explainable Automated Edge Vision Analyzer
            </p>
          </div>

          {/* Quick controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCapturing(!isCapturing)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md border font-display text-[9px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                isCapturing
                  ? "bg-success/15 border-success/35 text-success"
                  : "bg-amber-500/10 border-amber-500/30 text-warning"
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${isCapturing ? "animate-pulse" : ""}`} />
              {isCapturing ? "Streaming: Capturing" : "Streaming: Stopped"}
            </button>

            <Button variant="secondary" className="flex items-center gap-1.5 py-1 px-2.5" onClick={handleManualRerun}>
              <RefreshCw className="w-3.5 h-3.5" />
              Re-scan Frame
            </Button>
          </div>
        </div>

        {/* Live inspection feed */}
        {activeBoard && (
          <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-5 items-start">

            {/* OPTICAL OUTPUT CAPTURE - Left panel */}
            <GlassCard className="flex flex-col" hoverLift={false}>

              {/* Visualizer Mode Toggles */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-accent/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-accent" />
                  <span className="font-display text-[10px] tracking-widest text-[#9ca3af] uppercase font-bold">
                    Optical Output Capture
                  </span>
                </div>

                {/* Mode Toggles */}
                <div className="flex bg-[#050816] rounded-md p-1 border border-accent/15 self-start md:self-auto">
                  {modes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setVisualMode(mode.id)}
                      className={`px-3 py-1 font-display text-[8px] uppercase tracking-widest font-extrabold rounded-sm transition-all cursor-pointer ${
                        visualMode === mode.id
                          ? "bg-accent text-[#050816] shadow-[0_0_8px_#00E5FF]"
                          : "text-[#9ca3af] hover:text-white"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Viewport Frame - dominant PCB feed */}
              <div className="relative bg-black rounded-lg overflow-hidden border border-accent/5 my-2 w-full mx-auto flex items-center justify-center h-[250px] md:h-[320px] lg:h-[390px]">

                {/* Electronics Schematic background grid */}
                <div className="absolute inset-0 cyber-grid opacity-20" />

                {/* Grid of circuit tracks */}
                <svg className="w-5/6 h-5/6 text-accent/20 absolute z-0" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="10" width="580" height="380" rx="8" stroke="currentColor" strokeWidth="1" />
                  <circle cx="300" cy="200" r="50" stroke="currentColor" strokeWidth="1" />
                  <circle cx="150" cy="120" r="30" stroke="currentColor" strokeWidth="1" />
                  <rect x="420" y="80" width="80" height="80" rx="4" stroke="currentColor" strokeWidth="1" />
                  <path d="M10 200h580M300 10v380" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                </svg>

                {/* Laser scan line (Only in standard YOLO view) */}
                {isCapturing && visualMode === "yolo" && (
                  <div className="laser-scanner" style={{ animationDuration: "3s" }} />
                )}

                {/* Render Visual Mode 1: Standard YOLO Bounding Boxes */}
                {visualMode === "yolo" && (
                  <>
                    {/* Chips detections */}
                    <div className="absolute border-2 border-success bg-success/5 rounded font-mono text-[9px] text-success font-bold p-1" style={{ left: "40%", top: "35%", width: "25%", height: "28%" }}>
                      <span className="block">U1 (STM32F4)</span>
                      <span>CONF: 99.8%</span>
                    </div>

                    <div className="absolute border-2 border-success bg-success/5 rounded font-mono text-[9px] text-success font-bold p-1" style={{ left: "15%", top: "15%", width: "15%", height: "20%" }}>
                      <span className="block">U2 (LM1117)</span>
                      <span>CONF: 99.4%</span>
                    </div>

                    {/* Capacitor block (Conditional PASS/FAIL bounding box) */}
                    {activeBoard.defectCoordinates ? (
                      <div
                        className="absolute border-2 border-danger bg-danger/10 rounded font-mono text-[9px] text-danger font-bold p-1 animate-pulse"
                        style={{
                          left: `${(activeBoard.defectCoordinates.x / 400) * 100}%`,
                          top: `${(activeBoard.defectCoordinates.y / 300) * 100}%`,
                          width: `${(activeBoard.defectCoordinates.radius * 2 / 400) * 100}%`,
                          height: `${(activeBoard.defectCoordinates.radius * 2 / 300) * 100}%`,
                        }}
                      >
                        <span className="block">{activeBoard.defect.toUpperCase()}</span>
                        <span>CONF: {activeBoard.confidence}%</span>
                      </div>
                    ) : (
                      <div className="absolute border-2 border-success bg-success/5 rounded font-mono text-[9px] text-success font-bold p-1" style={{ left: "70%", top: "60%", width: "14%", height: "18%" }}>
                        <span className="block">C12 (CAP)</span>
                        <span>CONF: 98.4%</span>
                      </div>
                    )}
                  </>
                )}

                {/* Render Visual Mode 2: Grad-CAM Overlay Heatmap */}
                {visualMode === "gradcam" && (
                  <>
                    {/* Gradient-weighted Activation contour (glow) centered over the defect or center CPU */}
                    <div
                      className="absolute rounded-full pointer-events-none transition-all duration-300 blur-[35px]"
                      style={{
                        left: activeBoard.defectCoordinates ? `${(activeBoard.defectCoordinates.x / 400) * 100 + 8}%` : "52%",
                        top: activeBoard.defectCoordinates ? `${(activeBoard.defectCoordinates.y / 300) * 100 + 8}%` : "48%",
                        width: activeBoard.defectCoordinates ? `${activeBoard.defectCoordinates.radius * 3}px` : "160px",
                        height: activeBoard.defectCoordinates ? `${activeBoard.defectCoordinates.radius * 3}px` : "160px",
                        background: `radial-gradient(circle, ${activeBoard.status === "FAIL" ? "rgba(255,77,109,0.95)" : "rgba(0,229,255,0.95)"} 0%, rgba(255,200,87,0.5) 45%, transparent 70%)`,
                        opacity: 0.85
                      }}
                    />
                    <div className="absolute bottom-4 right-4 bg-[#050816]/95 border border-accent/15 px-3 py-1.5 rounded font-mono text-[8px] text-slate-400">
                      Activation map: lastConvLayer_conv2d
                    </div>
                  </>
                )}

                {/* Render Visual Mode 3: Split (Side-by-Side) */}
                {visualMode === "split" && (
                  <div className="grid grid-cols-2 w-full h-full divide-x divide-accent/20">
                    {/* Left: YOLO Detect */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="absolute border border-success bg-success/5 rounded font-mono text-[8px] text-success p-0.5" style={{ left: "30%", top: "35%", width: "40%", height: "30%" }}>
                        <span>U1: 99.8%</span>
                      </div>
                      <span className="absolute top-2 left-2 font-mono text-[8px] bg-secondary-bg px-2 py-0.5 border border-accent/10 rounded">RAW YOLO</span>
                    </div>

                    {/* Right: Grad-CAM Overlay */}
                    <div className="relative w-full h-full flex items-center justify-center bg-accent/5">
                      <div
                        className="absolute rounded-full pointer-events-none blur-[25px]"
                        style={{
                          left: "35%",
                          top: "35%",
                          width: "100px",
                          height: "100px",
                          background: `radial-gradient(circle, ${activeBoard.status === "FAIL" ? "rgba(255,77,109,0.9)" : "rgba(0,229,255,0.9)"} 0%, rgba(255,200,87,0.55) 45%, transparent 70%)`,
                          opacity: 0.85
                        }}
                      />
                      <span className="absolute top-2 left-2 font-mono text-[8px] bg-secondary-bg px-2 py-0.5 border border-accent/10 rounded">XAI HEATMAP</span>
                    </div>
                  </div>
                )}

                {/* Bottom Diagnostics Tag */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-[#050816]/90 border border-accent/15 px-3 py-1.5 rounded font-mono text-[9px] z-10 shadow-lg">
                  <span className="text-[#9ca3af]">FEED STATUS:</span>
                  <span className="text-[#00E5FF] font-bold">ONLINE</span>
                  <span className="w-1.5 h-1.5 bg-success rounded-full led-slow" />
                  <StatusBadge status={activeBoard.status} />
                </div>
              </div>

              {/* Compact inspection status strip */}
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 px-3 py-2 rounded-md border border-accent/10 bg-[#050816]/50">
                {/* LIVE indicator */}
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isCapturing ? "bg-success led-slow" : "bg-slate-600"}`} />
                  <span className="font-mono text-[9px] tracking-widest text-slate-400 uppercase font-bold">
                    {isCapturing ? "Live" : "Stopped"}
                  </span>
                </div>

                <span className="hidden md:inline font-mono text-accent/25">|</span>

                {/* PCB ID */}
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] tracking-widest text-slate-500 uppercase font-bold">PCB ID</span>
                  <span className="font-mono text-[10px] text-white font-bold tracking-wider">{activeBoard.id}</span>
                </div>

                <span className="hidden md:inline font-mono text-accent/25">|</span>

                {/* PASS/FAIL verdict */}
                <StatusBadge status={activeBoard.status} />

                {/* Defect detail on FAIL */}
                {activeBoard.status === "FAIL" && (
                  <span className="flex items-center gap-1.5 font-mono text-[9px] text-danger">
                    <AlertTriangle className="w-3 h-3 animate-pulse" />
                    <span className="font-bold uppercase">{activeBoard.defect}</span>
                    <span className="text-danger/70">{activeBoard.confidence}%</span>
                  </span>
                )}
              </div>
            </GlassCard>

            {/* XAI INSPECTION SUMMARY - Right panel */}
            <GlassCard className="space-y-3" hoverLift={false}>
              <div className="flex items-center gap-2 border-b border-accent/5 pb-2">
                <Eye className="w-3.5 h-3.5 text-accent" />
                <span className="font-display text-[10px] tracking-widest text-white uppercase font-bold">
                  XAI Inspection Summary
                </span>
              </div>

              {/* Detection / Defect / Confidence / Location - 2x2 compact grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                <div className="text-left">
                  <span className="block font-mono text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Detection</span>
                  <span className={`inline-flex items-center gap-1 font-display text-[11px] font-extrabold uppercase tracking-wider ${
                    activeBoard.status === "PASS" ? "text-success" : "text-danger"
                  }`}>
                    {activeBoard.status === "PASS"
                      ? <CheckCircle className="w-3.5 h-3.5" />
                      : <XCircle className="w-3.5 h-3.5" />}
                    {activeBoard.status}
                  </span>
                </div>

                <div className="text-left">
                  <span className="block font-mono text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Defect</span>
                  <span className={`font-display text-[11px] font-extrabold uppercase tracking-wider ${
                    activeBoard.status === "FAIL" ? "text-danger" : "text-slate-300"
                  }`}>
                    {activeBoard.status === "FAIL" ? activeBoard.defect : "None"}
                  </span>
                </div>

                <div className="text-left">
                  <span className="block font-mono text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Confidence</span>
                  <span className="font-display text-[11px] font-extrabold text-accent tracking-wider">
                    {activeBoard.confidence}%
                  </span>
                </div>

                <div className="text-left">
                  <span className="block font-mono text-[8px] text-slate-500 uppercase tracking-widest mb-0.5">Location</span>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-slate-300">
                    <Target className="w-3 h-3 text-accent" />
                    {activeBoard.defectCoordinates
                      ? `(${activeBoard.defectCoordinates.x}, ${activeBoard.defectCoordinates.y})`
                      : "—"}
                  </span>
                </div>
              </div>

              {/* Short AI explanation */}
              <div className="pt-2 border-t border-accent/5">
                <span className="block font-mono text-[8px] text-slate-500 uppercase tracking-widest mb-1">Model Rationale</span>
                <p className="font-sans text-[11px] text-slate-300 leading-relaxed text-left">
                  {activeBoard.gradCamExplanation}
                </p>
              </div>

              {/* Model info */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[8.5px] font-mono text-slate-500">
                <span>Model: <strong className="text-slate-400">YOLOv8x-PCB-v3.2</strong></span>
                <span>Layer: <strong className="text-slate-400">YOLO_head/cv3_d1</strong></span>
              </div>
            </GlassCard>

          </div>
        )}

      </main>
    </PageWrapper>
  );
}
