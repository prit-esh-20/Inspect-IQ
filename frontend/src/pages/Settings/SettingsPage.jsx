import { useState, useEffect } from "react";
import AppLayout from "../../components/layout/AppLayout";
import GlassCard from "../../components/cards/GlassCard";
import Button from "../../components/common/Button";
import { mockApi } from "../../services/mockApi";
import { toast, Toaster } from "react-hot-toast";
import { 
  Sliders, 
  Camera, 
  Layers, 
  Bell, 
  Info, 
  Save, 
  Cpu, 
  RefreshCw 
} from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    mockApi.getSettings().then((res) => {
      setSettings(res);
      setLoading(false);
    });
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!settings) return;

    toast.promise(
      mockApi.updateSettings(settings),
      {
        loading: "Saving parameters to Raspberry Pi config files...",
        success: <b>Configuration updated successfully!</b>,
        error: <b>Error updating configurations</b>
      },
      {
        style: {
          background: "#111827",
          color: "#fff",
          border: "1px solid rgba(0, 229, 255, 0.3)"
        }
      }
    );
  };

  const handleInputChange = (key, val) => {
    setSettings((prev) => ({
      ...prev,
      [key]: val
    }));
  };

  if (loading || !settings) {
    return (
      <div className="flex h-screen pl-56 items-center justify-center font-mono text-xs text-slate-500 uppercase tracking-widest">
        Loading Configurations...
      </div>
    );
  }

  return (
    <AppLayout>
      <Toaster position="top-right" />

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-accent/10 pb-4">
          <div className="text-left space-y-0.5">
            <h1 className="font-display text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
              System Settings
            </h1>
            <p className="font-mono text-[10px] text-accent/70 tracking-widest uppercase">
              Embedded YOLO Engine & Camera Node Settings
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          
          {/* 1. YOLO Neural Model Config */}
          <GlassCard className="space-y-4" hoverLift={false}>
            <div className="flex items-center gap-2 border-b border-accent/5 pb-2">
              <Sliders className="w-4 h-4 text-accent" />
              <span className="font-display text-[10px] tracking-widest text-[#9ca3af] uppercase font-bold">
                YOLO Neural Network Parameters
              </span>
            </div>

            <div className="space-y-4">
              {/* Active Model */}
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block font-bold">
                  Active YOLO Weights
                </label>
                <select
                  value={settings.activeModel}
                  onChange={(e) => handleInputChange("activeModel", e.target.value)}
                  className="w-full bg-[#050816]/60 border border-accent/15 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-accent cursor-pointer font-mono"
                >
                  <option value="YOLOv8x-PCB-v3.2">YOLOv8x-PCB-v3.2 (Precision)</option>
                  <option value="YOLOv8n-PCB-nano">YOLOv8n-PCB-nano (High FPS)</option>
                  <option value="YOLOv5s-PCB-v1.0">YOLOv5s-PCB-v1.0 (Legacy)</option>
                </select>
              </div>

              {/* Confidence threshold */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[9px] text-slate-400 font-bold">
                  <span>CONFIDENCE THRESHOLD</span>
                  <span className="text-accent">{Math.round(settings.yoloConfidence * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="0.95"
                  step="0.05"
                  value={settings.yoloConfidence}
                  onChange={(e) => handleInputChange("yoloConfidence", parseFloat(e.target.value))}
                  className="w-full accent-accent h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* IOU threshold */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[9px] text-slate-400 font-bold">
                  <span>IOU OVERLAP THRESHOLD</span>
                  <span className="text-accent">{Math.round(settings.iouThreshold * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.8"
                  step="0.05"
                  value={settings.iouThreshold}
                  onChange={(e) => handleInputChange("iouThreshold", parseFloat(e.target.value))}
                  className="w-full accent-accent h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </GlassCard>

          {/* 2. Optical Camera Config */}
          <GlassCard className="space-y-4" hoverLift={false}>
            <div className="flex items-center gap-2 border-b border-accent/5 pb-2">
              <Camera className="w-4 h-4 text-accent" />
              <span className="font-display text-[10px] tracking-widest text-[#9ca3af] uppercase font-bold">
                Camera Capture Nodes
              </span>
            </div>

            <div className="space-y-4">
              {/* Selected Node */}
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block font-bold">
                  Camera Video Node
                </label>
                <select
                  defaultValue="/dev/video0"
                  className="w-full bg-[#050816]/60 border border-accent/15 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-accent cursor-pointer font-mono"
                >
                  <option value="/dev/video0">/dev/video0 - Pi Cam Module (CSI)</option>
                  <option value="/dev/video1">/dev/video1 - USB Logitech Cam</option>
                  <option value="sim">Virtual Simulation Pipeline</option>
                </select>
              </div>

              {/* Target FPS */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[9px] text-slate-400 font-bold">
                  <span>TARGET STREAM FPS</span>
                  <span className="text-accent">{settings.cameraFps} FPS</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={settings.cameraFps}
                  onChange={(e) => handleInputChange("cameraFps", parseInt(e.target.value))}
                  className="w-full accent-accent h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </GlassCard>

          {/* 3. Explainable AI Heatmap configuration */}
          <GlassCard className="space-y-4" hoverLift={false}>
            <div className="flex items-center gap-2 border-b border-accent/5 pb-2">
              <Layers className="w-4 h-4 text-accent" />
              <span className="font-display text-[10px] tracking-widest text-[#9ca3af] uppercase font-bold">
                Explainability (Grad-CAM) Layout
              </span>
            </div>

            <div className="space-y-4">
              {/* Target convolutional Layer */}
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block font-bold">
                  Target Conv Layer Name
                </label>
                <input
                  type="text"
                  defaultValue="model.model.22.cv3.d1"
                  className="w-full bg-[#050816]/60 border border-accent/15 rounded-lg px-3 py-2.5 font-mono text-xs text-white focus:outline-none focus:border-accent"
                />
              </div>

              {/* Heatmap Default Opacity */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[9px] text-slate-400 font-bold">
                  <span>DEFAULT OVERLAY TRANSPARENCY</span>
                  <span className="text-accent">{Math.round(settings.gradCamOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.9"
                  step="0.05"
                  value={settings.gradCamOpacity}
                  onChange={(e) => handleInputChange("gradCamOpacity", parseFloat(e.target.value))}
                  className="w-full accent-accent h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </GlassCard>

          {/* 4. Notification Alerts Config */}
          <GlassCard className="space-y-4" hoverLift={false}>
            <div className="flex items-center gap-2 border-b border-accent/5 pb-2">
              <Bell className="w-4 h-4 text-accent" />
              <span className="font-display text-[10px] tracking-widest text-[#9ca3af] uppercase font-bold">
                Hardware Alerts & Logging
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                <span>Trigger warning audio alarm on defect:</span>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleInputChange("notifications", e.target.checked)}
                  className="accent-accent w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                <span>Auto-archive failing PCB captures:</span>
                <input type="checkbox" defaultChecked className="accent-accent w-4 h-4 cursor-pointer" />
              </div>
            </div>
          </GlassCard>

          {/* 5. Raspberry Pi Telemetry (Col: 2) */}
          <div className="md:col-span-2">
            <GlassCard className="flex flex-col md:flex-row items-center justify-between gap-6" hoverLift={false}>
              
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-accent/5 rounded-xl border border-accent/20">
                  <Cpu className="w-8 h-8 text-accent animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display text-xs uppercase tracking-wider text-white font-bold">
                    Raspberry Pi Hardware Environment
                  </h4>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[10px] font-mono text-slate-400">
                    <span>SOC MODEL: Broadcom BCM2711</span>
                    <span>ARCHITECTURE: AArch64 (64-bit)</span>
                    <span>OS DISTRO: Debian Bullseye (6.1 LTS)</span>
                    <span>MEM SIZE: 4.0 GB LPDDR4</span>
                  </div>
                </div>
              </div>

              {/* Action save button */}
              <Button type="submit" variant="primary" className="flex items-center gap-2 w-full md:w-auto font-bold shrink-0 justify-center">
                <Save className="w-4 h-4" />
                Save Configurations
              </Button>

            </GlassCard>
          </div>

        </form>

      </main>
    </AppLayout>
  );
}
