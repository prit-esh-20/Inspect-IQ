import { useSyncExternalStore } from "react";
import { inspectionApi } from "../services/api/inspectionApi";
import { toErrorMessage } from "../utils/apiError";

// Inspection lifecycle states:
//   READY      — nothing running, button available
//   STARTING   — run request in flight
//   INSPECTING — backend acknowledged the run but has not returned a result
//   COMPLETED  — a result was received
//   ERROR      — the run failed
export const INSPECTION_STATE = {
  READY: "READY",
  STARTING: "STARTING",
  INSPECTING: "INSPECTING",
  COMPLETED: "COMPLETED",
  ERROR: "ERROR",
};

// Scan phases mirror the sequential AOI sweep:
//   idle       — nothing running
//   horizontal — phase 1: horizontal line sweeps TOP → BOTTOM
//   vertical   — phase 2: vertical line sweeps LEFT → RIGHT
//   complete   — scanning finished, the result may be revealed
export const SCAN_PHASE = {
  IDLE: "idle",
  HORIZONTAL: "horizontal",
  VERTICAL: "vertical",
  COMPLETE: "complete",
};

// Single, sequential scan timeline. Horizontal and vertical never overlap:
//   horizontal: progress 0%  → 50%
//   vertical:   progress 50% → 100%
const HORIZONTAL_MS = 2600;
const VERTICAL_MS = 2600;
const TOTAL_SCAN_MS = HORIZONTAL_MS + VERTICAL_MS;

const normalizeInspection = (response) => {
  if (!response) return { inspection: null, state: INSPECTION_STATE.READY };
  if (response.inspection) {
    return { inspection: response.inspection, state: INSPECTION_STATE.COMPLETED };
  }

  const status = String(response.status || response.state || "").toUpperCase();
  if (status === "ERROR") {
    return { inspection: null, state: INSPECTION_STATE.ERROR, error: response.message };
  }
  if (status === "INSPECTING" || status === "STARTING") {
    return { inspection: null, state: INSPECTION_STATE.INSPECTING };
  }

  return { inspection: response, state: INSPECTION_STATE.COMPLETED };
};

// ---- Shared inspection + scan store ---------------------------------------
// Module-level state so Dashboard and Live Inspection render the exact same
// inspection lifecycle and scan phase. There is ONE inspection process and
// ONE scan timeline — the pages only visualize it.
let snapshot = {
  inspection: null,
  loading: false,
  error: null,
  errorMessage: null,
  state: INSPECTION_STATE.READY,
  scanPhase: SCAN_PHASE.IDLE,
  scanProgress: 0,
};

const listeners = new Set();
const emit = () => listeners.forEach((listener) => listener());
const patch = (next) => {
  snapshot = { ...snapshot, ...next };
  emit();
};

let runningRef = false;
let rafId = null;

const cancelTimeline = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
};

