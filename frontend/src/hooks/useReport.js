import { useState, useCallback, useRef } from "react";
import { reportApi } from "../services/api/reportApi";
import { toErrorMessage } from "../utils/apiError";

const triggerDownload = (url, filename) => {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};

// Report generation action. Never builds a PDF on the frontend — the backend
// generates the report and returns download information. If the backend
// returns a downloadUrl, the browser downloads it.
export function useReport() {
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const runningRef = useRef(false);

  const generateReport = useCallback(async (payload) => {
    if (runningRef.current) {
      return { ok: false, message: "Report generation is already running." };
    }

    runningRef.current = true;
    setGenerating(true);
    setError(null);
    setResult(null);
    try {
      const response = await reportApi.generateReport(payload);
      setResult(response);
      if (response?.downloadUrl) {
        triggerDownload(response.downloadUrl, response.filename || "inspection-report.pdf");
      }
      return { ok: true, result: response };
    } catch (err) {
      const message = toErrorMessage(err, "Unable to generate report.");
      setError(err);
      return { ok: false, message };
    } finally {
      setGenerating(false);
      runningRef.current = false;
    }
  }, []);

  return {
    generating,
    result,
    error,
    errorMessage: error ? toErrorMessage(error, "Unable to generate report.") : null,
    generateReport,
  };
}
