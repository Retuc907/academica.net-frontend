import apiClient from "./client";

// ─── Contratos ────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalProfessors: number;
  activeCourses: number;
  institutionalAverage: number;
}

// ─── Servicio ─────────────────────────────────────────────────────────────
export const dashboardApi = {
  /** GET /api/dashboard/stats */
  getStats: async (companyId?: string): Promise<DashboardStats> => {
    const params = companyId ? { companyId } : {};
    const { data } = await apiClient.get<DashboardStats>("/dashboard/stats", { params });
    console.log("📊 [DASHBOARD] stats →", data);
    return data;
  },
};
