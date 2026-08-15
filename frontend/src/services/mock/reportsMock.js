import { MOCK_REPORTS } from "./mockData";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const reportsMock = {
  async getReports() {
    await delay(300);
    return MOCK_REPORTS.map((r) => ({ ...r }));
  },

  async createReport(payload) {
    await delay(500);
    return { id: "REP-2026-08A", title: "Compiled PDF Report", status: "COMPILED", ...payload };
  },

  async exportReport(reportId) {
    await delay(400);
    return { reportId, exported: true };
  },
};