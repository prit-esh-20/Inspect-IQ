import API_CONFIG from "../../config/api";
import apiClient from "../apiClient";
import { dashboardMock } from "../mock/dashboardMock";

// Dashboard statistics. Uses the static mock while API_CONFIG.useMock is true;
// otherwise fetches from the real backend (GET /dashboard/stats).
export const dashboardApi = {
  async getStatistics() {
    if (API_CONFIG.useMock) return dashboardMock.getStatistics();
    const { data } = await apiClient.get("/dashboard/stats");
    return data;
  },
};