import { useState, useCallback, useRef } from "react";
import { xaiApi } from "../services/api/xaiApi";
import { toErrorMessage } from "../utils/apiError";

// XAI state for the current inspection. requestGradCam() fetches the real
// Grad-CAM result from the backend — the overlay is only rendered from data
// this service returns, never from a locally generated heatmap.
export function useXAI() {
  const [gradCam, setGradCam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const runningRef = useRef(false);

  const requestGradCam = useCallback(async (inspectionId) => {
    if (runningRef.current) {
      return { ok: false, message: "Grad-CAM request already in progress." };
    }
    if (!inspectionId) {
      setError({ message: "Grad-CAM analysis unavailable." });
      return { ok: false, message: "Grad-CAM analysis unavailable." };
    }

    runningRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const result = await xaiApi.getGradCam(inspectionId);
      setGradCam(result);
      return { ok: true, result };
    } catch (err) {
      const message = toErrorMessage(err, "Grad-CAM analysis unavailable.");
      setError(err);
      return { ok: false, message };
    } finally {
      setLoading(false);
      runningRef.current = false;
    }
  }, []);

  const clear = useCallback(() => {
    setGradCam(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    gradCam,
    loading,
    error,
    errorMessage: error ? toErrorMessage(error, "Grad-CAM analysis unavailable.") : null,
    requestGradCam,
    clear,
  };
}
