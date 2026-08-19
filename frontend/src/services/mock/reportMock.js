import { reportRepository } from "./reportRepository";
import { generateInspectionReport } from "../reports/reportService";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock report-generation stand-in. Builds a real, downloadable PDF from the
// inspection data via the dedicated report service, registers the report in
// the shared repository (so it appears on the Quality Reports page) and
// returns the same record shape the real backend will return.
export const reportMock = {
  async generateReport(inspection, options = {}) {
    if (!inspection) {
      throw new Error("Complete a PCB inspection before generating a report.");
    }
    await delay(500);
    const report = await generateInspectionReport(inspection, options);
    reportRepository.add(report);
    return report;
  },
};
