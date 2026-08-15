/**
 * Data contracts for inspection history records.
 */

/**
 * @typedef {Object} HistoryRecord
 * @property {string} id           - PCB audit id, e.g. "PCB-2026-1001"
 * @property {string} timestamp    - ISO timestamp
 * @property {string} model        - Target model name
 * @property {"PASS"|"FAIL"} status - Verdict
 * @property {string} defect       - Defect class or "None"
 * @property {string} confidence   - YOLO confidence
 * @property {string} cycleTime    - Cycle time
 * @property {string} operator     - Operator node id
 * @property {Object} verificationDetails - X-MCCV checklist
 * @property {Object|null} defectCoordinates - Defect location or null
 * @property {string} gradCamExplanation - XAI rationale
 * @property {number} componentsCount
 */

/**
 * @typedef {Object} HistoryPage
 * @property {HistoryRecord[]} records
 * @property {number} total
 * @property {number} pages
 * @property {number} currentPage
 */