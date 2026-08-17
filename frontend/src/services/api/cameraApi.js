import API_CONFIG from "../../config/api";
import apiClient from "../apiClient";
import { cameraMock } from "../mock/cameraMock";

// Camera service. Reports the real camera connection state from the backend
// (CONNECTED / DISCONNECTED / ERROR / INITIALIZING). The mock layer honestly
// reports DISCONNECTED because no camera device exists in mock mode.
export const cameraApi = {
  async getStatus() {
    if (API_CONFIG.useMock) return cameraMock.getStatus();

    const { data } = await apiClient.get("/camera/status");
    return data;
  },
};
