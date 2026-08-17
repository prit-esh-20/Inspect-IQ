import API_CONFIG from "../../config/api";
import apiClient from "../apiClient";
import { snapshotMock } from "../mock/snapshotMock";

// Snapshot service. When a real camera backend is connected, requests a
// capture of the actual camera frame. In mock mode the client-side capture
// path (useSnapshot) handles frames displayed in the viewport instead.
export const snapshotApi = {
  async captureFromCamera() {
    if (API_CONFIG.useMock) return snapshotMock.captureFromCamera();

    const { data } = await apiClient.post("/inspection/snapshot", null, {
      responseType: "blob",
    });
    return { blob: data };
  },
};
