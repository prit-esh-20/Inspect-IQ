import API_CONFIG from "../../config/api";
import apiClient from "../apiClient";
import { reportMock } from "../mock/reportMock";

// Report generation service for the Dashboard action. When the backend is
// connected it requests a report and returns download information; the
// frontend never builds a PDF itself.
export const reportApi = {
  async generateReport(payload) {
    if (API_CONFIG.useMock) return reportMock.generateReport(payload);

    const { data } = await apiClient.post("/reports/generate", payload);
    return data;
  },
};
