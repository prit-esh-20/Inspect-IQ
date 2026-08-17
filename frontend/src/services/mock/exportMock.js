import { MOCK_INSPECTION_HISTORY } from "./mockData";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const csvEscape = (value) => {
  const str = String(value ?? "");
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
};

// Deterministic CSV export built from the static inspection history records.
// Never invents rows — it exports exactly the records that exist.
export const exportMock = {
  async exportInspectionCsv() {
    await delay(400);
    const rows = MOCK_INSPECTION_HISTORY.map((record) => ({
      pcbId: record.id,
      timestamp: record.timestamp,
      status: record.status,
      defect: record.defect,
      confidence: record.confidence,
      cycleTime: record.cycleTime,
      componentsCount: record.componentsCount,
    }));

    const header = Object.keys(rows[0] || {});
    const lines = [
      header.join(","),
      ...rows.map((row) => header.map((key) => csvEscape(row[key])).join(",")),
    ];
    return { rows: rows.length, csv: lines.join("\n") };
  },
};
