import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import PageWrapper from "../../components/layout/PageWrapper";
import GlassCard from "../../components/cards/GlassCard";
import Button from "../../components/common/Button";
import { useReports } from "../../hooks/useReports";
import { useNotifications } from "../../context/NotificationContext";
import { reportsApi } from "../../services/api/reportsApi";
import { 
  FileText, 
  Download, 
  Layers, 
  Calendar, 
  ArrowRight, 
  Cpu, 
  CheckCircle2, 
  ServerCrash 
} from "lucide-react";

export default function ReportsPage() {
  const [exportType, setExportType] = useState("SUMMARY"); // "SUMMARY" | "FULL" | "X-MCCV"
  const [modelTarget, setModelTarget] = useState("ALL");
  const { reports, loading, error } = useReports();
  const { notify } = useNotifications();

  const handleExportPdf = async (batchId) => {
    try {
      await reportsApi.exportReport(batchId);
      notify({ type: "success", title: "Report Exported", message: `${batchId}.pdf downloaded.` });
    } catch {
      notify({ type: "error", title: "Export Failed", message: "Unable to export the report. Please try again." });
    }
  };

  const handleCreateReport = async () => {
    try {
      await reportsApi.createReport({ type: exportType, model: modelTarget });
      notify({ type: "success", title: "Report Compiled", message: "New PDF batch compiled successfully." });
    } catch {
      notify({ type: "error", title: "Compilation Failed", message: "Unable to compile the report. Please try again." });
    }
  };

  return (
    <PageWrapper className="flex min-h-screen pl-64 pb-8">
      <Sidebar />

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-accent/10 pb-4">
          <div className="text-left space-y-0.5">
            <h1 className="font-display text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
              Quality Audit Reports
            </h1>
            <p className="font-mono text-[10px] text-accent/70 tracking-widest uppercase">
              Compliance Export Management & Diagnostics Data
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Report Generator Form */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <GlassCard className="space-y-5" hoverLift={false}>
              
              <div className="flex items-center gap-2 border-b border-accent/5 pb-2">
                <FileText className="w-4 h-4 text-accent" />
                <span className="font-display text-[10px] tracking-widest text-[#9ca3af] uppercase font-bold">
                  Compile New PDF Report
                </span>
              </div>

              {/* Form Controls */}
              <div className="space-y-4">
                
                {/* Report Type */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block font-bold">
                    Report details scope
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "SUMMARY", label: "Overview" },
                      { id: "FULL", label: "Full Details" },
                      { id: "X-MCCV", label: "X-MCCV" }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setExportType(type.id)}
                        className={`py-2 text-[9px] font-display uppercase tracking-widest font-extrabold rounded-lg border transition-all cursor-pointer ${
                          exportType === type.id
                            ? "bg-accent/10 border-accent text-accent shadow-[0_0_10px_rgba(0,229,255,0.15)]"
                            : "bg-secondary-bg border-accent/10 text-slate-400 hover:border-accent/30"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model Target Selection */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block font-bold">
                    Select Target Model
                  </label>
                  <select
                    value={modelTarget}
                    onChange={(e) => setModelTarget(e.target.value)}
                    className="w-full bg-[#050816]/60 border border-accent/15 rounded-lg px-3 py-2.5 font-sans text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent transition-all cursor-pointer"
                  >
                    <option value="ALL" className="bg-[#111827]">All Models Combined</option>
                    <option value="RPI4" className="bg-[#111827]">Raspberry Pi 4 Model B</option>
                    <option value="STM32" className="bg-[#111827]">STM32 MCU Controller</option>
                    <option value="ESP32" className="bg-[#111827]">ESP32-WROOM IoT Gateway</option>
                  </select>
                </div>

                {/* Scope Selection */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block font-bold">
                    Select Date Scope
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      defaultValue="2026-07-01"
                      className="bg-[#050816]/60 border border-accent/15 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-accent"
                    />
                    <input
                      type="date"
                      defaultValue="2026-07-24"
                      className="bg-[#050816]/60 border border-accent/15 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {/* Rules Toggles */}
                <div className="p-3 bg-[#050816]/60 border border-accent/5 rounded-lg space-y-2">
                  <div className="flex items-center justify-between font-mono text-[9px] text-slate-400">
                    <span>Embed Grad-CAM heatmaps:</span>
                    <input type="checkbox" defaultChecked className="accent-accent" />
                  </div>
                  <div className="flex items-center justify-between font-mono text-[9px] text-slate-400">
                    <span>Include raw OpenCV coordinates:</span>
                    <input type="checkbox" defaultChecked className="accent-accent" />
                  </div>
                </div>

                {/* Create Trigger */}
                <Button variant="primary" className="w-full flex items-center justify-center gap-2" onClick={handleCreateReport}>
                  Compile Audit Log File
                  <ArrowRight className="w-4 h-4" />
                </Button>

              </div>
            </GlassCard>
          </div>

          {/* RIGHT COLUMN: Available Reports List */}
          <div className="lg:col-span-7 space-y-4">

            {loading ? (
              <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-500 uppercase tracking-widest">
                Loading reports...
              </div>
            ) : error ? (
              <div className="h-64 flex flex-col items-center justify-center gap-2 font-mono text-xs text-slate-500 uppercase tracking-widest">
                <span className="text-danger">Unable to retrieve reports.</span>
                <span className="text-slate-600 normal-case">Please try again.</span>
              </div>
            ) : reports.length === 0 ? (
              <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-500 uppercase tracking-widest">
                No reports available yet.
              </div>
            ) : (
              reports.map((batch) => (
              <GlassCard key={batch.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left" hoverLift={true}>
                
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] bg-accent/10 border border-accent/20 px-2 py-0.5 rounded text-accent font-semibold">
                      {batch.id}
                    </span>
                    <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">{batch.type}</span>
                  </div>
                  <h3 className="font-display text-xs uppercase tracking-wider text-white font-bold">{batch.title}</h3>
                  <div className="flex items-center gap-4 text-[9px] font-mono text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-500" /> {batch.date}</span>
                    <span>Size: <strong className="text-slate-400">{batch.size}</strong></span>
                  </div>
                </div>

                {/* Download action */}
                <div className="flex items-center gap-3 w-full sm:w-auto border-t sm:border-t-0 border-accent/5 pt-3 sm:pt-0">
                  <span className={`flex items-center gap-1 font-mono text-[8px] tracking-wider px-2 py-1 border rounded uppercase font-bold ${
                    batch.status === "COMPILED" 
                      ? "border-success/30 bg-success/5 text-success" 
                      : "border-slate-800 bg-slate-900/60 text-slate-500"
                  }`}>
                    {batch.status}
                  </span>
                  <button
                    onClick={() => handleExportPdf(batch.id, batch.title)}
                    className="p-2 bg-accent/5 hover:bg-accent/15 border border-accent/15 hover:border-accent/40 rounded-lg text-accent hover:text-white transition-all flex items-center justify-center shrink-0 cursor-pointer"
                    title="Download Report File"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

              </GlassCard>
            ))}

          </div>

        </div>

      </main>
    </PageWrapper>
  );
}
