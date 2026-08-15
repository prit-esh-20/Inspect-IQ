import API_CONFIG from "../../config/api";
import apiClient from "../apiClient";
import { historyMock } from "../mock/historyMock";

export const historyApi = {
  async getHistory(params) {
    if (API_CONFIG.useMock) return historyMock.getHistory(params);
    const { data } = await apiClient.get("/history", { params });
    return data;
  },

  async getInspectionById(id) {
    if (API_CONFIG.useMock) return historyMock.getInspectionById(id);
    const { data } = await apiClient.get(`/history/${id}`);
    return data;
  },
};