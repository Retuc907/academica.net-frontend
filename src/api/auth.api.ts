import apiClient from "./client";
import axios from "axios";
import type { Role } from "@/types";

// ─── Contratos del backend ────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;       // "Bearer"
  expiresInMs: number;     // 86400000
  id: string;
  name: string;
  email: string;
  role: Role;
  companyId: string;
  companyName: string;
}

// ─── Servicio ─────────────────────────────────────────────────────────────
export const authApi = {
  /**
   * POST /auth/login
   * Body: { email, password }
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const attempt = () => apiClient.post<LoginResponse>("/auth/login", credentials);
    try {
      const { data } = await attempt();
      return data;
    } catch (err: unknown) {
      const isTimeout =
        axios.isAxiosError(err) &&
        (err.code === "ECONNABORTED" || err.message?.includes("timeout"));
      if (!isTimeout) throw err;
      // Render free tier: primera petición tras inactividad puede tardar 30–60 s
      await new Promise((r) => setTimeout(r, 2000));
      const { data } = await attempt();
      return data;
    }
  },

  /**
   * POST /auth/logout  (si el backend lo implementa en el futuro)
   */
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },
};
