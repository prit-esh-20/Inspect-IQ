import API_CONFIG from "../../config/api";
import apiClient from "../apiClient";
import { inspectionMock } from "../mock/inspectionMock";

// Inspection service. Later the backend will provide the live camera feed
// (MJPEG / WebSocket / WebRTC) plus inspection results — the UI only renders
// whatever this service returns.
export const inspectionApi = {
  async getLatestInspection() {
    if (API_CONFIG.useMock) return inspectionMock.getLatestInspection();
    const { data } = await apiClient.get("/inspection/latest");
    return data;
  },

  async runInspection() {
    if (API_CONFIG.useMock) return inspectionMock.runInspection();
    const { data } = await apiClient.post("/inspection/run");
    return data;
  },
};