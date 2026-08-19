// ============================================================================
// MOCK REPORT REPOSITORY
// ----------------------------------------------------------------------------
// In-memory store for report records, shared by the Quality Reports page
// (list / view / download) and the report-generation flow. Seeded with the
// static mock records; newly generated inspection reports are prepended so
// they always appear at the top of the list. Mirrors the backend endpoints
// GET /reports, GET /reports/:id and GET /reports/:id/download.
// ============================================================================

import { MOCK_REPORTS, MOCK_INSPECTION_RESULT } from "./mockData";
import { generateInspectionReport } from "../reports/reportService";

const store = MOCK_REPORTS.map((r) => ({
  ...r,
  pcbId: null,
  filename: null,
  downloadUrl: null,
  blob: null,
}));

// Lazily builds a PDF for seed records (which have no blob yet) using the
// static inspection mock — every record in the list therefore has a real,
// downloadable report.
async function ensureBlob(record) {
  if (record.blob) return;
  const generatedAt = Number.isNaN(Date.parse(record.date)) ? undefined : Date.parse(record.date);
  const built = await generateInspectionReport(MOCK_INSPECTION_RESULT, {
    reportId: record.id,
    generatedAt,
  });
  record.blob = built.blob;
  record.downloadUrl = built.downloadUrl;
  record.filename = built.filename;
  record.pcbId = built.pcbId;
  record.size = built.size;
}

export const reportRepository = {
  list() {
    return store.map(({ blob: _blob, ...rest }) => ({ ...rest }));
  },

  find(reportId) {
    return store.find((r) => r.id === reportId) || null;
  },

  async ensure(reportId) {
    const record = this.find(reportId);
    if (!record) throw new Error("Report not found.");
    await ensureBlob(record);
    return {
      id: record.id,
      title: record.title,
      filename: record.filename,
      pcbId: record.pcbId,
      status: record.status,
      downloadUrl: record.downloadUrl,
    };
  },

  add(report) {
    store.unshift({
      id: report.reportId,
      title: report.title,
      date: report.date,
      size: report.size,
      type: report.type,
      status: report.status,
      pcbId: report.pcbId || null,
      filename: report.filename || null,
      downloadUrl: report.downloadUrl || null,
      blob: report.blob || null,
    });
    return report;
  },
};
