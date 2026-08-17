const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Static report-generation stand-in. Returns a fixed, deterministic report
// record — the same shape the real backend will return. It never builds a PDF
// on the frontend and never claims a download URL that does not exist.
export const reportMock = {
  async generateReport(payload) {
    await delay(500);
    return {
      reportId: "REP-2026-08A",
      title: "Inspection Operations Report",
      status: "COMPILED",
      downloadUrl: null,
      generatedAt: new Date().toISOString(),
      requested: payload || {},
    };
  },
};
