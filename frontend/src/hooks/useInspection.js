import { useState, useCallback, useEffect, useRef } from "react";
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

// Centralized inspection state. Loads the latest result once on mount;
// runInspection() only fires when the user explicitly requests one and is
// guarded so a single run request can never be triggered twice.
export function useInspection() {
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [state, setState] = useState(INSPECTION_STATE.READY);
  const runningRef = useRef(false);

  const fetchInspection = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await inspectionApi.getLatestInspection();
      setInspection(result);
      return { ok: true, inspection: result };
    } catch (err) {
      setError(err);
      return { ok: false, message: toErrorMessage(err, "Unable to load inspection.") };
    } finally {
      setLoading(false);
    }
  }, []);

  const runInspection = useCallback(async (payload) => {
    if (runningRef.current) {
      return { ok: false, message: "Inspection already in progress." };
    }
    runningRef.current = true;
    setError(null);
    setLoading(true);
    setState(INSPECTION_STATE.STARTING);
    try {
      const response = await inspectionApi.runInspection(payload);
      const { inspection: next, state: nextState, error: nextError } = normalizeInspection(response);
      setInspection(next);
      setError(nextError || null);
      setState(nextState);
      if (nextState === INSPECTION_STATE.ERROR) {
        return { ok: false, message: nextError || "Inspection failed." };
      }
      return { ok: true, inspection: next, state: nextState };
    } catch (err) {
      setError(err);
      setState(INSPECTION_STATE.ERROR);
      return { ok: false, message: toErrorMessage(err, "Unable to start inspection.") };
    } finally {
      setLoading(false);
      runningRef.current = false;
    }
  }, []);

  // While the backend is still processing (INSPECTING), the user may fetch
  // the latest result to pick up a completed inspection.
  const refreshInspection = useCallback(async () => {
    if (state !== INSPECTION_STATE.INSPECTING) {
      return { ok: false, message: "No inspection in progress." };
    }
    setError(null);
    try {
      const result = await inspectionApi.getLatestInspection();
      setInspection(result);
      setState(INSPECTION_STATE.COMPLETED);
      return { ok: true, inspection: result };
    } catch (err) {
      setError(err);
      setState(INSPECTION_STATE.ERROR);
      return { ok: false, message: toErrorMessage(err, "Unable to load inspection.") };
    }
  }, [state]);

  useEffect(() => {
    fetchInspection();
  }, [fetchInspection]);

  return {
    inspection,
    loading,
    error,
    state,
    errorMessage: error ? toErrorMessage(error, "Unable to start inspection.") : null,
    runInspection,
    refreshInspection,
    fetchInspection,
  };
}
