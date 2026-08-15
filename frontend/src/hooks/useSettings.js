import { useState, useEffect, useCallback } from "react";
import { settingsApi } from "../services/api/settingsApi";

export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    settingsApi
      .getSettings()
      .then((res) => {
        if (!cancelled) {
          setSettings(res);
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

  const updateSettings = useCallback(async (next) => {
    const saved = await settingsApi.updateSettings(next);
    setSettings(saved);
    return saved;
  }, []);

  return { settings, loading, error, updateSettings };
}