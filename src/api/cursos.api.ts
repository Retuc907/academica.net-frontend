import apiClient from "./client";

// ─── Contratos ────────────────────────────────────────────────────────────
export interface CourseResponse {
  id: string;
  name: string;
  code: string;
  professor: string;
  credits: number;
  average: number;
  schedule: string;
  modality: string;
  status: string;
}

// ─── Servicio ─────────────────────────────────────────────────────────────
export const cursosApi = {
  /** GET /api/courses */
  getAll: async (companyId?: string): Promise<CourseResponse[]> => {
    const params = companyId ? { companyId } : {};
    const { data } = await apiClient.get<CourseResponse[]>("/courses", { params });
    console.log("📚 [COURSES] getAll →", data);
    return data;
  },
};
