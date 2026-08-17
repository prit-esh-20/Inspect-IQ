import { MOCK_INSPECTION_RESULT } from "./mockData";

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// Static XAI stand-in. Reports the configured Grad-CAM layer and the existing
// static explanation, but never fabricates a heatmap image — a real heatmap
// only exists once the backend serves one.
export const xaiMock = {
  async getGradCam(inspectionId) {
    await delay(400);
    return {
      inspectionId: inspectionId || MOCK_INSPECTION_RESULT.inspectionId,
      layer: MOCK_INSPECTION_RESULT.gradCamLayer,
      heatmapUrl: null,
      available: false,
      explanation: MOCK_INSPECTION_RESULT.xaiExplanation,
      message: "Grad-CAM heatmap unavailable — no backend data.",
    };
  },
};
