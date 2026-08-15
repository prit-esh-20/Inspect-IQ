import API_CONFIG from "../../config/api";
import apiClient from "../apiClient";
import { settingsMock } from "../mock/settingsMock";

export const settingsApi = {
  async getSettings() {
    if (API_CONFIG.useMock) return settingsMock.getSettings();
    const { data } = await apiClient.get("/settings");
    return data;
  },

  async updateSettings(newSettings) {
    if (API_CONFIG.useMock) return settingsMock.updateSettings(newSettings);
    const { data } = await apiClient.put("/settings", newSettings);
    return data;
  },
};