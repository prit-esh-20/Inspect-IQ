import API_CONFIG from "../../config/api";
import apiClient from "../apiClient";
import { inspectionHistoryMock } from "../mock/inspectionHistoryMock";

// Inspection History service. All backend URLs live here — components only
// ever call these methods and never hardcode endpoints. When the backend is
// ready, flip API_CONFIG.useMock to false and nothing else changes.
export const inspectionHistoryApi = {
  // GET /inspection-history?page=1&pageSize=20&search=...&status=PASS&defect=...
  async getInspectionHistory(params) {
    if (API_CONFIG.useMock) return inspectionHistoryMock.getInspectionHistory(params);
    const { data } = await apiClient.get("/inspection-history", { params });
    return data;
  },

  // GET /inspection-history/{inspectionId}
  async getInspectionDetails(id) {
    if (API_CONFIG.useMock) return inspectionHistoryMock.getInspectionDetails(id);
    const { data } = await apiClient.get(`/inspection-history/${id}`);
    return data;
  },

  // GET /inspection-history/pcb/{pcbId}
  async getInspectionByPcbId(pcbId) {
    if (API_CONFIG.useMock) return inspectionHistoryMock.getInspectionByPcbId(pcbId);
    const { data } = await apiClient.get(`/inspection-history/pcb/${pcbId}`);
    return data;
  },
};