import { MOCK_INSPECTION_HISTORY } from "./mockData";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// Deterministic history service — filters a fixed static dataset.
export const historyMock = {
  async getHistory({ search = "", status = "ALL", defect = "ALL", page = 1, limit = 10, sortBy = "timestamp", order = "desc" } = {}) {
    await delay(400);
    let records = [...MOCK_INSPECTION_HISTORY];

    if (search) {
      const q = search.toLowerCase();
      records = records.filter((r) => r.id.toLowerCase().includes(q) || r.model.toLowerCase().includes(q));
    }
    if (status !== "ALL") records = records.filter((r) => r.status === status);
    if (defect !== "ALL") records = records.filter((r) => r.defect === defect);

    records.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === "timestamp") {
        valA = new Date(a.timestamp).getTime();
        valB = new Date(b.timestamp).getTime();
      }
      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });

    const total = records.length;
    const offset = (page - 1) * limit;

    return {
      records: records.slice(offset, offset + limit),
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  },

  async getInspectionById(id) {
    await delay(300);
    const item = MOCK_INSPECTION_HISTORY.find((r) => r.id === id);
    if (!item) throw new Error("Record not found");
    return { ...item };
  },
};