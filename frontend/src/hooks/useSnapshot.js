import { useState, useCallback, useRef } from "react";
import API_CONFIG from "../config/api";
import { snapshotApi } from "../services/api/snapshotApi";
import { toErrorMessage } from "../utils/apiError";

const saveBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const timestamp = () => new Date().toISOString().replace(/[:.]/g, "-");

const captureElementToCanvas = (imageElement) => {
  const canvas = document.createElement("canvas");
  canvas.width = imageElement.naturalWidth || imageElement.width;
  canvas.height = imageElement.naturalHeight || imageElement.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(imageElement, 0, 0);
  return canvas;
};

// Snapshot action. Captures the ACTUAL current inspection frame:
//  - an uploaded/displayed image is captured client-side from its real pixels
//  - a connected camera backend captures the live frame
//  - otherwise no frame exists and a clear error is surfaced
export function useSnapshot() {
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState(null);
  const runningRef = useRef(false);

  const captureSnapshot = useCallback(async ({ imageElement, inspection }) => {
    if (runningRef.current) {
      return { ok: false, message: "A snapshot is already being captured." };
    }

    runningRef.current = true;
    setCapturing(true);
    setError(null);
    const pcbId = inspection?.pcbId || "UPLOAD";
    const filename = `PCB_${pcbId}_${timestamp()}.png`;

    try {
      // 1. Displayed frame (uploaded/static image) — capture its real pixels.
      if (imageElement?.naturalWidth) {
        const canvas = captureElementToCanvas(imageElement);
        const blob = await new Promise((resolve, reject) =>
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Frame capture failed."))), "image/png"),
        );
        saveBlob(blob, filename);
        return { ok: true, filename, source: "viewport" };
      }

      // 2. Real camera backend.
      if (!API_CONFIG.useMock) {
        const result = await snapshotApi.captureFromCamera();
        if (result?.blob) {
          saveBlob(result.blob, filename);
          return { ok: true, filename, source: "camera" };
        }
        return { ok: false, message: "No inspection frame available." };
      }

      // 3. No frame available.
      return { ok: false, message: "No inspection frame available." };
    } catch (err) {
      const message = toErrorMessage(err, "Unable to capture snapshot.");
      setError(err);
      return { ok: false, message };
    } finally {
      setCapturing(false);
      runningRef.current = false;
    }
  }, []);

  return {
    capturing,
    error,
    errorMessage: error ? toErrorMessage(error, "Unable to capture snapshot.") : null,
    captureSnapshot,
  };
}
