import API_CONFIG from "../../config/api";
import apiClient from "../apiClient";
import { authMock } from "../mock/authMock";

export const authApi = {
  async login(email, password) {
    if (API_CONFIG.useMock) return authMock.login(email, password);
    const { data } = await apiClient.post("/auth/login", { email, password });
    return data;
  },
};