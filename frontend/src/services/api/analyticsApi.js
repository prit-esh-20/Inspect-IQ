import API_CONFIG from "../../config/api";
import apiClient from "../apiClient";
import { analyticsMock } from "../mock/analyticsMock";

export const analyticsApi = {
  async getAnalytics() {
    if (API_CONFIG.useMock) return analyticsMock.getAnalytics();
    const { data } = await apiClient.get("/analytics");
    return data;
  },
};