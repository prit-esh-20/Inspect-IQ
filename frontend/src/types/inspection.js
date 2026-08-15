/**
 * Data contracts for inspection results.
 *
 * The backend must return objects matching these shapes. All fields are
 * optional at runtime only while the backend is not connected; the UI
 * renders whatever the data layer provides.
 */

/**
 * @typedef {Object} DetectionBox
 * @property {string} id        - Component identifier, e.g. "U1"
 * @property {string} label     - Display label, e.g. "U1 (STM32F4)"
 * @property {number} confidence - Detection confidence 0-100
 * @property {Object} bbox      - Bounding box in % of the viewport
 * @property {number} bbox.left
 * @property {number} bbox.top
 * @property {number} bbox.width
 * @property {number} bbox.height
 */

/**
 * @typedef {Object} Defect
 * @property {string} type      - Defect class, e.g. "Solder Bridge"
 * @property {number} confidence - Defect confidence 0-100
 * @property {Object} location  - Approximate defect location
 * @property {number} location.x
 * @property {number} location.y
 * @property {Object} boundingBox - Defect bounding box (pixels)
 * @property {number} boundingBox.x
 * @property {number} boundingBox.y
 * @property {number} boundingBox.radius
 */

/**
 * @typedef {Object} InspectionResult
 * @property {string} inspectionId   - Unique inspection identifier
 * @property {string} pcbId          - PCB / board identifier
 * @property {string} timestamp      - ISO timestamp of the inspection
 * @property {"PASS"|"FAIL"} status  - Inspection verdict
 * @property {number} confidence     - Overall confidence 0-100
 * @property {string} cycleTime      - Inspection cycle time, e.g. "1.34s"
 * @property {string} model          - Active YOLO model name
 * @property {DetectionBox[]} detections - YOLO detections rendered as boxes
 * @property {Defect[]} defects      - Detected defects (empty when PASS)
 * @property {string} xaiExplanation - XAI / Grad-CAM rationale text
 * @property {string} gradCamLayer   - Layer used for the Grad-CAM map
 * @property {Object} verificationDetails - X-MCCV verification data
 * @property {number} componentsCount - Total components on the board
 */

export const INSPECTION_EMPTY = null;