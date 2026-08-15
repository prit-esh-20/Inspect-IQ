import { useState, useEffect } from "react";
import { dashboardApi } from "../services/api/dashboardApi";

// Loads dashboard statistics once on mount. Values only change when a new
// backend response arrives — never via timers or local simulation.
export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    dashboardApi
      .getStatistics()
      .then((res) => {
        if (!cancelled) {
          setStats(res);
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

  return { stats, loading, error };
}