/**
 * Data contracts for reports and analytics.
 */

/**
 * @typedef {Object} ReportBatch
 * @property {string} id      - Report identifier, e.g. "REP-2026-07A"
 * @property {string} title   - Report title
 * @property {string} date    - Display date
 * @property {string} size    - File size label
 * @property {string} type    - Report category
 * @property {string} status  - "COMPILED" | "ARCHIVED" | ...
 */

/**
 * @typedef {Object} AnalyticsData
 * @property {Object} kpis             - Top-level metric cards
 * @property {Object} qualitySummary   - Donut chart data
 * @property {Object[]} defectChart    - Anomaly category bar chart
 * @property {Object[]} hourlyThroughput - Shift throughput area chart
 * @property {Object[]} trend7Days     - Weekly pass-yield trend
 */