import { MOCK_INSPECTION_RESULT } from "./mockData";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Static inspection service. Returns the same deterministic result every
// time — it never generates, rotates, or mutates inspection data.
export const inspectionMock = {
  async getLatestInspection() {
    await delay(500);
    return { ...MOCK_INSPECTION_RESULT };
  },

  async runInspection() {
    await delay(500);
    return { ...MOCK_INSPECTION_RESULT };
  },
};