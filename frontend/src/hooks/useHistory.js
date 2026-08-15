import { useState, useEffect } from "react";
import { historyApi } from "../services/api/historyApi";

// History log fetching — refetches only when the user changes filters.
export function useHistory(filters) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    historyApi
      .getHistory({ ...filters, limit: 10 })
      .then((res) => {
        if (!cancelled) {
          setData(res.records);
          setTotal(res.total);
          setPages(res.pages);
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
  }, [filters]);

  return { data, total, pages, loading, error };
}