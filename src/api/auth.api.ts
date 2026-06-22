import apiClient from "./client";
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
    const { data } = await apiClient.post<LoginResponse>("/auth/login", credentials);
    return data;
  },

  /**
   * POST /auth/logout  (si el backend lo implementa en el futuro)
   */
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },
};
