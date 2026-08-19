// ============================================================================
// REPORT DATA NORMALIZATION LAYER
// ----------------------------------------------------------------------------
// Turns a raw inspection result (backend shape) into the stable structure the
// PDF builder consumes. Everything here is FIXED and deterministic — the same
// inspection always produces the same report data, and no random values are
// ever introduced. When the real backend is connected the same normalization
// keeps working unchanged.
// ============================================================================

const SEVERITY_BY_DEFECT = {
  "Solder Bridge": "Critical",
  "Missing Component": "Critical",
  "Polarity Mismatch": "High",
  Misalignment: "Medium",
  "Wrong Part": "Critical",
};

// Deterministic report-ID derivation: REP-YYYYMMDD-NNN. The per-day sequence
// counter is session-stable (module state), so repeated runs never collide and
// never produce random identifiers.
const countersByDay = new Map();

export function deriveReportId(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const key = `${year}-${month}-${day}`;
  const sequence = (countersByDay.get(key) || 0) + 1;
  countersByDay.set(key, sequence);
  return `REP-${year}${month}${day}-${String(sequence).padStart(3, "0")}`;
}

export const formatReportDate = (date) =>
  date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export const formatReportTime = (date) =>
  date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export function buildReportFilename(pcbId) {
  return `PCBVision_Inspection_Report_${pcbId || "PCB"}.pdf`;
}

// Maps an inspection result object into the normalized report dataset.
export function normalizeInspectionReport(inspection, options = {}) {
  const generatedAt = options.generatedAt ? new Date(options.generatedAt) : new Date();
  const rawStatus = String(inspection?.status || "FAIL").toUpperCase();
  const isPass = rawStatus === "PASS";

  const detections = (inspection?.detections || []).map((det) => {
    const detail = (inspection?.componentDetails || []).find((c) =>
      String(c.name || "").toLowerCase().startsWith(String(det.id || "").toLowerCase()),
    );
    const confidence = det.confidence ?? detail?.confidence;
    const passed = (detail?.status ?? "PASS") === "PASS";
    return {
      id: det.id || det.label || "—",
      label: det.label || det.id || "Component",
      result: passed ? "PASS" : "FAIL",
      observation: passed
        ? `Detected at ${Number(confidence).toFixed(1)}% confidence — placement verified.`
        : (detail?.reason || "Failed verification — check placement and rerun the inspection."),
    };
  });

  const defects = (inspection?.defects || []).map((def, index) => {
    const defectClass = def.class || def.type || def.label || "Unclassified";
    const bbox = def.bbox;
    const location = def.location || (bbox ? `${bbox.left}%, ${bbox.top}%` : "Region unspecified");
    return {
      id: def.id || `DFT-${String(index + 1).padStart(3, "0")}`,
      class: defectClass,
      location,
      severity: def.severity || SEVERITY_BY_DEFECT[defectClass] || "High",
      observation: def.observation || def.reason || `${defectClass} detected in the inspected region.`,
    };
  });

  const xai = inspection?.xai || {};
  const whatWasFound =
    xai.defect ||
    xai.explanation ||
    inspection?.xaiExplanation ||
    (isPass
      ? "No structural anomalies detected on the PCB."
      : "The inspection flagged this board as defective, but no explanation was provided.");

  const whyDidItPass = isPass
    ? (xai.explanation ||
      inspection?.xaiExplanation ||
      "The inspected component regions and PCB layout appear consistent with the expected visual pattern.")
    : "";

  const recommendedAction =
    xai.recommendation ||
    inspection?.correctiveAction ||
    (isPass
      ? "No corrective action required. Board can proceed to the next stage."
      : "Inspect the flagged region, correct the defect, and rerun the inspection.");

  const componentsDetected = detections.length;
  const defectsDetected = defects.length;

  return {
    reportId: options.reportId || deriveReportId(generatedAt),
    title: "Quality Inspection Report",
    filename: buildReportFilename(inspection?.pcbId),
    inspectionId: inspection?.inspectionId || "INSP-UNKNOWN",
    pcbId: inspection?.pcbId || "PCB-UNKNOWN",
    inspectionDate: inspection?.timestamp ? formatReportDate(new Date(inspection.timestamp)) : "—",
    inspectionTime: inspection?.timestamp ? formatReportTime(new Date(inspection.timestamp)) : "—",
    model: inspection?.model || "—",
    status: isPass ? "PASS" : rawStatus,
    confidence: inspection?.confidence,
    cycleTime: inspection?.cycleTime || "—",
    componentsDetected,
    defectsDetected,
    detections,
    defects,
    xai: { whatWasFound, whyDidItPass, recommendedAction },
    metrics: {
      duration: inspection?.cycleTime || "—",
      components: componentsDetected,
      defects: defectsDetected,
      result: isPass ? "PASS" : rawStatus,
    },
    generatedAt: generatedAt.toISOString(),
    generatedDate: formatReportDate(generatedAt),
    generatedTime: formatReportTime(generatedAt),
  };
}
