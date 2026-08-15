/**
 * Data contracts for dashboard statistics.
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} boardsInspected       - Boards inspected today
 * @property {number} passRate              - Pass rate today (0-100)
 * @property {number} failedBoards          - Failed boards today
 * @property {number} averageInspectionTime - Avg inspection time in seconds
 * @property {Object} [today]               - Legacy nested shape (temporary)
 * @property {number} [today.inspected]
 * @property {number} [today.pass]
 * @property {number} [today.fail]
 * @property {number} [today.passRate]
 * @property {number} [today.avgCycleTime]
 * @property {number} [today.fps]
 */

export const DASHBOARD_STATS_EMPTY = null;