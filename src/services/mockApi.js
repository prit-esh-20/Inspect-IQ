import { MOCK_INSPECTION_HISTORY, MOCK_STATISTICS, MOCK_LIVE_ACTIVITIES, DEFECT_TYPES, PCB_MODELS } from "../utils/mockData";

// Artificial network latency simulation (300-500ms)
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

let settingsState = {
  yoloConfidence: 0.65,
  iouThreshold: 0.45,
  gradCamOpacity: 0.6,
  cameraFps: 30,
  inspectionSpeed: "Normal", // "Slow", "Normal", "Fast"
  activeModel: "YOLOv8x-PCB-v3.2",
  notifications: true
};

export const mockApi = {
  getStatistics: async () => {
    await delay(300);
    return { ...MOCK_STATISTICS };
  },

  getHistory: async ({ search = "", status = "ALL", defect = "ALL", page = 1, limit = 10, sortBy = "timestamp", order = "desc" }) => {
    await delay(450);
    let records = [...MOCK_INSPECTION_HISTORY];

    // Filter by search (id or model)
    if (search) {
      const q = search.toLowerCase();
      records = records.filter(r => r.id.toLowerCase().includes(q) || r.model.toLowerCase().includes(q));
    }

    // Filter by status
    if (status !== "ALL") {
      records = records.filter(r => r.status === status);
    }

    // Filter by defect
    if (defect !== "ALL") {
      records = records.filter(r => r.defect === defect);
    }

    // Sorting
    records.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === "timestamp") {
        valA = new Date(a.timestamp).getTime();
        valB = new Date(b.timestamp).getTime();
      }

      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });

    const total = records.length;
    const offset = (page - 1) * limit;
    const paginated = records.slice(offset, offset + limit);

    return {
      records: paginated,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    };
  },

  getInspectionById: async (id) => {
    await delay(300);
    const item = MOCK_INSPECTION_HISTORY.find(r => r.id === id);
    if (!item) throw new Error("Record not found");
    return { ...item };
  },

  getLiveActivities: async () => {
    await delay(200);
    return [...MOCK_LIVE_ACTIVITIES];
  },

  getSettings: async () => {
    await delay(200);
    return { ...settingsState };
  },

  updateSettings: async (newSettings) => {
    await delay(400);
    settingsState = { ...settingsState, ...newSettings };
    return { ...settingsState };
  },

  // Generates a mock real-time inspection event for the YOLO dashboard preview
  generateLiveInspection: () => {
    const isPass = Math.random() > 0.20; // 80% pass rate in real time
    const model = PCB_MODELS[Math.floor(Math.random() * PCB_MODELS.length)];
    const defects = [
      DEFECT_TYPES.SOLDER_BRIDGE,
      DEFECT_TYPES.MISSING_COMP,
      DEFECT_TYPES.POLARITY,
      DEFECT_TYPES.MISALIGNMENT,
      DEFECT_TYPES.WRONG_PART
    ];
    const defect = isPass ? DEFECT_TYPES.NONE : defects[Math.floor(Math.random() * defects.length)];
    const cycleTime = (1.1 + Math.random() * 0.8).toFixed(2);
    const confidence = isPass ? (94 + Math.random() * 5.5).toFixed(1) : (60 + Math.random() * 25).toFixed(1);
    const id = `PCB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const verificationDetails = {
      presence: [
        { component: "U1 (Main IC)", status: "PASS", confidence: 99.8 },
        { component: "U2 (Voltage Regulator)", status: "PASS", confidence: 99.4 },
        { component: "C12 (Filter Cap)", status: isPass || defect !== DEFECT_TYPES.MISSING_COMP ? "PASS" : "FAIL", confidence: isPass || defect !== DEFECT_TYPES.MISSING_COMP ? 98.4 : 12.3 },
        { component: "C13 (Filter Cap)", status: "PASS", confidence: 99.1 },
        { component: "R8 (Pull-up)", status: "PASS", confidence: 97.9 },
        { component: "D4 (Ind LED)", status: "PASS", confidence: 98.7 }
      ],
      position: [
        { component: "U1", offset: "0.01mm, -0.02mm", limit: "0.10mm", status: "PASS" },
        { component: "U2", offset: isPass || defect !== DEFECT_TYPES.MISALIGNMENT ? "0.03mm, 0.04mm" : "0.19mm, -0.11mm", limit: "0.15mm", status: isPass || defect !== DEFECT_TYPES.MISALIGNMENT ? "PASS" : "FAIL" },
        { component: "C12", offset: "0.02mm, 0.01mm", limit: "0.15mm", status: "PASS" },
        { component: "R8", offset: "0.05mm, -0.05mm", limit: "0.20mm", status: "PASS" }
      ],
      orientation: [
        { component: "U1", rotation: "0.2°", limit: "1.0°", status: "PASS" },
        { component: "D4 (Ind LED)", rotation: isPass || defect !== DEFECT_TYPES.POLARITY ? "0.5°" : "180.0°", limit: "5.0°", status: isPass || defect !== DEFECT_TYPES.POLARITY ? "PASS" : "FAIL" },
        { component: "R8", rotation: "1.1°", limit: "5.0°", status: "PASS" }
      ],
      count: {
        ic: { detected: 2, expected: 2, status: "PASS" },
        capacitors: { detected: 14, expected: 14, status: "PASS" },
        resistors: { detected: isPass || defect !== DEFECT_TYPES.MISSING_COMP ? 24 : 23, expected: 24, status: isPass || defect !== DEFECT_TYPES.MISSING_COMP ? "PASS" : "FAIL" }
      }
    };

    // Defect coordinates for drawing laser bounding box / Grad-CAM highlight
    const defectCoordinates = isPass ? null : {
      x: 180 + Math.floor(Math.random() * 220),
      y: 120 + Math.floor(Math.random() * 160),
      radius: 40 + Math.floor(Math.random() * 20)
    };

    const gradCamExplanation = isPass 
      ? "No structural anomalies found. Focus activations on standard PCB pin groupings indicate uniform thermal and electrical layout bounds."
      : `Defect Detected: ${defect}. Explainable AI (Grad-CAM) highlighted anomalous gradient density at region (${defectCoordinates?.x}, ${defectCoordinates?.y}). Heatmap indicates strong localized pixel deviation characteristic of a ${defect.toLowerCase()} defect.`;

    return {
      id,
      timestamp: new Date().toISOString(),
      model,
      status: isPass ? "PASS" : "FAIL",
      defect,
      cycleTime,
      confidence,
      componentsCount: 40 + Math.floor(Math.random() * 10),
      verificationDetails,
      defectCoordinates,
      gradCamExplanation
    };
  }
};
