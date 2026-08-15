// Mock Data for PCB AOI XAI System

export const PCB_MODELS = [
  "Raspberry Pi 4 Model B",
  "Jetson Nano Carrier Board",
  "Custom STM32 MCU Controller",
  "ESP32-WROOM IoT Gateway",
  "Dual-Motor Drive PCB v2.1"
];

export const DEFECT_TYPES = {
  SOLDER_BRIDGE: "Solder Bridge",
  MISSING_COMP: "Missing Component",
  POLARITY: "Polarity Mismatch",
  MISALIGNMENT: "Misalignment",
  WRONG_PART: "Wrong Part",
  NONE: "None"
};

export const MOCK_STATISTICS = {
  today: {
    inspected: 1482,
    pass: 1392,
    fail: 90,
    passRate: 93.93,
    avgCycleTime: 1.62, // in seconds
    systemUptime: "14h 32m",
    rpiTemp: "48.2°C",
    fps: 29.8
  },
  yesterday: {
    inspected: 1540,
    pass: 1432,
    fail: 108,
    passRate: 92.98,
    avgCycleTime: 1.65
  }
};

// 50 historical PCB records for search, filter and audit logging
export const MOCK_INSPECTION_HISTORY = Array.from({ length: 50 }).map((_, index) => {
  const id = 1000 + index;
  const isPass = Math.random() > 0.15; // 85% pass rate in history
  const model = PCB_MODELS[index % PCB_MODELS.length];
  
  // Custom timestamps spreading over the last 7 days
  const now = new Date();
  const date = new Date(now.getTime() - (index * 45 * 60 * 1000)); // offset by 45 mins each
  
  const defectsList = [
    DEFECT_TYPES.SOLDER_BRIDGE,
    DEFECT_TYPES.MISSING_COMP,
    DEFECT_TYPES.POLARITY,
    DEFECT_TYPES.MISALIGNMENT,
    DEFECT_TYPES.WRONG_PART
  ];
  const defect = isPass ? DEFECT_TYPES.NONE : defectsList[index % defectsList.length];
  
  const cycleTime = (1.2 + Math.random() * 0.9).toFixed(2);
  const confidence = isPass ? (95 + Math.random() * 4.8).toFixed(1) : (65 + Math.random() * 20).toFixed(1);

  // Bill of components details for X-MCCV verification
  const verificationDetails = {
    presence: [
      { component: "U1 (Main IC)", status: "PASS", confidence: 99.8 },
      { component: "U2 (Voltage Regulator)", status: "PASS", confidence: 99.6 },
      { component: "C12 (Filter Cap)", status: isPass || defect !== DEFECT_TYPES.MISSING_COMP ? "PASS" : "FAIL", confidence: isPass || defect !== DEFECT_TYPES.MISSING_COMP ? 98.4 : 12.3 },
      { component: "C13 (Filter Cap)", status: "PASS", confidence: 99.1 },
      { component: "R8 (Pull-up)", status: "PASS", confidence: 97.9 },
      { component: "D4 (Ind LED)", status: "PASS", confidence: 98.7 }
    ],
    position: [
      { component: "U1", offset: "0.01mm, -0.02mm", limit: "0.10mm", status: "PASS" },
      { component: "U2", offset: isPass || defect !== DEFECT_TYPES.MISALIGNMENT ? "0.03mm, 0.04mm" : "0.18mm, -0.12mm", limit: "0.15mm", status: isPass || defect !== DEFECT_TYPES.MISALIGNMENT ? "PASS" : "FAIL" },
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

  const defectCoordinates = isPass ? null : {
    x: 180 + (index * 35) % 240,
    y: 120 + (index * 25) % 180,
    radius: 45
  };

  const gradCamExplanation = isPass 
    ? "No anomalies found. Bounding box regions show clean pad layouts and proper component alignments."
    : `Defect Detected: ${defect}. YOLO model located structural anomaly at region (${defectCoordinates?.x}, ${defectCoordinates?.y}). Grad-CAM highlighting reflects significant deviation in pixel intensity gradients, indicating ${defect.toLowerCase()} features.`;

  return {
    id: `PCB-${date.getFullYear()}-${id}`,
    timestamp: date.toISOString(),
    model,
    status: isPass ? "PASS" : "FAIL",
    defect,
    cycleTime,
    confidence,
    componentsCount: 42 + (index % 10),
    verificationDetails,
    defectCoordinates,
    gradCamExplanation,
    operator: `Operator_Pi4_0${(index % 3) + 1}`
  };
});

// Recent Live Detections to feed into Live Panel activity
export const MOCK_LIVE_ACTIVITIES = [
  { id: "PCB-2026-2580", time: "12s ago", model: "Raspberry Pi 4 Model B", status: "PASS" },
  { id: "PCB-2026-2579", time: "1m 15s ago", model: "Raspberry Pi 4 Model B", status: "PASS" },
  { id: "PCB-2026-2578", time: "2m 45s ago", model: "ESP32-WROOM IoT Gateway", status: "FAIL", defect: DEFECT_TYPES.MISSING_COMP },
  { id: "PCB-2026-2577", time: "4m 10s ago", model: "Custom STM32 MCU Controller", status: "PASS" },
  { id: "PCB-2026-2576", time: "5m 30s ago", model: "Jetson Nano Carrier Board", status: "FAIL", defect: DEFECT_TYPES.SOLDER_BRIDGE }
];

// Analytics metrics
export const DEFECT_CHART_DATA = [
  { name: DEFECT_TYPES.SOLDER_BRIDGE, count: 32, color: "#FF4D6D" },
  { name: DEFECT_TYPES.MISSING_COMP, count: 24, color: "#FFC857" },
  { name: DEFECT_TYPES.POLARITY, count: 16, color: "#6EE7FF" },
  { name: DEFECT_TYPES.MISALIGNMENT, count: 12, color: "#00E5FF" },
  { name: DEFECT_TYPES.WRONG_PART, count: 6, color: "#a855f7" }
];

export const HOURLY_THROUGHPUT_DATA = [
  { hour: "08:00", inspected: 120, pass: 114, fail: 6 },
  { hour: "09:00", inspected: 145, pass: 138, fail: 7 },
  { hour: "10:00", inspected: 160, pass: 148, fail: 12 },
  { hour: "11:00", inspected: 155, pass: 146, fail: 9 },
  { hour: "12:00", inspected: 110, pass: 104, fail: 6 },
  { hour: "13:00", inspected: 130, pass: 122, fail: 8 },
  { hour: "14:00", inspected: 150, pass: 142, fail: 8 },
  { hour: "15:00", inspected: 165, pass: 156, fail: 9 },
  { hour: "16:00", inspected: 172, pass: 162, fail: 10 },
  { hour: "17:00", inspected: 115, pass: 110, fail: 5 }
];

export const TREND_7_DAYS = [
  { day: "Mon", passRate: 94.2, avgTime: 1.68 },
  { day: "Tue", passRate: 93.8, avgTime: 1.64 },
  { day: "Wed", passRate: 95.1, avgTime: 1.58 },
  { day: "Thu", passRate: 92.6, avgTime: 1.69 },
  { day: "Fri", passRate: 94.8, avgTime: 1.61 },
  { day: "Sat", passRate: 96.0, avgTime: 1.55 },
  { day: "Sun", passRate: 93.9, avgTime: 1.62 }
];
