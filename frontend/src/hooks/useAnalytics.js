import { useState, useEffect } from "react";
import { analyticsApi } from "../services/api/analyticsApi";

// Loads analytics once on mount. If the backend returns no data, the
// Analytics page renders an empty state instead of fabricated trends.
export function useAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    analyticsApi
      .getAnalytics()
      .then((res) => {
        if (!cancelled) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}