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

  // runInspection(payload) — payload may carry an uploadId so the backend
  // knows which uploaded PCB image to inspect.
  async runInspection(payload) {
    if (API_CONFIG.useMock) return inspectionMock.runInspection(payload);
    const { data } = await apiClient.post("/inspection/run", payload ?? {});
    return data;
  },
};
