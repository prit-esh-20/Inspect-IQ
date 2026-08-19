import API_CONFIG from "../../config/api";
import apiClient from "../apiClient";
import { reportsMock } from "../mock/reportsMock";

// Quality Reports page service. Mirrors the backend endpoints
// GET /reports, POST /reports, GET /reports/:id and GET /reports/:id/download.
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

  async getReport(reportId) {
    if (API_CONFIG.useMock) return reportsMock.getReport(reportId);
    const { data } = await apiClient.get(`/reports/${reportId}`);
    return data;
  },

  async downloadReport(reportId) {
    if (API_CONFIG.useMock) return reportsMock.downloadReport(reportId);
    const { data } = await apiClient.get(`/reports/${reportId}/download`, { responseType: "blob" });
    const filename = `report-${reportId}.pdf`;
    return { filename, downloadUrl: URL.createObjectURL(data) };
  },
};