// One rAF-driven timeline for the whole scan. Computes BOTH the active phase
// and the progress from elapsed time — no independent timers that can overlap.
const startScanTimeline = () => {
  cancelTimeline();
  const start = performance.now();

  const tick = (now) => {
    const elapsed = now - start;
    if (elapsed >= TOTAL_SCAN_MS) {
      rafId = null;
      patch({ scanPhase: SCAN_PHASE.COMPLETE, scanProgress: 100 });
      return;
    }
    if (elapsed < HORIZONTAL_MS) {
      patch({
        scanPhase: SCAN_PHASE.HORIZONTAL,
        scanProgress: (elapsed / HORIZONTAL_MS) * 50,
      });
    } else {
      patch({
        scanPhase: SCAN_PHASE.VERTICAL,
        scanProgress: 50 + ((elapsed - HORIZONTAL_MS) / VERTICAL_MS) * 50,
      });
    }
    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
};

const stopScanWithError = (err, fallback) => {
  cancelTimeline();
  patch({
    error: err,
    errorMessage: toErrorMessage(err, fallback),
    state: INSPECTION_STATE.ERROR,
    scanPhase: SCAN_PHASE.IDLE,
    scanProgress: 0,
  });
};

// Centralized inspection + scan state. Results are NEVER auto-loaded: an
// inspection result only exists after the user explicitly requests one via
// runInspection() (or refreshInspection() while the backend is processing).
// runInspection() is guarded so a single run request can never be triggered
// twice.
const runInspection = async (payload) => {
  const { scanPhase } = snapshot;
  if (
    runningRef ||
    scanPhase === SCAN_PHASE.HORIZONTAL ||
    scanPhase === SCAN_PHASE.VERTICAL
  ) {
    return { ok: false, message: "Inspection already in progress." };
  }
  runningRef = true;
  patch({
    inspection: null,
    error: null,
    errorMessage: null,
    loading: true,
    state: INSPECTION_STATE.STARTING,
    scanPhase: SCAN_PHASE.HORIZONTAL,
    scanProgress: 0,
  });
  startScanTimeline();
  try {
    const response = await inspectionApi.runInspection(payload);
    const { inspection: next, state: nextState, error: nextError } = normalizeInspection(response);
    patch({
      inspection: next,
      error: nextError || null,
      errorMessage: nextError || null,
      state: nextState,
    });
    if (nextState === INSPECTION_STATE.ERROR) {
      stopScanWithError(nextError || null, "Inspection failed.");
      return { ok: false, message: nextError || "Inspection failed." };
    }
    return { ok: true, inspection: next, state: nextState };
  } catch (err) {
    stopScanWithError(err, "Unable to start inspection.");
    return { ok: false, message: toErrorMessage(err, "Unable to start inspection.") };
  } finally {
    patch({ loading: false });
    runningRef = false;
  }
};

const fetchInspection = async () => {
  patch({ loading: true, error: null });
  try {
    const result = await inspectionApi.getLatestInspection();
    patch({ inspection: result });
    return { ok: true, inspection: result };
  } catch (err) {
    patch({ error: err, errorMessage: toErrorMessage(err, "Unable to load inspection.") });
    return { ok: false, message: toErrorMessage(err, "Unable to load inspection.") };
  } finally {
    patch({ loading: false });
  }
};

// While the backend is still processing (INSPECTING), the user may fetch
// the latest result to pick up a completed inspection.
const refreshInspection = async () => {
  if (snapshot.state !== INSPECTION_STATE.INSPECTING) {
    return { ok: false, message: "No inspection in progress." };
  }
  patch({ error: null });
  try {
    const result = await inspectionApi.getLatestInspection();
    patch({ inspection: result, state: INSPECTION_STATE.COMPLETED });
    return { ok: true, inspection: result };
  } catch (err) {
    patch({ error: err, errorMessage: toErrorMessage(err, "Unable to load inspection.") });
    return { ok: false, message: toErrorMessage(err, "Unable to load inspection.") };
  }
};

// Clears any inspection result/error and returns to the idle READY state.
// Used when the uploaded PCB image is discarded.
const resetInspection = () => {
  cancelTimeline();
  patch({
    inspection: null,
    error: null,
    errorMessage: null,
    loading: false,
    state: INSPECTION_STATE.READY,
    scanPhase: SCAN_PHASE.IDLE,
    scanProgress: 0,
  });
  runningRef = false;
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// Hook returning only coarse lifecycle values; a component re-renders only
// when one of its values actually changes (not on every progress frame).
export function useInspection() {
  const inspection = useSyncExternalStore(subscribe, () => snapshot.inspection);
  const loading = useSyncExternalStore(subscribe, () => snapshot.loading);
  const error = useSyncExternalStore(subscribe, () => snapshot.error);
  const errorMessage = useSyncExternalStore(subscribe, () => snapshot.errorMessage);
  const state = useSyncExternalStore(subscribe, () => snapshot.state);
  const scanPhase = useSyncExternalStore(subscribe, () => snapshot.scanPhase);

  return {
    inspection,
    loading,
    error,
    errorMessage,
    state,
    scanPhase,
    runInspection,
    refreshInspection,
    fetchInspection,
    resetInspection,
  };
}

// Fine-grained scan progress (0-100). Used by the scanning overlay and the
// compact progress indicator so those re-render per frame without re-rendering
// the whole page.
export function useScanProgress() {
  return useSyncExternalStore(subscribe, () => snapshot.scanProgress);
}
