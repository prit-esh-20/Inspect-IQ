import API_CONFIG from "../../config/api";
import apiClient from "../apiClient";
import { reportsMock } from "../mock/reportsMock";

export const reportsApi = {
  async getReports() {
    if (API_CONFIG.useMock) return reportsMock.getReports();
    const { data } = await apiClient.get("/reports");
    return data;
  },

  async createReport(payload) {
    if (API_CONFIG.useMock) return reportsMock.createReport(payload);
    const { data } = await apiClient.post("/reports", payload);
    return data;
  },

  async exportReport(reportId) {
    if (API_CONFIG.useMock) return reportsMock.exportReport(reportId);
    const { data } = await apiClient.post(`/reports/${reportId}/export`);
    return data;
  },
};