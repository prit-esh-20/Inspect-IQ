import { reportRepository } from "./reportRepository";
import { MOCK_INSPECTION_RESULT } from "./mockData";
import { generateInspectionReport } from "../reports/reportService";

// Mock stand-ins for the Quality Reports endpoints. The repository is shared
// with the report-generation flow, so reports compiled on the Dashboard
// appear here immediately.
export const reportsMock = {
  async getReports() {
    return reportRepository.list();
  },

  // POST /reports — compiles a new report from the centralized mock
  // inspection data and registers it at the top of the list.
  async createReport(payload) {
    const report = await generateInspectionReport(MOCK_INSPECTION_RESULT, {});
    reportRepository.add(report);
    return { ...report, requested: payload || {} };
  },

  // GET /reports/:id — resolves the record and guarantees a downloadable
  // PDF blob exists (used by the VIEW action).
  async getReport(reportId) {
    return reportRepository.ensure(reportId);
  },

  // GET /reports/:id/download — returns the download payload for the record.
  async downloadReport(reportId) {
    return reportRepository.ensure(reportId);
  },
};
