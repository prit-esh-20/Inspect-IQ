import AppLayout from "../../components/layout/AppLayout";
import GlassCard from "../../components/cards/GlassCard";
import { useSystemSettings } from "../../hooks/useSystemSettings";
import { Lock, Sliders, Camera, Layers, Bell, Cpu } from "lucide-react";

function CardHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 border-b border-accent/5 pb-2.5">
      <Icon className="w-4 h-4 text-accent" />
      <span className="font-display text-[10px] tracking-widest text-[#9ca3af] uppercase font-bold">
        {title}
      </span>
      <span className="ml-auto flex items-center gap-1 font-mono text-[8px] text-slate-500 uppercase tracking-widest">
        <Lock className="w-2.5 h-2.5" />
        Read Only
      </span>
    </div>
  );
}

function ReadOnlyValue({ label, value }) {
  return (
    <div className="space-y-2">
      <label className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block font-bold">
        {label}
      </label>
      <div className="w-full bg-[#050816]/60 border border-accent/15 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-white truncate">{value}</span>
        <Lock className="w-3 h-3 text-slate-500 shrink-0" />
      </div>
    </div>
  );
}

function ReadOnlyScale({ label, value, display }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between font-mono text-[9px] text-slate-400 font-bold">
        <span>{label}</span>
        <span className="flex items-center gap-1 text-accent">
          <Lock className="w-2.5 h-2.5" />
          {display}
        </span>
      </div>
      <div className="relative h-1.5 w-full rounded-full bg-slate-900">
        <div className="absolute inset-y-0 left-0 rounded-full bg-accent/60" style={{ width: `${value}%` }} />
        <span
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-[#050816] bg-accent shadow-[0_0_8px_rgba(50,213,131,0.6)]"
          style={{ left: `calc(${value}% - 6px)` }}
        />
      </div>
    </div>
  );
}

function StatusIndicator({ label, enabled }) {
  return (
    <div className="flex items-center justify-between gap-3 font-mono text-[10px] text-slate-400">
      <span>{label}</span>
      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
        enabled
          ? "border-success/30 bg-success/5 text-success"
          : "border-slate-800 bg-slate-900/60 text-slate-500"
      }`}>
        <span className={`h-1.5 w-1.5 rounded-full ${enabled ? "bg-success" : "bg-slate-600"}`} />
        {enabled ? "Enabled" : "Disabled"}
      </span>
    </div>
  );
}

export default function SettingsPage() {
  const { settings, loading, error } = useSystemSettings();

  return (
    <AppLayout>

      {/* Main Container — shared wrapper for heading + cards */}
      <main className="flex-1 p-6 md:p-8 space-y-6 max-w-[1200px] mx-auto w-full">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-accent/10 pb-4">
          <div className="text-left space-y-1">
            <h1 className="font-display text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
              System Settings
            </h1>
            <p className="font-mono text-[10px] text-accent/70 tracking-widest uppercase">
              Embedded YOLO Engine & Camera Node Settings
            </p>
          </div>
          <span className="self-start md:self-auto flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 font-mono text-[9px] uppercase tracking-widest text-accent font-bold">
            <Lock className="w-3 h-3" />
            Read Only
          </span>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center font-mono text-xs text-slate-500 uppercase tracking-widest">
            Loading system configuration...
          </div>
        ) : error ? (
          <div className="h-64 flex flex-col items-center justify-center gap-2 font-mono text-xs text-slate-500 uppercase tracking-widest">
            <span className="text-danger">Unable to load system configuration.</span>
            <span className="text-slate-600 normal-case">Please try again.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">

            {/* 1. YOLO Neural Model Config */}
            <GlassCard hoverLift={false}>
              <div className="space-y-5">
                <CardHeader icon={Sliders} title="YOLO Neural Network Parameters" />

                <div className="space-y-5">
                  <ReadOnlyValue label="Active YOLO Weights" value={settings.yolo.weights} />
                  <ReadOnlyScale
                    label="Confidence Threshold"
                    value={Math.round(settings.yolo.confidenceThreshold * 100)}
                    display={`${Math.round(settings.yolo.confidenceThreshold * 100)}%`}
                  />
                  <ReadOnlyScale
                    label="IoU Overlap Threshold"
                    value={Math.round(settings.yolo.iouThreshold * 100)}
                    display={`${Math.round(settings.yolo.iouThreshold * 100)}%`}
                  />
                </div>
              </div>
            </GlassCard>

            {/* 2. Optical Camera Config */}
            <GlassCard hoverLift={false}>
              <div className="space-y-5">
                <CardHeader icon={Camera} title="Camera Capture Nodes" />

                <div className="space-y-5">
                  <ReadOnlyValue label="Camera Video Node" value={settings.camera.videoNode} />
                  <ReadOnlyScale
                    label="Target Stream FPS"
                    value={Math.round(((settings.camera.targetFps - 10) / 50) * 100)}
                    display={`${settings.camera.targetFps} FPS`}
                  />
                </div>
              </div>
            </GlassCard>

            {/* 3. Explainable AI Heatmap configuration */}
            <GlassCard hoverLift={false}>
              <div className="space-y-5">
                <CardHeader icon={Layers} title="Explainability (Grad-CAM) Layout" />

                <div className="space-y-5">
                  <ReadOnlyValue label="Target Conv Layer Name" value={settings.gradCam.targetLayer} />
                  <ReadOnlyScale
                    label="Default Overlay Transparency"
                    value={Math.round(settings.gradCam.overlayTransparency * 100)}
                    display={`${Math.round(settings.gradCam.overlayTransparency * 100)}%`}
                  />
                </div>
              </div>
            </GlassCard>

            {/* 4. Notification Alerts Config */}
            <GlassCard hoverLift={false}>
              <div className="space-y-5">
                <CardHeader icon={Bell} title="Hardware Alerts & Logging" />

                <div className="space-y-3">
                  <StatusIndicator
                    label="Trigger warning audio alarm on defect:"
                    enabled={settings.alerts.warningAudio}
                  />
                  <StatusIndicator
                    label="Auto-archive failing PCB captures:"
                    enabled={settings.alerts.autoArchiveFailures}
                  />
                </div>
              </div>
            </GlassCard>

            {/* 5. Raspberry Pi Hardware Environment */}
            <div className="md:col-span-2">
              <GlassCard className="!p-6" hoverLift={false}>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-accent/5 pb-3">
                    <div className="p-2.5 bg-accent/5 rounded-lg border border-accent/20">
                      <Cpu className="w-5 h-5 text-accent animate-pulse" />
                    </div>
                    <div className="text-left">
                      <span className="font-display text-[10px] tracking-widest text-[#9ca3af] uppercase font-bold block">
                        Raspberry Pi Hardware Environment
                      </span>
                      <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">
                        System Defined &middot; Read Only
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                    {[
                      { label: "SOC Model", value: settings.hardware.socModel },
                      { label: "Architecture", value: settings.hardware.architecture },
                      { label: "OS Distribution", value: settings.hardware.os },
                      { label: "Memory Size", value: settings.hardware.memory },
                    ].map((item) => (
                      <div key={item.label} className="space-y-1.5">
                        <label className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block font-bold">
                          {item.label}
                        </label>
                        <div className="w-full bg-[#050816]/60 border border-accent/15 rounded-lg px-3 py-2.5 font-mono text-xs text-white">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>

          </div>
        )}

      </main>
    </AppLayout>
  );
}