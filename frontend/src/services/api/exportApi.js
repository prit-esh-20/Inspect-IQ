import API_CONFIG from "../../config/api";
import apiClient from "../apiClient";
import { exportMock } from "../mock/exportMock";

// Export service. Streams inspection records from the backend as a CSV
// download when connected; otherwise exports the deterministic static
// records through the mock layer.
export const exportApi = {
  async exportInspectionCsv() {
    if (API_CONFIG.useMock) return exportMock.exportInspectionCsv();

    const { data, headers } = await apiClient.get("/inspection/export/csv", {
      responseType: "blob",
    });
    return {
      rows: Number(headers["x-total-records"] || 0) || 0,
      blob: data,
      filename: headers["content-disposition"],
    };
  },
};
