// ============================================================================
// REPORT GENERATION SERVICE
// ----------------------------------------------------------------------------
// Dedicated backend-ready entry point: generateInspectionReport(inspectionData)
// consumes a plain inspection result object and produces a downloadable PDF
// report record. In mock mode the PDF is built in the browser; when the real
// backend is connected, the API layer (reportApi) forwards the same inspection
// data to the server and receives the download URL instead — the UI flow does
// not change.
// ============================================================================

import { buildInspectionPdf, pdfToBlob } from "./reportBuilder";
import { normalizeInspectionReport } from "./reportData";

// Loads an image URL into a JPEG data URL (canvas round-trip) so the PDF can
// embed the actual inspected board frame. Fails softly — the PDF falls back
// to the "PCB IMAGE NOT AVAILABLE" placeholder.
export function imageToDataUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const width = img.naturalWidth || 600;
        const height = img.naturalHeight || 400;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);
        resolve({ dataUrl: canvas.toDataURL("image/jpeg", 0.85), width, height });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error("Unable to load the PCB image for the report."));
    img.src = url;
  });
}

export const generateInspectionReport = async (inspection, options = {}) => {
  const reportData = normalizeInspectionReport(inspection, options);

  let imageDataUrl = null;
  let imageDims = null;
  if (options.imageUrl) {
    try {
      const loaded = await imageToDataUrl(options.imageUrl);
      imageDataUrl = loaded.dataUrl;
      imageDims = { width: loaded.width, height: loaded.height };
    } catch {
      imageDataUrl = null;
      imageDims = null;
    }
  }

  const doc = buildInspectionPdf(reportData, { imageDataUrl, imageDims });
  const blob = pdfToBlob(doc);
  const downloadUrl = URL.createObjectURL(blob);

  return {
    reportId: reportData.reportId,
    title: reportData.title,
    filename: reportData.filename,
    pcbId: reportData.pcbId,
    status: "COMPILED",
    date: reportData.generatedDate,
    size: `${Math.max(1, Math.round(blob.size / 1024))} KB`,
    type: "Inspection Report",
    downloadUrl,
    generatedAt: reportData.generatedAt,
    blob,
  };
};
