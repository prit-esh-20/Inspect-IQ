import { MOCK_STATISTICS } from "./mockData";

// Fixed network-latency simulation so UI loading states behave like a real API.
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const dashboardMock = {
  async getStatistics() {
    await delay(300);
    return { ...MOCK_STATISTICS };
  },
};