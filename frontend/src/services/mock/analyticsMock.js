import { MOCK_ANALYTICS } from "./mockData";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const analyticsMock = {
  async getAnalytics() {
    await delay(400);
    return {
      ...MOCK_ANALYTICS,
      qualitySummary: MOCK_ANALYTICS.qualitySummary.map((s) => ({ ...s })),
      donutStats: MOCK_ANALYTICS.donutStats.map((s) => ({ ...s })),
    };
  },
};