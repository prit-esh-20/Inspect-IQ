import API_CONFIG from "../../config/api";
import apiClient from "../apiClient";
import { xaiMock } from "../mock/xaiMock";

// XAI service. Fetches the Grad-CAM / attention visualization for a specific
// inspection from the backend. The overlay is only ever rendered from real
// heatmap data returned by this service.
export const xaiApi = {
  async getGradCam(inspectionId) {
    if (API_CONFIG.useMock) return xaiMock.getGradCam(inspectionId);

    const { data } = await apiClient.get(`/inspection/${inspectionId}/gradcam`);
    return data;
  },
};
