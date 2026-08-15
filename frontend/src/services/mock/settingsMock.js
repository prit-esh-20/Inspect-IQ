import { MOCK_SETTINGS } from "./mockData";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const settingsMock = {
  async getSettings() {
    await delay(300);
    return { ...MOCK_SETTINGS };
  },

  async updateSettings(newSettings) {
    await delay(400);
    return { ...MOCK_SETTINGS, ...newSettings };
  },
};