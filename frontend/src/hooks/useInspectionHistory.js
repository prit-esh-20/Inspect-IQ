import { useState, useEffect, useCallback } from "react";
import { inspectionHistoryApi } from "../services/api/inspectionHistoryApi";
import { normalizeInspectionList, normalizeInspectionRecord } from "../models/inspection";

const DEFAULT_PAGE_SIZE = 10;

// Inspection history fetching — refetches only when filters change or the
// user explicitly requests a retry. Renders whatever the service returns;
// no fake records, no local filtering.
export function useInspectionHistory(filters) {
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    inspectionHistoryApi
      .getInspectionHistory({ ...filters, pageSize: DEFAULT_PAGE_SIZE })
      .then((res) => {
        if (!cancelled) {
          const totalRecords = res.totalRecords ?? res.total ?? 0;
          setRecords(normalizeInspectionList(res.records));
          setTotal(totalRecords);
          setPages(res.pages ?? Math.ceil(totalRecords / DEFAULT_PAGE_SIZE));
          setError(null);
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
  }, [filters, reloadKey]);

  const refetch = useCallback(() => setReloadKey((key) => key + 1), []);

  return { records, total, pages, loading, error, refetch };
}

// Fetches and normalizes one complete inspection record for the details view.
export async function fetchInspectionDetails(id) {
  const record = await inspectionHistoryApi.getInspectionDetails(id);
  return normalizeInspectionRecord(record);
}