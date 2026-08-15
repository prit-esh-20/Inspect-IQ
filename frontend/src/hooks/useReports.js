import { useState, useEffect } from "react";
import { reportsApi } from "../services/api/reportsApi";

export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    reportsApi
      .getReports()
      .then((res) => {
        if (!cancelled) {
          setReports(res);
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

  return { reports, loading, error };
}