import { useState, useEffect, useCallback } from "react";
import { inspectionApi } from "../services/api/inspectionApi";

// Centralized inspection state. Loads the latest result once on mount;
// runInspection() only fires when the user explicitly requests one.
export function useInspection() {
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInspection = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await inspectionApi.getLatestInspection();
      setInspection(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const runInspection = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await inspectionApi.runInspection();
      setInspection(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInspection();
  }, [fetchInspection]);

  return { inspection, loading, error, runInspection };
}