import apiClient from "./client";

// ─── Contratos ────────────────────────────────────────────────────────────
export interface StudentResponse {
  id: string;
  name: string;
  code: string;
  attendance: number;
  average: number;
  status: string;
}

export interface GradeResponse {
  id: string;
  activity: string;
  subject: string;
  type: string;
  date: string;
  value: number;
  maxValue: number;
  published: boolean;
}

export interface GradeUpdateRequest {
  value: number;
  published?: boolean;
}

// ─── Servicio ─────────────────────────────────────────────────────────────
export const studentsApi = {
  /**
   * GET /api/students
   * Si se pasa professorId, devuelve solo los alumnos de sus cursos.
   */
  getAll: async (params?: { companyId?: string; professorId?: string }): Promise<StudentResponse[]> => {
    const { data } = await apiClient.get<StudentResponse[]>("/students", { params });
    console.log("🎓 [STUDENTS] getAll →", data);
    return data;
  },

  /** GET /api/students/:id/grades */
  getGrades: async (studentId: string): Promise<GradeResponse[]> => {
    const { data } = await apiClient.get<GradeResponse[]>(`/students/${studentId}/grades`);
    console.log("📝 [STUDENTS] grades →", studentId, data);
    return data;
  },
};

// ─── Notas ────────────────────────────────────────────────────────────────
export const gradesApi = {
  /** PUT /api/grades/:id */
  update: async (id: string, dto: GradeUpdateRequest): Promise<GradeResponse> => {
    const { data } = await apiClient.put<GradeResponse>(`/grades/${id}`, dto);
    console.log("📝 [GRADES] update →", data);
    return data;
  },
};
