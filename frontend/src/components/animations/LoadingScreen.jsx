import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, CheckCircle } from "lucide-react";

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const onFinishRef = useRef(onFinish);

  const bootLogs = [
    { text: "Booting Broadcom BCM2711 ARM Cortex-A72 SoC...", delay: 100 },
    { text: "Loading YOLOv8 neural network layers...", delay: 400 },
    { text: "Initializing OpenCV camera nodes...", delay: 850 },
    {
      text: "Loading Grad-CAM gradient explainability parameters...",
      delay: 1200,
    },
    {
      text: "Binding X-MCCV (Presence, Position, Orientation) nodes...",
      delay: 1650,
    },
    { text: "Establishing secure WebSocket pipeline to UI...", delay: 2100 },
    { text: "System diagnostic test: PASS.", delay: 2400 },
  ];

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    const duration = 2200;
    const intervalTime = 30;
    const startTime = Date.now();
    let finished = false;

    const progressTimer = window.setInterval(() => {
      // Time-based progress so throttled background tabs still finish on schedule
      const currentProgress = Math.min(
        ((Date.now() - startTime) / duration) * 100,
        100,
      );

      if (currentProgress >= 100 && !finished) {
        finished = true;
        window.clearInterval(progressTimer);
        setProgress(100);

        if (onFinishRef.current) onFinishRef.current();
        window.setTimeout(() => setIsCompleted(true), 70);
      } else {
        setProgress(currentProgress);
      }
    }, intervalTime);

    // Boot logs display
    const logTimers = bootLogs.map((log) =>
      window.setTimeout(() => {
        setLogs((prev) => [...prev, log.text]);
      }, log.delay),
    );

    return () => {
      window.clearInterval(progressTimer);
      logTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <AnimatePresence>
      {!isCompleted && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-9999 flex h-full w-full flex-col items-center justify-center bg-primary-bg p-6"
        >
          {/* Logo Module */}
          <div className="relative mb-12 flex flex-col items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-accent/20 bg-accent/5 shadow-[0_0_15px_rgba(50,213,131,0.16)]"
            >
              <Cpu className="w-10 h-10 text-accent" />
              <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-success led-fast" />
            </motion.div>

            <h1 className="text-center font-display text-2xl font-bold tracking-[0.2em] text-white">
              PI-AOI SCANNER
            </h1>
            <p className="mt-1 font-mono text-xs tracking-[0.24em] text-accent/80">
              AUTOMATED OPTICAL PCB INSPECTION
            </p>
          </div>

          {/* Electronic scanning visualization */}
          <div className="relative mb-6 flex h-40 w-full max-w-md flex-col justify-end overflow-hidden rounded-[1.25rem] border border-accent/15 bg-secondary-bg p-4 shadow-[inset_0_0_40px_rgba(50,213,131,0.08)]">
            <div
              className="laser-scanner"
              style={{ animationDuration: "1.8s" }}
            />

            {/* Terminal log logs */}
            <div className="flex flex-1 flex-col justify-end space-y-1.5 overflow-hidden pb-4 font-mono text-[9px] text-[#9ca3af] scrollbar-none">
              {logs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-accent font-bold">&gt;</span>
                  <span className="truncate">{log}</span>
                  {index === bootLogs.length - 1 && (
                    <CheckCircle className="w-2.5 h-2.5 text-success inline shrink-0" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Progress track */}
            <div className="h-1 w-full overflow-hidden rounded-full border border-accent/5 bg-[#111827]">
              <motion.div
                className="h-full bg-accent shadow-[0_0_10px_rgba(50,213,131,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Numeric Indicator */}
          <div className="flex items-center gap-2 font-mono text-lg font-bold tracking-[0.24em] text-white">
            <span>{Math.round(progress)}</span>
            <span className="text-accent">%</span>
          </div>
          <span className="mt-2 font-mono text-[9px] uppercase tracking-[0.24em] text-slate-500">
            Verifying Core Diagnostics
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
